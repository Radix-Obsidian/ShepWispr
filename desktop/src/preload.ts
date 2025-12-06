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

console.log('ShepWhispr preload ready');
