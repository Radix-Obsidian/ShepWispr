import { Router } from 'express';
import { healthRouter } from './routes/health.js';
import { voiceToPromptRouter } from './routes/voice-to-prompt.js';

const apiRouter = Router();

// Mount routes
apiRouter.use('/health', healthRouter);
apiRouter.use('/voice-to-prompt', voiceToPromptRouter);

export { apiRouter };
