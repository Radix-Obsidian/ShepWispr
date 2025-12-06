/**
 * Custom error classes for ShepWhisper API
 * 
 * Design principles (from shep-visionary-founder.md):
 * - No jargon - messages should be clear to non-technical founders
 * - Empathy - acknowledge frustration, suggest next steps
 * - Safety - never expose internal details to users
 */

export type ErrorCode =
  | 'NETWORK_ERROR'
  | 'TRANSCRIPTION_FAILED'
  | 'RATE_LIMITED'
  | 'AUDIO_TOO_LONG'
  | 'AUDIO_EMPTY'
  | 'INVALID_REQUEST'
  | 'INTERNAL_ERROR'
  | 'NOT_IMPLEMENTED'
  | 'PIPELINE_ERROR'
  | 'RATE_LIMIT'
  | 'SERVICE_UNAVAILABLE'
  | 'UNAUTHORIZED'
  | 'INTENT_UNCLEAR'
  | 'AUDIO_TOO_SHORT';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly suggestion?: string;

  constructor(
    message: string, 
    statusCode: number = 500, 
    code: string = 'INTERNAL_ERROR',
    suggestion?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.suggestion = suggestion;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Get user-friendly error response
   */
  toUserResponse(): { code: string; message: string; suggestion?: string } {
    return {
      code: this.code,
      message: this.message,
      suggestion: this.suggestion,
    };
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Invalid request data') {
    super(
      message, 
      400, 
      'INVALID_REQUEST',
      'Check that all required fields are filled in correctly.'
    );
  }
}

export class TranscriptionError extends AppError {
  constructor(message: string = "Didn't catch that clearly.") {
    super(
      message, 
      422, 
      'TRANSCRIPTION_FAILED',
      'Try speaking slower and closer to your microphone.'
    );
  }
}

export class AudioEmptyError extends AppError {
  constructor() {
    super(
      "Didn't hear anything.",
      400, 
      'AUDIO_EMPTY',
      'Make sure your microphone is working and try holding the button a bit longer.'
    );
  }
}

export class AudioTooShortError extends AppError {
  constructor() {
    super(
      'Recording was too short.',
      400,
      'AUDIO_TOO_SHORT',
      'Hold the record button and speak for at least 1 second.'
    );
  }
}

export class AudioTooLongError extends AppError {
  constructor(maxSeconds: number = 30) {
    super(
      `Recording was too long (max ${maxSeconds} seconds).`,
      400,
      'AUDIO_TOO_LONG',
      'Try breaking your request into smaller pieces.'
    );
  }
}

export class PipelineError extends AppError {
  constructor(stage: string, message: string = 'Processing failed') {
    super(
      'Something went wrong while processing your voice.',
      500, 
      'PIPELINE_ERROR',
      'This is on us. Try again, and if it keeps happening, let us know.'
    );
    // Log the actual stage internally but don't expose to user
    console.error(`Pipeline error at stage: ${stage} - ${message}`);
  }
}

export class NotImplementedError extends AppError {
  constructor(feature: string = 'This feature') {
    super(
      `${feature} is coming soon!`,
      501, 
      'NOT_IMPLEMENTED',
      "We're still building this. Check back later!"
    );
    this.name = 'NotImplementedError';
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfterSeconds?: number) {
    const retryMsg = retryAfterSeconds 
      ? `Wait ${retryAfterSeconds} seconds and try again.`
      : 'Wait a moment and try again.';
    super(
      "You're going too fast!",
      429, 
      'RATE_LIMIT',
      retryMsg
    );
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string = 'Our AI service') {
    super(
      `${service} is taking a break.`,
      503, 
      'SERVICE_UNAVAILABLE',
      'Try again in a minute. If it keeps happening, the service might be down.'
    );
  }
}

export class AuthenticationError extends AppError {
  constructor() {
    super(
      'Not authorized.',
      401,
      'UNAUTHORIZED',
      'Make sure you have a valid API key configured.'
    );
  }
}

export class IntentUnclearError extends AppError {
  constructor() {
    super(
      "Wasn't sure what you wanted to do.",
      422,
      'INTENT_UNCLEAR',
      'Try being more specific. For example: "Add a save button" or "Fix the login bug".'
    );
  }
}
