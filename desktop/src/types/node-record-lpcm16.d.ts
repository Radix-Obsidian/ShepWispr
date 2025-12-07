declare module 'node-record-lpcm16' {
  interface RecordOptions {
    sampleRate?: number;
    channels?: number;
    bitDepth?: number;
    encoding?: string;
    device?: string | null;
  }

  interface Recording {
    stream(): NodeJS.ReadableStream;
    stop(): void;
  }

  function record(options: RecordOptions): Recording;

  export = record;
}
