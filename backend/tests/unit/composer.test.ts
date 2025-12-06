import { describe, it, expect } from 'vitest';
import { composePrompt, ComposedPrompt } from '../../src/engine/composer/index.js';
import type { NormalizationResult } from '../../src/engine/normalizer/index.js';
import type { IntentClassification } from '../../src/engine/intent/classifier.js';
import type { IDEContext } from '../../src/schemas/api.js';

describe('Prompt Composer', () => {
  const mockNormalization: NormalizationResult = {
    cleanText: 'add a save button to the form',
    tone: 'neutral',
    possibleGoal: 'add a save button to the form',
    frustrations: [],
  };

  const mockIntent: IntentClassification = {
    type: 'add_feature',
    confidence: 0.9,
    keywords: ['add', 'button'],
  };

  const mockContext: IDEContext = {
    activeFile: '/src/components/Form.tsx',
    selectedCode: 'function Form() { return <div>Form</div>; }',
    cursorLine: 10,
    ideType: 'vscode',
  };

  describe('prompt structure', () => {
    it('should include goal section', () => {
      const result = composePrompt(mockNormalization, mockIntent, mockContext);
      expect(result.markdown).toContain('## Goal');
    });

    it('should include context section', () => {
      const result = composePrompt(mockNormalization, mockIntent, mockContext);
      expect(result.markdown).toContain('## Context');
    });

    it('should include constraints section', () => {
      const result = composePrompt(mockNormalization, mockIntent, mockContext);
      expect(result.markdown).toContain('## Constraints');
    });

    it('should include output format section', () => {
      const result = composePrompt(mockNormalization, mockIntent, mockContext);
      expect(result.markdown).toContain('## Expected Output');
    });

    it('should include selected code when provided', () => {
      const result = composePrompt(mockNormalization, mockIntent, mockContext);
      // Schema uses "Existing Code" or "Relevant Code" depending on intent
      expect(result.markdown).toContain('## Existing Code');
      expect(result.markdown).toContain(mockContext.selectedCode!);
    });
  });

  describe('safety constraints', () => {
    it('should include "do not invent APIs" constraint', () => {
      const result = composePrompt(mockNormalization, mockIntent, mockContext);
      expect(result.markdown.toLowerCase()).toContain('do not invent');
    });

    it('should include "explain assumptions" constraint', () => {
      // Use bug_fix intent which has "explain assumptions" in its constraints
      const bugIntent: IntentClassification = {
        type: 'bug_fix',
        confidence: 0.9,
        keywords: ['fix'],
      };
      const bugNorm: NormalizationResult = {
        cleanText: 'fix the login bug',
        tone: 'neutral',
        possibleGoal: 'fix the login bug',
        frustrations: [],
      };
      const result = composePrompt(bugNorm, bugIntent, mockContext);
      expect(result.markdown.toLowerCase()).toContain('assumption');
    });

    it('should include "ask for clarification" constraint', () => {
      const result = composePrompt(mockNormalization, mockIntent, mockContext);
      expect(result.markdown.toLowerCase()).toContain('clarification');
    });
  });

  describe('intent-specific formatting', () => {
    it('should format bug_fix prompts appropriately', () => {
      const bugIntent: IntentClassification = {
        type: 'bug_fix',
        confidence: 0.9,
        keywords: ['fix', 'bug'],
      };
      const bugNorm: NormalizationResult = {
        cleanText: 'fix the login validation',
        tone: 'frustrated',
        possibleGoal: 'fix the login validation',
        frustrations: ['broken'],
      };

      const result = composePrompt(bugNorm, bugIntent, mockContext);
      expect(result.markdown.toLowerCase()).toContain('fix');
    });

    it('should format explain_code prompts appropriately', () => {
      const explainIntent: IntentClassification = {
        type: 'explain_code',
        confidence: 0.85,
        keywords: ['explain', 'understand'],
      };
      const explainNorm: NormalizationResult = {
        cleanText: 'explain this function',
        tone: 'confused',
        possibleGoal: 'explain this function',
        frustrations: [],
      };

      const result = composePrompt(explainNorm, explainIntent, mockContext);
      expect(result.markdown.toLowerCase()).toContain('explain');
    });
  });

  describe('metadata', () => {
    it('should include intent in metadata', () => {
      const result = composePrompt(mockNormalization, mockIntent, mockContext);
      expect(result.metadata.intent).toBe('add_feature');
    });

    it('should include schema ID in metadata', () => {
      const result = composePrompt(mockNormalization, mockIntent, mockContext);
      expect(result.metadata.schemaId).toBeDefined();
    });

    it('should include timestamp in metadata', () => {
      const result = composePrompt(mockNormalization, mockIntent, mockContext);
      expect(result.metadata.composedAt).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle missing selected code', () => {
      const contextNoCode: IDEContext = {
        activeFile: '/src/index.ts',
        ideType: 'cursor',
      };

      const result = composePrompt(mockNormalization, mockIntent, contextNoCode);
      expect(result.markdown).not.toContain('## Selected Code');
    });

    it('should handle empty frustrations', () => {
      const result = composePrompt(mockNormalization, mockIntent, mockContext);
      expect(result.markdown).toBeDefined();
    });

    it('should handle frustrated tone', () => {
      const frustratedNorm: NormalizationResult = {
        cleanText: 'fix this broken thing',
        tone: 'frustrated',
        possibleGoal: 'fix this broken thing',
        frustrations: ['broken', 'not working'],
      };

      const result = composePrompt(frustratedNorm, mockIntent, mockContext);
      expect(result.markdown).toBeDefined();
    });
  });
});
