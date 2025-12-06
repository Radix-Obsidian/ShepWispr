import { Router, Request, Response, NextFunction } from 'express';
import { VoiceToPromptRequestSchema, type VoiceToPromptRequest } from '../../schemas/api.js';
import { validateBody } from '../middleware/validate.js';
import { processVoiceRequest } from '../../engine/pipeline.js';
import { logger } from '../../utils/logger.js';

const router = Router();

/**
 * POST /v1/voice-to-prompt
 * Transform voice input to structured prompt
 */
router.post(
  '/',
  validateBody(VoiceToPromptRequestSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    
    try {
      const request = req.body as VoiceToPromptRequest;
      
      logger.info('Processing voice-to-prompt request', {
        ideType: request.context.ideType,
        activeFile: request.context.activeFile,
        hasSelectedCode: !!request.context.selectedCode,
      });

      const result = await processVoiceRequest(request);

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

export { router as voiceToPromptRouter };
