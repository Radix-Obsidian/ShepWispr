/**
 * Supported LLM targets
 */
export type LLMTarget = 
  | 'cursor' 
  | 'copilot' 
  | 'claude' 
  | 'gpt' 
  | 'windsurf';

/**
 * LLM dispatch request
 */
export interface DispatchRequest {
  target: LLMTarget;
  prompt: string;
  metadata: {
    intent: string;
    confidence: number;
    ideType: string;
  };
}

/**
 * LLM dispatch result
 */
export interface DispatchResult {
  success: boolean;
  target: LLMTarget;
  method: 'clipboard' | 'api' | 'command';
  instructions?: string;
  error?: string;
}

/**
 * LLM provider configuration
 */
export interface LLMProviderConfig {
  name: LLMTarget;
  displayName: string;
  method: 'clipboard' | 'api' | 'command';
  available: boolean;
  command?: string;
  description: string;
}
