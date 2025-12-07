/**
 * API Client Module
 * Sends transcribed text to backend for transformation
 */

export interface IDEContext {
  activeFile: string;
  selectedCode?: string;
  cursorLine?: number;
  ideType: 'vscode' | 'cursor' | 'windsurf';
}

export interface VoiceToPromptResponse {
  success: boolean;
  data?: {
    rawSpeech: string;
    structuredPrompt: string;
    intent: string;
    confidence: number;
    processingTimeMs: number;
    // AI enhancement metadata
    aiEnhanced: boolean;
    aiModel?: string;
    aiPromptsRemaining: number;
    isAtLimit: boolean;
  };
  error?: {
    code: string;
    message: string;
    retryable: boolean;
  };
}

export class APIClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = 'http://localhost:3000', timeout: number = 60000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * Send transcribed text to backend for transformation into structured prompt
   */
  async textToPrompt(
    text: string,
    context: IDEContext
  ): Promise<VoiceToPromptResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/v1/text-to-prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          context,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || `API error: ${response.statusText}`
        );
      }

      const data: VoiceToPromptResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: {
            code: 'NETWORK_ERROR',
            message: 'Request timeout',
            retryable: true,
          },
        };
      }

      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('API client error:', message);

      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message,
          retryable: true,
        },
      };
    }
  }

  /**
   * Check if the backend is healthy
   */
  async health(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.baseUrl}/v1/health`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }

}

export default APIClient;
