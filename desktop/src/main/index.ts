/**
 * ShepWhispr Desktop App - Main Process
 * 
 * Mac-first Electron app for voice-to-structured-prompt.
 * Global hotkey triggers recording, result pastes at cursor.
 */

import { app, BrowserWindow, globalShortcut, ipcMain, clipboard, Tray, Menu, nativeImage } from 'electron';
import * as path from 'path';
import { AudioRecorder } from './audio-recorder.js';
import { APIClient } from './api-client.js';
import { transcribeLocal } from './local-whisper.js';
import { startEmbeddedBackend, stopEmbeddedBackend } from './embedded-backend.js';

// Keep a global reference to prevent garbage collection
let mainWindow: BrowserWindow | null = null;
let captureWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isRecording = false;
let audioRecorder: AudioRecorder | null = null;
let apiClient: APIClient | null = null;

// AI usage tracking (synced from backend)
let aiPromptsRemaining = 30;
let isAtAILimit = false;

// Store sessions in memory (will be persisted later)
interface Session {
  id: string;
  timestamp: Date;
  rawSpeech: string;
  structuredPrompt: string;
  intent: string;
  confidence: number;
  aiEnhanced?: boolean;
}

let sessions: Session[] = [];

/**
 * Create the main Recent Sessions window
 */
function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    title: 'ShepWhispr',
    show: false, // Hidden by default, shown when needed
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * Create the floating capture bar (shows during recording)
 */
function createCaptureWindow(): void {
  captureWindow = new BrowserWindow({
    width: 250,
    height: 80,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload.js')
    }
  });

  captureWindow.loadFile(path.join(__dirname, '../renderer/capture-bar.html'));
}

/**
 * Create menu bar tray icon with clickable record button
 */
function createTray(): void {
  // Load proper macOS template icon (16x16 PNG with @2x for Retina)
  // macOS automatically uses @2x version on Retina displays
  const iconPath = path.join(__dirname, '../assets/icons/trayIconTemplate.png');
  const icon = nativeImage.createFromPath(iconPath);
  icon.setTemplateImage(true); // Make it adapt to light/dark mode
  
  tray = new Tray(icon);
  
  updateTrayMenu();
  
  tray.setToolTip('ShepWhispr - Click to record');
}

/**
 * Update tray menu based on recording state and AI usage
 */
function updateTrayMenu(): void {
  if (!tray) return;
  
  // Build AI status label
  const aiStatusLabel = isAtAILimit 
    ? '⚠️ AI Limit Reached (using basic mode)'
    : `✨ ${aiPromptsRemaining} AI prompts left today`;
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: isRecording ? '⏹ Stop Recording' : '⏺ Start Recording',
      click: () => {
        if (isRecording) {
          stopRecording();
        } else {
          startRecording();
        }
      }
    },
    { type: 'separator' },
    {
      label: aiStatusLabel,
      enabled: false, // Just for display
    },
    { type: 'separator' },
    {
      label: 'Recent Sessions',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);
  
  tray.setContextMenu(contextMenu);
}

/**
 * Register global hotkey for tap-to-start, tap-to-stop recording
 */
function registerHotkey(): void {
  // Default: Ctrl+Shift+R on Mac
  const hotkey = 'Control+Shift+R';
  
  const registered = globalShortcut.register(hotkey, () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  });

  if (!registered) {
    console.error(`Failed to register hotkey: ${hotkey}`);
  } else {
    console.log(`Hotkey registered: ${hotkey}`);
  }
}

/**
 * Start recording - uses local audio recording + Whisper
 */
async function startRecording(): Promise<void> {
  console.log('Recording started...');
  isRecording = true;
  updateTrayMenu(); // Update menu bar button
  
  // Show capture bar
  if (captureWindow) {
    captureWindow.show();
    captureWindow.center();
  }
  
  // Initialize audio recorder if needed
  if (!audioRecorder) {
    audioRecorder = new AudioRecorder({
      sampleRate: 16000,
      channels: 1,
      bitDepth: 16,
    });
  }
  
  try {
    await audioRecorder.start();
    console.log('Audio recording started (will transcribe locally with Whisper)');
  } catch (error) {
    console.error('Failed to start recording:', error);
    isRecording = false;
    if (captureWindow) {
      captureWindow.hide();
    }
  }
}

/**
 * Stop recording and process with local Whisper
 */
async function stopRecording(): Promise<void> {
  console.log('Recording stopped, processing...');
  isRecording = false;
  updateTrayMenu(); // Update menu bar button
  
  // Hide capture bar
  if (captureWindow) {
    captureWindow.hide();
  }
  
  if (!audioRecorder) {
    console.error('No audio recorder initialized');
    return;
  }
  
  try {
    // Stop recording and get audio file path
    const audioBuffer = await audioRecorder.stop();
    console.log('Audio recorded, size:', audioBuffer.length);
    
    // Save audio to temp file for Whisper
    const fs = await import('fs');
    const os = await import('os');
    const path = await import('path');
    const tempFile = path.join(os.tmpdir(), `whisper-${Date.now()}.wav`);
    fs.writeFileSync(tempFile, audioBuffer);
    
    // Transcribe locally with Whisper
    console.log('Transcribing with local Whisper...');
    const transcription = await transcribeLocal(tempFile);
    
    // Clean up temp file
    fs.unlinkSync(tempFile);
    
    if (!transcription.text || transcription.text.trim() === '') {
      console.log('No speech detected');
      return;
    }
    
    console.log('Transcript:', transcription.text);
    
    // Initialize API client if needed
    if (!apiClient) {
      apiClient = new APIClient('http://localhost:3000');
    }
    
    // Get IDE context (for now, use defaults)
    const context = {
      activeFile: 'unknown',
      ideType: 'vscode' as const,
    };
    
    // Send transcript to API for transformation
    console.log('Sending transcript to API...');
    const response = await apiClient.textToPrompt(transcription.text, context);
    
    if (response.success && response.data) {
      // Update AI usage tracking from response
      const wasAtLimit = isAtAILimit;
      aiPromptsRemaining = response.data.aiPromptsRemaining ?? aiPromptsRemaining;
      isAtAILimit = response.data.isAtLimit ?? false;
      
      // Update tray menu to show new count
      updateTrayMenu();
      
      // Log AI status
      console.log('AI Status:', {
        aiEnhanced: response.data.aiEnhanced,
        aiPromptsRemaining,
        isAtAILimit,
      });
      
      // Create session
      const session: Session = {
        id: `session-${Date.now()}`,
        timestamp: new Date(),
        rawSpeech: response.data.rawSpeech,
        structuredPrompt: response.data.structuredPrompt,
        intent: response.data.intent,
        confidence: response.data.confidence,
        aiEnhanced: response.data.aiEnhanced,
      };
      
      sessions.unshift(session);
      console.log('Session created:', session.id, response.data.aiEnhanced ? '(AI enhanced)' : '(rule-based)');
      
      // Notify renderer of new session
      if (mainWindow) {
        mainWindow.webContents.send('new-session', session);
      }
      
      // Show main window
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
      
      // Show limit reached dialog if user just hit the limit
      if (!wasAtLimit && isAtAILimit) {
        const { dialog } = await import('electron');
        dialog.showMessageBox({
          type: 'info',
          title: 'AI Limit Reached',
          message: 'You\'ve used all 30 AI-enhanced prompts today!',
          detail: 'Don\'t worry - ShepWhispr still works! Your prompts will use our template-based system until midnight when your AI limit resets.\n\nHelp us build the Pro version by sharing your feedback!',
          buttons: ['Give Feedback', 'Continue'],
          defaultId: 1,
        }).then(result => {
          if (result.response === 0) {
            // Open feedback form
            require('electron').shell.openExternal('https://forms.fillout.com/t/44XbDMDJYMus');
          }
        });
      }
    } else {
      console.error('API error:', response.error?.message);
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  } catch (error) {
    console.error('Error processing recording:', error);
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  }
}

/**
 * IPC Handlers for session management (T024)
 */

// Get all sessions
ipcMain.handle('get-sessions', () => {
  return sessions;
});

// Paste session to clipboard
ipcMain.handle('paste-session', (_event, id: string) => {
  const session = sessions.find(s => s.id === id);
  if (session) {
    clipboard.writeText(session.structuredPrompt);
    console.log('Session pasted to clipboard:', id);
    return { success: true };
  }
  return { success: false, error: 'Session not found' };
});

// Copy session to clipboard
ipcMain.handle('copy-session', (_event, id: string) => {
  const session = sessions.find(s => s.id === id);
  if (session) {
    clipboard.writeText(session.structuredPrompt);
    console.log('Session copied to clipboard:', id);
    return { success: true };
  }
  return { success: false, error: 'Session not found' };
});

// App lifecycle
app.whenReady().then(async () => {
  console.log('🐑 ShepWhispr starting...');
  
  // Start embedded backend first
  try {
    await startEmbeddedBackend();
    console.log('✅ Backend ready');
  } catch (error) {
    console.error('❌ Failed to start embedded backend:', error);
    console.log('Falling back to external backend at localhost:3000');
  }
  
  createMainWindow();
  createCaptureWindow();
  createTray();
  registerHotkey();
  
  console.log('🎉 ShepWhispr ready!');
  console.log('Press Ctrl+Shift+R to start recording');
  console.log('Or click the menu bar icon');
});

app.on('window-all-closed', () => {
  // On macOS, apps typically stay open until Cmd+Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  // Stop the embedded backend when app quits
  stopEmbeddedBackend();
  globalShortcut.unregisterAll();
});

app.on('activate', () => {
  // On macOS, re-create window when dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
