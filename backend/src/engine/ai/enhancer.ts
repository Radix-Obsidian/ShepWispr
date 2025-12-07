/**
 * AI Prompt Enhancer using Claude Haiku
 * 
 * Enhances rule-based prompts with AI for smarter, context-aware output.
 * Falls back to rule-based if AI fails or rate limited.
 */

import Anthropic from '@anthropic-ai/sdk';
import { logger } from '../../utils/logger.js';

// Lazy-initialized Anthropic client
let anthropic: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropic) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not set');
    }
    anthropic = new Anthropic({ apiKey });
  }
  return anthropic;
}

/**
 * System prompt for Claude Haiku to enhance coding prompts
 */
const SYSTEM_PROMPT = `You are an expert prompt engineer for software development. Your job is to take a basic coding prompt and enhance it to be more specific, actionable, and context-aware.

Given:
- The user's spoken request (transcribed)
- The detected intent (bug_fix, add_feature, explain_code, spec_generation)
- A basic template-based prompt

Enhance the prompt by:
1. Adding specific technical details inferred from the request
2. Breaking down complex requests into clear steps
3. Adding relevant constraints and best practices
4. Making the output actionable for an LLM coding assistant

Keep the response concise (under 400 words) and in markdown format.
Do NOT add fluff or unnecessary sections.
Do NOT change the core intent - enhance, don't replace.

If the original prompt is already good, return it with minor improvements.`;

export interface EnhanceRequest {
  originalText: string;
  intent: string;
  ruleBasedPrompt: string;
  context?: {
    activeFile?: string;
    selectedCode?: string;
    ideType?: string;
  };
}

export interface EnhanceResult {
  enhancedPrompt: string;
  wasEnhanced: boolean;
  model: string;
  latencyMs: number;
  error?: string;
}

/**
 * Enhance a prompt using Claude Haiku AI
 * 
 * @param request - The enhancement request
 * @returns Enhanced prompt or original if AI fails
 */
export async function enhancePromptWithAI(request: EnhanceRequest): Promise<EnhanceResult> {
  const startTime = Date.now();
  
  try {
    const client = getAnthropicClient();
    
    const userMessage = `
## User's Spoken Request
"${request.originalText}"

## Detected Intent
${request.intent}

## Context
- File: ${request.context?.activeFile || 'unknown'}
- IDE: ${request.context?.ideType || 'unknown'}
${request.context?.selectedCode ? `- Selected Code:\n\`\`\`\n${request.context.selectedCode}\n\`\`\`` : ''}

## Current Template-Based Prompt
${request.ruleBasedPrompt}

---

Please enhance this prompt to be more specific and actionable. Keep the same structure but add technical depth.`;

    logger.debug('AI Enhancer: Calling Claude Haiku', { 
      textLength: request.originalText.length,
      intent: request.intent,
    });

    const response = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      temperature: 0.3, // Low temperature for consistency
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: userMessage }
      ],
    });

    const latencyMs = Date.now() - startTime;

    // Extract text content
    const textContent = response.content.find(c => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response');
    }

    logger.info('AI Enhancer: Success', {
      latencyMs,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    });

    return {
      enhancedPrompt: textContent.text,
      wasEnhanced: true,
      model: 'claude-3-haiku-20240307',
      latencyMs,
    };

  } catch (error) {
    const latencyMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    logger.warn('AI Enhancer: Failed, using rule-based fallback', {
      error: errorMessage,
      latencyMs,
    });

    // Return original prompt on failure (graceful degradation)
    return {
      enhancedPrompt: request.ruleBasedPrompt,
      wasEnhanced: false,
      model: 'rule-based-fallback',
      latencyMs,
      error: errorMessage,
    };
  }
}

/**
 * Check if AI enhancement is available (API key configured)
 */
export function isAIEnhancementAvailable(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}
