/**
 * Type declarations for renderer process
 */

interface Session {
  id: string;
  timestamp: string | Date;
  rawSpeech: string;
  structuredPrompt: string;
  intent: string;
  confidence: number;
}

interface ShepwhisprAPI {
  getSessions: () => Promise<Session[]>;
  pasteSession: (id: string) => Promise<void>;
  copySession: (id: string) => Promise<void>;
  onNewSession: (callback: (session: Session) => void) => void;
  onRecordingStart: (callback: () => void) => void;
  onRecordingStop: (callback: () => void) => void;
}

declare global {
  interface Window {
    shepwhispr: ShepwhisprAPI;
  }
}

export {};
