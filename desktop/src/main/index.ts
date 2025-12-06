/**
 * ShepWhispr Desktop App - Main Process
 * 
 * Mac-first Electron app for voice-to-structured-prompt.
 * Global hotkey triggers recording, result pastes at cursor.
 */

import { app, BrowserWindow, globalShortcut } from 'electron';
import * as path from 'path';

// Keep a global reference to prevent garbage collection
let mainWindow: BrowserWindow | null = null;
let captureWindow: BrowserWindow | null = null;
let isRecording = false;

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
    width: 200,
    height: 60,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  captureWindow.loadFile(path.join(__dirname, '../renderer/capture-bar.html'));
}

/**
 * Register global hotkey for tap-to-start, tap-to-stop recording
 */
function registerHotkey(): void {
  // Default: Cmd+Shift+; on Mac
  const hotkey = 'CommandOrControl+Shift+;';
  
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
 * Start audio recording
 */
function startRecording(): void {
  console.log('Recording started...');
  isRecording = true;
  
  // Show capture bar
  if (captureWindow) {
    captureWindow.show();
    // Center on screen
    captureWindow.center();
  }
  
  // TODO: T021 - Implement actual audio recording
}

/**
 * Stop recording and process audio
 */
async function stopRecording(): Promise<void> {
  console.log('Recording stopped, processing...');
  isRecording = false;
  
  // Hide capture bar
  if (captureWindow) {
    captureWindow.hide();
  }
  
  // TODO: T021 - Stop actual recording
  // TODO: T022 - Send to API
  // TODO: T038 - Paste result or show in Recent Sessions
  
  // For now, show the main window
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  }
}

// App lifecycle
app.whenReady().then(() => {
  createMainWindow();
  createCaptureWindow();
  registerHotkey();
  
  console.log('ShepWhispr ready!');
  console.log('Press Cmd+Shift+; to start recording');
});

app.on('window-all-closed', () => {
  // On macOS, apps typically stay open until Cmd+Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, re-create window when dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

app.on('will-quit', () => {
  // Unregister all shortcuts
  globalShortcut.unregisterAll();
});
