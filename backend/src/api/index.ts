import { Router } from 'express';
import { healthRouter } from './routes/health.js';
import { voiceToPromptRouter } from './routes/voice-to-prompt.js';
import { textToPromptRouter } from './routes/text-to-prompt.js';
import { usageRouter } from './routes/usage.js';

const apiRouter = Router();

// Mount routes
apiRouter.use('/health', healthRouter);
apiRouter.use('/voice-to-prompt', voiceToPromptRouter);
apiRouter.use('/text-to-prompt', textToPromptRouter); // Uses Apple's native speech recognition
apiRouter.use('/usage', usageRouter); // AI prompt usage tracking

export { apiRouter };
