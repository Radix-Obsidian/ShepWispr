import OpenAI, { toFile } from 'openai';
import { TranscriptionError, AudioEmptyError } from '../../utils/errors.js';
import { logger } from '../../utils/logger.js';

/**
 * Result from speech-to-text transcription
 */
export interface TranscriptionResult {
  rawText: string;
  confidence: number;
  language: string;
  durationMs: number;
}

// Lazy-initialized OpenAI client (env vars load after imports)
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

/**
 * Transcribe audio using OpenAI Whisper API
 * 
 * @param audioBase64 - Base64 encoded audio data
 * @returns Transcription result with raw text and metadata
 * @throws AudioEmptyError if audio is empty
 * @throws TranscriptionError if transcription fails
 */
export async function transcribeAudio(audioBase64: string): Promise<TranscriptionResult> {
  const startTime = Date.now();

  // Validate input
  if (!audioBase64 || audioBase64.trim() === '') {
    throw new AudioEmptyError();
  }

  try {
    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audioBase64, 'base64');
    
    // Check minimum size (empty or too small audio)
    if (audioBuffer.length < 100) {
      throw new AudioEmptyError();
    }

    // Detect format from buffer header (WAV starts with 'RIFF')
    const isWav = audioBuffer.slice(0, 4).toString() === 'RIFF';
    const fileName = isWav ? 'audio.wav' : 'audio.webm';

    logger.debug('Sending audio to Whisper API', {
      sizeBytes: audioBuffer.length,
      isWav,
      fileName,
    });

    // Use OpenAI's toFile helper for proper Node.js file handling
    const audioFile = await toFile(audioBuffer, fileName);

    // Call Whisper API
    const transcription = await getOpenAIClient().audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en', // V1: English only
      response_format: 'verbose_json',
    });

    const durationMs = Date.now() - startTime;

    logger.info('Transcription complete', {
      textLength: transcription.text.length,
      durationMs,
    });

    // Whisper doesn't provide confidence directly, estimate based on response
    // In production, you might use word-level timestamps for better confidence
    const confidence = transcription.text.length > 0 ? 0.9 : 0.0;

    return {
      rawText: transcription.text,
      confidence,
      language: transcription.language || 'en',
      durationMs,
    };
  } catch (error) {
    // Log full error details for debugging
    logger.error('Transcription failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorDetails: error instanceof OpenAI.APIError ? {
        status: error.status,
        code: error.code,
        type: error.type,
      } : undefined,
    });
    console.error('Full transcription error:', error);

    // Handle specific OpenAI errors
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        throw new TranscriptionError('The AI is busy. Please wait a moment and try again.');
      }
      if (error.status === 400) {
        throw new TranscriptionError("Couldn't process that audio. Try speaking more clearly.");
      }
    }

    // Re-throw our custom errors
    if (error instanceof AudioEmptyError || error instanceof TranscriptionError) {
      throw error;
    }

    // Generic transcription error for unknown issues
    throw new TranscriptionError();
  }
}
