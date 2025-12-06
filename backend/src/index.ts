import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './api/index.js';
import { errorHandler } from './api/middleware/error-handler.js';
import { logger } from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json({ limit: '10mb' })); // Support large audio payloads
app.use(express.static(path.join(__dirname, '../public'))); // Serve test page

// Root route - API info
app.get('/', (_req, res) => {
  res.json({
    name: 'ShepWhisper API',
    version: '1.0.0',
    description: 'Voice-to-prompt transformation for non-technical founders',
    endpoints: {
      health: 'GET /v1/health',
      voiceToPrompt: 'POST /v1/voice-to-prompt',
    },
    docs: 'https://github.com/goldensheepai/shepwhisper',
  });
});

// API Routes
app.use('/v1', apiRouter);

// Error handling (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`ShepWhisper API running on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/v1/health`);
});

export { app };
