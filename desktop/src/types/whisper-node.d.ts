declare module 'whisper-node' {
  interface WhisperOptions {
    modelName?: string;
    modelPath?: string;
    whisperOptions?: {
      language?: string;
      word_timestamps?: boolean;
    };
  }

  interface TranscriptSegment {
    start: string;
    end: string;
    speech: string;
  }

  function whisper(filePath: string, options?: WhisperOptions): Promise<TranscriptSegment[]>;
  
  export default whisper;
}
