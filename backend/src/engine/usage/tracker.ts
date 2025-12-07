/**
 * Usage Tracker for AI Prompts
 * 
 * Tracks daily AI prompt usage and enforces limits.
 * After limit, falls back to rule-based prompts.
 * 
 * MVP: In-memory storage (resets on restart)
 * Future: Persist to file or database
 */

import { logger } from '../../utils/logger.js';

// Daily limit for AI-enhanced prompts
const DAILY_AI_LIMIT = 30;

interface UsageData {
  date: string; // YYYY-MM-DD
  aiPromptsUsed: number;
  totalPrompts: number;
  lastPromptAt: number;
}

// In-memory storage (simple for MVP)
let usageData: UsageData = {
  date: getTodayDate(),
  aiPromptsUsed: 0,
  totalPrompts: 0,
  lastPromptAt: 0,
};

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDate(): string {
  return new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
}

/**
 * Reset usage if it's a new day
 */
function checkAndResetDaily(): void {
  const today = getTodayDate();
  if (usageData.date !== today) {
    logger.info('Usage Tracker: New day, resetting AI prompt count', {
      previousDate: usageData.date,
      previousCount: usageData.aiPromptsUsed,
    });
    usageData = {
      date: today,
      aiPromptsUsed: 0,
      totalPrompts: 0,
      lastPromptAt: 0,
    };
  }
}

/**
 * Check if user can use AI enhancement
 */
export function canUseAI(): boolean {
  checkAndResetDaily();
  return usageData.aiPromptsUsed < DAILY_AI_LIMIT;
}

/**
 * Get remaining AI prompts for today
 */
export function getRemainingAIPrompts(): number {
  checkAndResetDaily();
  return Math.max(0, DAILY_AI_LIMIT - usageData.aiPromptsUsed);
}

/**
 * Get current usage stats
 */
export function getUsageStats(): {
  aiPromptsUsed: number;
  totalPrompts: number;
  aiPromptsRemaining: number;
  dailyLimit: number;
  isAtLimit: boolean;
  date: string;
} {
  checkAndResetDaily();
  return {
    aiPromptsUsed: usageData.aiPromptsUsed,
    totalPrompts: usageData.totalPrompts,
    aiPromptsRemaining: getRemainingAIPrompts(),
    dailyLimit: DAILY_AI_LIMIT,
    isAtLimit: usageData.aiPromptsUsed >= DAILY_AI_LIMIT,
    date: usageData.date,
  };
}

/**
 * Record that an AI-enhanced prompt was used
 */
export function recordAIPromptUsed(): void {
  checkAndResetDaily();
  usageData.aiPromptsUsed++;
  usageData.totalPrompts++;
  usageData.lastPromptAt = Date.now();
  
  logger.info('Usage Tracker: AI prompt recorded', {
    aiPromptsUsed: usageData.aiPromptsUsed,
    remaining: getRemainingAIPrompts(),
  });
  
  // Log when approaching or hitting limit
  if (usageData.aiPromptsUsed === DAILY_AI_LIMIT) {
    logger.warn('Usage Tracker: Daily AI limit reached', {
      limit: DAILY_AI_LIMIT,
      totalPrompts: usageData.totalPrompts,
    });
  } else if (usageData.aiPromptsUsed >= DAILY_AI_LIMIT - 5) {
    logger.info('Usage Tracker: Approaching daily limit', {
      remaining: getRemainingAIPrompts(),
    });
  }
}

/**
 * Record that a rule-based prompt was used (after limit or fallback)
 */
export function recordRuleBasedPromptUsed(): void {
  checkAndResetDaily();
  usageData.totalPrompts++;
  usageData.lastPromptAt = Date.now();
  
  logger.debug('Usage Tracker: Rule-based prompt recorded', {
    totalPrompts: usageData.totalPrompts,
  });
}

/**
 * Get time until limit resets (midnight local time)
 */
export function getTimeUntilReset(): {
  hours: number;
  minutes: number;
  formatted: string;
} {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  
  const diffMs = midnight.getTime() - now.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return {
    hours,
    minutes,
    formatted: `${hours}h ${minutes}m`,
  };
}

/**
 * Get daily limit constant
 */
export function getDailyLimit(): number {
  return DAILY_AI_LIMIT;
}
