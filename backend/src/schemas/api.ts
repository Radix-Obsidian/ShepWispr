import { z } from 'zod';

/**
 * IDE Context - information about the current IDE state
 */
export const IDEContextSchema = z.object({
  activeFile: z.string().min(1, 'Active file path is required'),
  selectedCode: z.string().optional(),
  cursorLine: z.number().int().positive().optional(),
  ideType: z.enum(['vscode', 'cursor', 'windsurf']),
});

export type IDEContext = z.infer<typeof IDEContextSchema>;

/**
 * Voice-to-Prompt Request
 */
export const VoiceToPromptRequestSchema = z.object({
  audio: z.string().min(1, 'Audio data is required'),
  context: IDEContextSchema,
});

export type VoiceToPromptRequest = z.infer<typeof VoiceToPromptRequestSchema>;

/**
 * Intent types
 */
export const IntentTypeSchema = z.enum([
  'bug_fix',
  'add_feature',
  'explain_code',
  'spec_generation',
]);

export type IntentType = z.infer<typeof IntentTypeSchema>;

/**
 * Tone types
 */
export const ToneSchema = z.enum([
  'neutral',
  'frustrated',
  'excited',
  'confused',
  'urgent',
]);

export type Tone = z.infer<typeof ToneSchema>;

/**
 * Transcription result from STT
 */
export const TranscriptionSchema = z.object({
  rawText: z.string(),
  confidence: z.number().min(0).max(1),
  language: z.string().default('en'),
  durationMs: z.number().int().nonnegative(),
});

export type Transcription = z.infer<typeof TranscriptionSchema>;

/**
 * Normalized text result
 */
export const NormalizedTextSchema = z.object({
  cleanText: z.string(),
  tone: ToneSchema,
  possibleGoal: z.string(),
  frustrations: z.array(z.string()),
});

export type NormalizedText = z.infer<typeof NormalizedTextSchema>;

/**
 * Intent classification result
 */
export const IntentSchema = z.object({
  type: IntentTypeSchema,
  confidence: z.number().min(0).max(1),
  keywords: z.array(z.string()),
});

export type Intent = z.infer<typeof IntentSchema>;

/**
 * Voice-to-Prompt Success Response
 */
export const VoiceToPromptSuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    rawSpeech: z.string(),
    structuredPrompt: z.string(),
    intent: IntentTypeSchema,
    confidence: z.number().min(0).max(1),
    processingTimeMs: z.number().int().nonnegative(),
  }),
});

export type VoiceToPromptSuccessResponse = z.infer<typeof VoiceToPromptSuccessResponseSchema>;

/**
 * Error codes
 */
export const ErrorCodeSchema = z.enum([
  'NETWORK_ERROR',
  'TRANSCRIPTION_FAILED',
  'RATE_LIMITED',
  'AUDIO_TOO_LONG',
  'AUDIO_EMPTY',
  'INVALID_REQUEST',
  'INTERNAL_ERROR',
  'NOT_IMPLEMENTED',
]);

export type ErrorCode = z.infer<typeof ErrorCodeSchema>;

/**
 * Voice-to-Prompt Error Response
 */
export const VoiceToPromptErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: ErrorCodeSchema,
    message: z.string(),
    retryable: z.boolean(),
  }),
});

export type VoiceToPromptErrorResponse = z.infer<typeof VoiceToPromptErrorResponseSchema>;
