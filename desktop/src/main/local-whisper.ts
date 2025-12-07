/**
 * Local Whisper Transcription
 * Simplest possible approach - just works
 */

import whisper from 'whisper-node';

export interface TranscriptionResult {
  text: string;
  segments: Array<{
    start: string;
    end: string;
    speech: string;
  }>;
}

/**
 * Transcribe audio file using local Whisper
 * Uses default model (base.en) - download with: npx whisper-node download
 */
export async function transcribeLocal(audioFilePath: string): Promise<TranscriptionResult> {
  console.log('Transcribing with Whisper:', audioFilePath);
  
  try {
    // Simplest possible usage - just pass the file path
    // Model must be downloaded first: npx whisper-node download
    const result = await whisper(audioFilePath);
    
    if (!result || result.length === 0) {
      return { text: '', segments: [] };
    }
    
    // Combine all segments into full text
    const fullText = result
      .map((segment: any) => segment.speech)
      .join(' ')
      .replace(/\[\s*BLANK\s*_\s*AUDIO\s*\]/gi, '') // Remove blank audio markers
      .replace(/\s+/g, ' ') // Clean up extra spaces
      .trim();
    
    console.log('✓ Transcription:', fullText);
    
    return {
      text: fullText,
      segments: result,
    };
  } catch (error) {
    console.error('✗ Whisper error:', error);
    throw error;
  }
}

export default { transcribeLocal };
