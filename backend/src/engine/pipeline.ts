import type { VoiceToPromptRequest, IntentType } from '../schemas/api.js';
import { transcribeAudio } from './stt/whisper.js';
import { normalizeTranscription } from './normalizer/index.js';
import { classifyIntent } from './intent/classifier.js';
import { composePrompt } from './composer/index.js';
import { logger } from '../utils/logger.js';
import { enhancePromptWithAI, isAIEnhancementAvailable } from './ai/enhancer.js';
import { 
  canUseAI, 
  recordAIPromptUsed, 
  recordRuleBasedPromptUsed,
  getUsageStats,
} from './usage/tracker.js';

/**
 * Pipeline result after full processing
 */
export interface PipelineResult {
  rawSpeech: string;
  structuredPrompt: string;
  intent: IntentType;
  confidence: number;
  processingTimeMs: number;
  // AI enhancement metadata
  aiEnhanced: boolean;
  aiModel?: string;
  aiPromptsRemaining: number;
  isAtLimit: boolean;
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

  // Voice path: also uses AI enhancement with same limits
  const usageStats = getUsageStats();
  
  return {
    rawSpeech: transcription.rawText,
    structuredPrompt: composed.markdown,
    intent: intent.type,
    confidence: intent.confidence,
    processingTimeMs,
    aiEnhanced: false, // Voice path uses rule-based for now
    aiPromptsRemaining: usageStats.aiPromptsRemaining,
    isAtLimit: usageStats.isAtLimit,
  };
}

/**
 * Process text directly (skip STT) - uses Apple's native speech recognition
 * This is the preferred path for Mac users
 * 
 * AI Enhancement Flow:
 * - First 30 prompts/day: Enhanced with Claude Haiku
 * - After 30: Falls back to rule-based templates
 */
export async function processTextRequest(
  text: string,
  context: { activeFile?: string; ideType?: string; selectedCode?: string; cursorLine?: number; languageId?: string }
): Promise<PipelineResult> {
  const startTime = Date.now();

  logger.debug('Pipeline: Starting text processing (skip STT)');
  
  // Step 1: Normalize text (same as voice path, but starting with text)
  logger.debug('Pipeline: Starting normalization');
  const normalized = normalizeTranscription(text);
  logger.debug('Pipeline: Normalization complete', { 
    tone: normalized.tone,
    hasGoal: !!normalized.possibleGoal,
  });

  // Step 2: Classify intent
  logger.debug('Pipeline: Starting intent classification');
  const intent = classifyIntent(normalized.cleanText);
  logger.debug('Pipeline: Classification complete', { 
    intent: intent.type,
    confidence: intent.confidence,
  });

  // Step 3: Compose structured prompt (rule-based)
  logger.debug('Pipeline: Starting prompt composition');
  let ideType: 'cursor' | 'vscode' | 'windsurf' = 'vscode';
  if (context.ideType === 'cursor' || context.ideType === 'windsurf') {
    ideType = context.ideType;
  }
  const ideContext = {
    activeFile: context.activeFile || 'unknown',
    ideType,
    selectedCode: context.selectedCode,
    cursorLine: context.cursorLine,
  };
  const composed = composePrompt(normalized, intent, ideContext);
  logger.debug('Pipeline: Composition complete', { 
    schemaId: composed.metadata.schemaId,
  });

  // Step 4: AI Enhancement (if within daily limit)
  let finalPrompt = composed.markdown;
  let aiEnhanced = false;
  let aiModel: string | undefined;
  
  const usageStats = getUsageStats();
  const shouldTryAI = canUseAI() && isAIEnhancementAvailable();
  
  if (shouldTryAI) {
    logger.debug('Pipeline: Attempting AI enhancement', {
      aiPromptsRemaining: usageStats.aiPromptsRemaining,
    });
    
    const enhanceResult = await enhancePromptWithAI({
      originalText: text,
      intent: intent.type,
      ruleBasedPrompt: composed.markdown,
      context: {
        activeFile: context.activeFile,
        selectedCode: context.selectedCode,
        ideType: context.ideType,
      },
    });
    
    if (enhanceResult.wasEnhanced) {
      finalPrompt = enhanceResult.enhancedPrompt;
      aiEnhanced = true;
      aiModel = enhanceResult.model;
      recordAIPromptUsed();
      
      logger.info('Pipeline: AI enhancement successful', {
        model: enhanceResult.model,
        latencyMs: enhanceResult.latencyMs,
      });
    } else {
      // AI failed, use rule-based
      recordRuleBasedPromptUsed();
      logger.warn('Pipeline: AI enhancement failed, using rule-based', {
        error: enhanceResult.error,
      });
    }
  } else {
    // At limit or AI not available, use rule-based
    recordRuleBasedPromptUsed();
    
    if (usageStats.isAtLimit) {
      logger.info('Pipeline: At daily AI limit, using rule-based', {
        aiPromptsUsed: usageStats.aiPromptsUsed,
        dailyLimit: usageStats.dailyLimit,
      });
    } else {
      logger.debug('Pipeline: AI not available, using rule-based');
    }
  }

  const processingTimeMs = Date.now() - startTime;
  const finalUsageStats = getUsageStats();

  logger.info('Pipeline complete (text path)', {
    intent: intent.type,
    confidence: intent.confidence,
    processingTimeMs,
    aiEnhanced,
    aiPromptsRemaining: finalUsageStats.aiPromptsRemaining,
  });

  return {
    rawSpeech: text,
    structuredPrompt: finalPrompt,
    intent: intent.type,
    confidence: intent.confidence,
    processingTimeMs,
    aiEnhanced,
    aiModel,
    aiPromptsRemaining: finalUsageStats.aiPromptsRemaining,
    isAtLimit: finalUsageStats.isAtLimit,
  };
}
