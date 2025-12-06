import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

// Set environment variable before any imports
beforeAll(() => {
  process.env.OPENAI_API_KEY = 'test-key-for-mocking';
});

// Mock OpenAI before importing the module
vi.mock('openai', () => {
  const mockCreate = vi.fn();
  return {
    default: vi.fn().mockImplementation(() => ({
      audio: {
        transcriptions: {
          create: mockCreate,
        },
      },
    })),
    __mockCreate: mockCreate,
  };
});

// Import after mocking
import { transcribeAudio, TranscriptionResult } from '../../src/engine/stt/whisper.js';
import OpenAI from 'openai';

describe('STT Handler - Whisper', () => {
  let mockCreate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    // Get the mock function
    const openaiInstance = new OpenAI({ apiKey: 'test' });
    mockCreate = openaiInstance.audio.transcriptions.create as ReturnType<typeof vi.fn>;
  });

  it('should transcribe valid audio and return rawText', async () => {
    mockCreate.mockResolvedValueOnce({
      text: 'Hello world',
      language: 'en',
    });

    const mockAudioBase64 = Buffer.from('x'.repeat(200)).toString('base64');
    
    const result = await transcribeAudio(mockAudioBase64);
    
    expect(result).toHaveProperty('rawText');
    expect(result).toHaveProperty('confidence');
    expect(result.rawText).toBe('Hello world');
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it('should throw TranscriptionError for empty audio', async () => {
    await expect(transcribeAudio('')).rejects.toThrow();
  });

  it('should return confidence score between 0 and 1', async () => {
    mockCreate.mockResolvedValueOnce({
      text: 'Test transcription',
      language: 'en',
    });

    const mockAudioBase64 = Buffer.from('x'.repeat(200)).toString('base64');
    
    const result = await transcribeAudio(mockAudioBase64);
    
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it('should handle API errors gracefully', async () => {
    mockCreate.mockRejectedValueOnce(new Error('API Error'));

    const mockAudioBase64 = Buffer.from('x'.repeat(200)).toString('base64');
    
    // This should throw a user-friendly error
    await expect(transcribeAudio(mockAudioBase64)).rejects.toThrow();
  });
});

describe('TranscriptionResult type', () => {
  it('should have correct shape', () => {
    const result: TranscriptionResult = {
      rawText: 'Hello world',
      confidence: 0.95,
      language: 'en',
      durationMs: 1500,
    };

    expect(result.rawText).toBe('Hello world');
    expect(result.confidence).toBe(0.95);
    expect(result.language).toBe('en');
    expect(result.durationMs).toBe(1500);
  });
});
