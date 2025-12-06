import type { Tone } from '../../schemas/api.js';

/**
 * Result from text normalization
 */
export interface NormalizationResult {
  cleanText: string;
  tone: Tone;
  possibleGoal: string;
  frustrations: string[];
}

// Filler words to remove
const FILLER_WORDS = [
  'um', 'uh', 'uhh', 'umm', 'er', 'ah', 'ahh',
  'like', 'you know', 'basically', 'actually',
  'sort of', 'kind of', 'i mean', 'well',
];

// Patterns that indicate filler at start of sentence
const START_FILLERS = ['so', 'okay', 'ok', 'alright', 'right'];

// Order matters: check confusion before frustration since "doesn't work" appears in both contexts
const CHECK_ORDER: ('confusion' | 'frustration' | 'urgency')[] = ['confusion', 'urgency', 'frustration'];

// Frustration indicators
const FRUSTRATION_WORDS = [
  'broken', 'stupid', 'dumb', 'annoying', 'frustrating',
  'hate', 'terrible', 'awful', 'horrible', 'worst',
  "won't work", "doesn't work", "isn't working", "not working",
  'keeps failing', 'keeps breaking', 'always fails',
];

// Urgency indicators
const URGENCY_WORDS = [
  'immediately', 'asap', 'urgent', 'urgently', 'right now',
  'quickly', 'fast', 'hurry', 'critical', 'emergency',
];

// Confusion indicators
const CONFUSION_WORDS = [
  "don't understand", "doesn't make sense", "confused",
  "what is", "why does", "how come", "no idea",
  "lost", "stuck", "help me understand",
];

/**
 * Normalize transcribed text
 * - Remove filler words
 * - Detect tone/emotion
 * - Extract possible goal
 * - Identify frustrations
 */
export function normalizeTranscription(rawText: string): NormalizationResult {
  let text = rawText.toLowerCase().trim();
  const originalText = text;

  // Remove filler words
  for (const filler of FILLER_WORDS) {
    // Use word boundaries to avoid partial matches
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    text = text.replace(regex, ' ');
  }

  // Clean up extra whitespace first
  text = text.replace(/\s+/g, ' ').trim();

  // Remove start fillers (do this after cleanup so we catch fillers that moved to start)
  let changed = true;
  while (changed) {
    changed = false;
    for (const filler of START_FILLERS) {
      const regex = new RegExp(`^${filler}\\s+`, 'i');
      if (regex.test(text)) {
        text = text.replace(regex, '');
        changed = true;
      }
    }
    text = text.trim();
  }

  // Capitalize first letter
  if (text.length > 0) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Detect tone
  const tone = detectTone(originalText);

  // Extract possible goal
  const possibleGoal = extractGoal(text);

  // Find frustration indicators
  const frustrations = findFrustrations(originalText);

  return {
    cleanText: text,
    tone,
    possibleGoal,
    frustrations,
  };
}

/**
 * Detect emotional tone from text
 */
function detectTone(text: string): Tone {
  const lowerText = text.toLowerCase();

  // Check in priority order: confusion first (more specific), then urgency, then frustration
  // Check for confusion first
  for (const word of CONFUSION_WORDS) {
    if (lowerText.includes(word)) {
      return 'confused';
    }
  }

  // Check for urgency
  for (const word of URGENCY_WORDS) {
    if (lowerText.includes(word)) {
      return 'urgent';
    }
  }

  // Check for frustration
  for (const word of FRUSTRATION_WORDS) {
    if (lowerText.includes(word)) {
      return 'frustrated';
    }
  }

  // Check for excitement (exclamation marks, positive words)
  if (text.includes('!') || /\b(amazing|awesome|great|love|excited)\b/i.test(text)) {
    return 'excited';
  }

  return 'neutral';
}

/**
 * Extract the likely goal/intent from the text
 */
function extractGoal(text: string): string {
  const lowerText = text.toLowerCase();

  // Common goal patterns
  const patterns = [
    /i want to (.+)/i,
    /i need to (.+)/i,
    /can you (.+)/i,
    /please (.+)/i,
    /help me (.+)/i,
    /i'd like to (.+)/i,
    /could you (.+)/i,
    /would you (.+)/i,
  ];

  for (const pattern of patterns) {
    const match = lowerText.match(pattern);
    if (match && match[1]) {
      // Clean up the extracted goal
      let goal = match[1].trim();
      // Remove trailing punctuation
      goal = goal.replace(/[.?!]+$/, '');
      return goal;
    }
  }

  // If no pattern matched, return the cleaned text as the goal
  return text;
}

/**
 * Find frustration indicators in the text
 */
function findFrustrations(text: string): string[] {
  const lowerText = text.toLowerCase();
  const found: string[] = [];

  for (const word of FRUSTRATION_WORDS) {
    if (lowerText.includes(word)) {
      found.push(word);
    }
  }

  return found;
}
