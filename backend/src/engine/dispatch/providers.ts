import type { LLMProviderConfig, LLMTarget } from './types.js';

/**
 * LLM Provider configurations
 * 
 * All providers use clipboard method in V1 since we can't directly
 * invoke LLM APIs from the extension (user needs to approve).
 */
export const LLM_PROVIDERS: Record<LLMTarget, LLMProviderConfig> = {
  cursor: {
    name: 'cursor',
    displayName: 'Cursor Composer',
    method: 'clipboard',
    available: true,
    command: 'composer.openComposer',
    description: 'Opens Cursor Composer and copies prompt to clipboard',
  },
  copilot: {
    name: 'copilot',
    displayName: 'GitHub Copilot Chat',
    method: 'clipboard',
    available: true,
    command: 'github.copilot.chat.focus',
    description: 'Opens Copilot Chat and copies prompt to clipboard',
  },
  claude: {
    name: 'claude',
    displayName: 'Claude (via API)',
    method: 'api',
    available: false, // Requires API key setup
    description: 'Direct API call to Claude (coming soon)',
  },
  gpt: {
    name: 'gpt',
    displayName: 'ChatGPT (via API)',
    method: 'api',
    available: false, // Requires API key setup
    description: 'Direct API call to GPT-4 (coming soon)',
  },
  windsurf: {
    name: 'windsurf',
    displayName: 'Windsurf Cascade',
    method: 'clipboard',
    available: true,
    command: 'cascade.focus',
    description: 'Opens Windsurf Cascade and copies prompt to clipboard',
  },
};

/**
 * Get all available LLM providers
 */
export function getAvailableProviders(): LLMProviderConfig[] {
  return Object.values(LLM_PROVIDERS).filter(p => p.available);
}

/**
 * Get provider by target name
 */
export function getProvider(target: LLMTarget): LLMProviderConfig | undefined {
  return LLM_PROVIDERS[target];
}

/**
 * Check if a target is valid
 */
export function isValidTarget(target: string): target is LLMTarget {
  return target in LLM_PROVIDERS;
}
