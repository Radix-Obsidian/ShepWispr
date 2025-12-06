import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/errors.js';
import { logger } from '../../utils/logger.js';

/**
 * Global error handler middleware
 * 
 * Converts errors to user-friendly JSON responses.
 * Logs full error details internally but never exposes to client.
 * 
 * Design principle: Be helpful, not technical.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log full error for debugging
  logger.error('Request error', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Handle known operational errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        suggestion: err.suggestion,
      },
    });
    return;
  }

  // Handle unknown errors - don't expose internal details
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong. Please try again.',
      suggestion: 'If this keeps happening, try restarting the extension.',
    },
  });
}
