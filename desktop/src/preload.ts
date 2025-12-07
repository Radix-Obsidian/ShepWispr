/**
 * ShepWhispr Desktop - Preload Script
 * 
 * Exposes safe APIs to the renderer process
 */

import { contextBridge, ipcRenderer } from 'electron';

// Expose safe APIs to renderer
contextBridge.exposeInMainWorld('shepwhispr', {
  // Session management
  getSessions: () => ipcRenderer.invoke('get-sessions'),
  
  // Actions
  pasteSession: (id: string) => ipcRenderer.invoke('paste-session', id),
  copySession: (id: string) => ipcRenderer.invoke('copy-session', id),
  
  // Events
  onNewSession: (callback: (session: unknown) => void) => {
    ipcRenderer.on('new-session', (_event, session) => callback(session));
  },
  
  onRecordingStart: (callback: () => void) => {
    ipcRenderer.on('recording-start', () => callback());
  },
  
  onRecordingStop: (callback: () => void) => {
    ipcRenderer.on('recording-stop', () => callback());
  }
});

// Expose electronAPI for capture bar (Web Speech API)
contextBridge.exposeInMainWorld('electronAPI', {
  // Send live transcript from Web Speech API to main process
  sendTranscript: (transcript: string) => {
    ipcRenderer.send('live-transcript', transcript);
  },
  
  // Get final transcript when stopping
  requestStop: () => ipcRenderer.invoke('request-stop')
});

console.log('ShepWhispr preload ready');
