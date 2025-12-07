import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate.js';
import { processTextRequest } from '../../engine/pipeline.js';
import { logger } from '../../utils/logger.js';

const router = Router();

/**
 * Schema for text-to-prompt request (skips STT, uses Apple native recognition)
 */
const TextToPromptRequestSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  context: z.object({
    activeFile: z.string().optional(),
    ideType: z.enum(['cursor', 'vscode', 'windsurf', 'other']).optional().default('other'),
    selectedCode: z.string().optional(),
    cursorLine: z.number().optional(),
    languageId: z.string().optional(),
  }),
});

type TextToPromptRequest = z.infer<typeof TextToPromptRequestSchema>;

/**
 * POST /v1/text-to-prompt
 * Transform text input to structured prompt (skips STT)
 * Uses Apple's native speech recognition instead of Whisper
 */
router.post(
  '/',
  validateBody(TextToPromptRequestSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    
    try {
      const request = req.body as TextToPromptRequest;
      
      logger.info('Processing text-to-prompt request', {
        textLength: request.text.length,
        ideType: request.context.ideType,
        activeFile: request.context.activeFile,
      });

      const result = await processTextRequest(request.text, request.context);

      res.json({
        success: true,
        data: {
          ...result,
          processingTimeMs: Date.now() - startTime,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as textToPromptRouter };
