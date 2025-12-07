/**
 * Usage API Route
 * 
 * Provides usage stats for the desktop app to display
 * remaining AI prompts and limit status.
 */

import { Router, Request, Response } from 'express';
import { 
  getUsageStats, 
  getTimeUntilReset,
  getDailyLimit,
} from '../../engine/usage/tracker.js';
import { isAIEnhancementAvailable } from '../../engine/ai/enhancer.js';

const router = Router();

/**
 * GET /v1/usage
 * Returns current usage stats
 */
router.get('/', (req: Request, res: Response) => {
  const stats = getUsageStats();
  const resetTime = getTimeUntilReset();
  
  res.json({
    success: true,
    data: {
      ...stats,
      resetIn: resetTime,
      aiAvailable: isAIEnhancementAvailable(),
    },
  });
});

/**
 * GET /v1/usage/limit
 * Returns just the limit info (for quick checks)
 */
router.get('/limit', (req: Request, res: Response) => {
  const stats = getUsageStats();
  
  res.json({
    success: true,
    data: {
      aiPromptsRemaining: stats.aiPromptsRemaining,
      isAtLimit: stats.isAtLimit,
      dailyLimit: getDailyLimit(),
    },
  });
});

export { router as usageRouter };
