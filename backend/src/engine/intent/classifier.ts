import type { IntentType } from '../../schemas/api.js';

/**
 * Result from intent classification
 */
export interface IntentClassification {
  type: IntentType;
  confidence: number;
  keywords: string[];
}

// Keyword patterns for each intent type
const INTENT_PATTERNS: Record<IntentType, string[]> = {
  bug_fix: [
    'fix', 'broken', 'bug', 'error', 'issue', 'problem',
    'not working', "doesn't work", "won't work", "isn't working",
    'crash', 'failing', 'failed', 'wrong', 'incorrect',
    'debug', 'troubleshoot', 'resolve', 'repair',
  ],
  add_feature: [
    'add', 'create', 'build', 'implement', 'make', 'new',
    'feature', 'functionality', 'component', 'module',
    'develop', 'design', 'construct', 'generate',
    'want', 'need', 'should have', 'would like',
  ],
  explain_code: [
    'explain', 'understand', 'what does', 'how does', 'why does',
    'what is', 'how is', 'tell me about', 'describe',
    'clarify', 'help me understand', 'walk me through',
    'meaning', 'purpose', 'function of',
  ],
  spec_generation: [
    'spec', 'specification', 'prd', 'requirements', 'document',
    'design doc', 'technical design', 'architecture',
    'write up', 'documentation', 'outline', 'plan',
    'sdd', 'ttd', 'user stories', 'acceptance criteria',
    'create a prd', 'write a prd', 'generate a prd',
  ],
};

// Weight multipliers for keyword positions
const POSITION_WEIGHTS = {
  start: 1.5,    // Keywords at the start are more significant
  middle: 1.0,
  end: 0.8,
};

/**
 * Classify the intent of normalized text
 * Uses rule-based keyword matching (deterministic)
 */
export function classifyIntent(text: string): IntentClassification {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  const scores: Record<IntentType, { score: number; keywords: string[] }> = {
    bug_fix: { score: 0, keywords: [] },
    add_feature: { score: 0, keywords: [] },
    explain_code: { score: 0, keywords: [] },
    spec_generation: { score: 0, keywords: [] },
  };

  // Score each intent type
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS) as [IntentType, string[]][]) {
    for (const pattern of patterns) {
      if (lowerText.includes(pattern)) {
        // Calculate position weight
        const position = lowerText.indexOf(pattern);
        const relativePosition = position / lowerText.length;
        
        let weight = POSITION_WEIGHTS.middle;
        if (relativePosition < 0.2) {
          weight = POSITION_WEIGHTS.start;
        } else if (relativePosition > 0.8) {
          weight = POSITION_WEIGHTS.end;
        }

        // Multi-word patterns get bonus
        const wordCount = pattern.split(' ').length;
        const multiWordBonus = wordCount > 1 ? 0.5 : 0;

        scores[intent].score += weight + multiWordBonus;
        scores[intent].keywords.push(pattern);
      }
    }
  }

  // Find the highest scoring intent
  let bestIntent: IntentType = 'add_feature'; // Default
  let bestScore = 0;

  for (const [intent, data] of Object.entries(scores) as [IntentType, { score: number; keywords: string[] }][]) {
    if (data.score > bestScore) {
      bestScore = data.score;
      bestIntent = intent;
    }
  }

  // Calculate confidence (normalize score to 0-1 range)
  // Max reasonable score is around 5-6 for very clear intents
  const maxExpectedScore = 6;
  const confidence = Math.min(bestScore / maxExpectedScore, 1);

  // Ensure minimum confidence for any match
  const finalConfidence = bestScore > 0 ? Math.max(confidence, 0.3) : 0.1;

  return {
    type: bestIntent,
    confidence: finalConfidence,
    keywords: [...new Set(scores[bestIntent].keywords)], // Deduplicate
  };
}
