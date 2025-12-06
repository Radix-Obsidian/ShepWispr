import type { VoiceToPromptRequest, IntentType } from '../schemas/api.js';
import { transcribeAudio } from './stt/whisper.js';
import { normalizeTranscription } from './normalizer/index.js';
import { classifyIntent } from './intent/classifier.js';
import { composePrompt } from './composer/index.js';
import { logger } from '../utils/logger.js';

/**
 * Pipeline result after full processing
 */
export interface PipelineResult {
  rawSpeech: string;
  structuredPrompt: string;
  intent: IntentType;
  confidence: number;
  processingTimeMs: number;
}

/**
 * Main pipeline orchestrator
 * Processes voice input through: STT → Normalize → Classify → Select → Compose
 */
export async function processVoiceRequest(request: VoiceToPromptRequest): Promise<PipelineResult> {
  const startTime = Date.now();

  // Step 1: Speech-to-Text
  logger.debug('Pipeline: Starting STT');
  const transcription = await transcribeAudio(request.audio);
  logger.debug('Pipeline: STT complete', { textLength: transcription.rawText.length });

  // Step 2: Normalize transcription
  logger.debug('Pipeline: Starting normalization');
  const normalized = normalizeTranscription(transcription.rawText);
  logger.debug('Pipeline: Normalization complete', { 
    tone: normalized.tone,
    hasGoal: !!normalized.possibleGoal,
  });

  // Step 3: Classify intent
  logger.debug('Pipeline: Starting intent classification');
  const intent = classifyIntent(normalized.cleanText);
  logger.debug('Pipeline: Classification complete', { 
    intent: intent.type,
    confidence: intent.confidence,
  });

  // Step 4: Compose structured prompt (schema selection happens inside)
  logger.debug('Pipeline: Starting prompt composition');
  const composed = composePrompt(normalized, intent, request.context);
  logger.debug('Pipeline: Composition complete', { 
    schemaId: composed.metadata.schemaId,
  });

  const processingTimeMs = Date.now() - startTime;

  logger.info('Pipeline complete', {
    intent: intent.type,
    confidence: intent.confidence,
    processingTimeMs,
  });

  return {
    rawSpeech: transcription.rawText,
    structuredPrompt: composed.markdown,
    intent: intent.type,
    confidence: intent.confidence,
    processingTimeMs,
  };
}
