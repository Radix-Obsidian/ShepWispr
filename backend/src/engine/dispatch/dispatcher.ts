import type { DispatchRequest, DispatchResult, LLMTarget } from './types.js';
import { getProvider, isValidTarget } from './providers.js';
import { logger } from '../../utils/logger.js';

/**
 * LLM Dispatcher
 * 
 * Routes prompts to the appropriate LLM based on target.
 * V1: All dispatches use clipboard method (user must paste).
 * Future: Direct API calls for Claude/GPT when keys are configured.
 */
export class LLMDispatcher {
  /**
   * Dispatch a prompt to the specified LLM target
   */
  dispatch(request: DispatchRequest): DispatchResult {
    const { target, prompt, metadata } = request;

    // Validate target
    if (!isValidTarget(target)) {
      logger.warn('Invalid LLM target', { target });
      return {
        success: false,
        target: target as LLMTarget,
        method: 'clipboard',
        error: `Unknown LLM target: ${target}`,
      };
    }

    const provider = getProvider(target);

    if (!provider) {
      return {
        success: false,
        target,
        method: 'clipboard',
        error: `Provider not found: ${target}`,
      };
    }

    if (!provider.available) {
      logger.info('Provider not yet available', { target });
      return {
        success: false,
        target,
        method: provider.method,
        error: `${provider.displayName} is not yet available. ${provider.description}`,
      };
    }

    logger.info('Dispatching to LLM', {
      target,
      method: provider.method,
      promptLength: prompt.length,
      intent: metadata.intent,
    });

    // V1: All available providers use clipboard method
    // The actual clipboard/command execution happens in the extension
    return {
      success: true,
      target,
      method: provider.method,
      instructions: this.getInstructions(provider.method, target),
    };
  }

  /**
   * Get user instructions for the dispatch method
   */
  private getInstructions(method: string, target: LLMTarget): string {
    switch (method) {
      case 'clipboard':
        return `Prompt copied to clipboard. Paste in ${target} to execute.`;
      case 'api':
        return `Sending to ${target} API...`;
      case 'command':
        return `Opening ${target}...`;
      default:
        return 'Ready to send.';
    }
  }

  /**
   * Get the best target for the current IDE
   */
  suggestTarget(ideType: string): LLMTarget {
    switch (ideType) {
      case 'cursor':
        return 'cursor';
      case 'windsurf':
        return 'windsurf';
      default:
        return 'copilot';
    }
  }
}

// Singleton instance
export const dispatcher = new LLMDispatcher();
