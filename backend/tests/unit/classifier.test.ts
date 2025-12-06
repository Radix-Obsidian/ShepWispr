import { describe, it, expect } from 'vitest';
import { classifyIntent, IntentClassification } from '../../src/engine/intent/classifier.js';

describe('Intent Classifier', () => {
  describe('bug_fix intent', () => {
    it('should classify "fix" requests as bug_fix', () => {
      const result = classifyIntent('fix the login button');
      expect(result.type).toBe('bug_fix');
    });

    it('should classify "broken" descriptions as bug_fix', () => {
      const result = classifyIntent('the navigation is broken');
      expect(result.type).toBe('bug_fix');
    });

    it('should classify "not working" as bug_fix', () => {
      const result = classifyIntent('the save feature is not working');
      expect(result.type).toBe('bug_fix');
    });

    it('should classify "bug" mentions as bug_fix', () => {
      const result = classifyIntent('there is a bug in the form validation');
      expect(result.type).toBe('bug_fix');
    });

    it('should classify "error" mentions as bug_fix', () => {
      const result = classifyIntent('I keep getting an error when I click submit');
      expect(result.type).toBe('bug_fix');
    });
  });

  describe('add_feature intent', () => {
    it('should classify "add" requests as add_feature', () => {
      const result = classifyIntent('add a dark mode toggle');
      expect(result.type).toBe('add_feature');
    });

    it('should classify "create" requests as add_feature', () => {
      const result = classifyIntent('create a new user profile page');
      expect(result.type).toBe('add_feature');
    });

    it('should classify "implement" requests as add_feature', () => {
      const result = classifyIntent('implement search functionality');
      expect(result.type).toBe('add_feature');
    });

    it('should classify "build" requests as add_feature', () => {
      const result = classifyIntent('build a dashboard component');
      expect(result.type).toBe('add_feature');
    });

    it('should classify "new" feature requests as add_feature', () => {
      const result = classifyIntent('I need a new button for export');
      expect(result.type).toBe('add_feature');
    });
  });

  describe('explain_code intent', () => {
    it('should classify "explain" requests as explain_code', () => {
      const result = classifyIntent('explain this function');
      expect(result.type).toBe('explain_code');
    });

    it('should classify "what does" questions as explain_code', () => {
      const result = classifyIntent('what does this code do');
      expect(result.type).toBe('explain_code');
    });

    it('should classify "how does" questions as explain_code', () => {
      const result = classifyIntent('how does this algorithm work');
      expect(result.type).toBe('explain_code');
    });

    it('should classify "understand" requests as explain_code', () => {
      const result = classifyIntent('help me understand this regex');
      expect(result.type).toBe('explain_code');
    });
  });

  describe('spec_generation intent', () => {
    it('should classify "spec" requests as spec_generation', () => {
      const result = classifyIntent('write a spec for the user authentication');
      expect(result.type).toBe('spec_generation');
    });

    it('should classify "PRD" requests as spec_generation', () => {
      const result = classifyIntent('write a prd for user authentication');
      expect(result.type).toBe('spec_generation');
    });

    it('should classify "requirements" requests as spec_generation', () => {
      const result = classifyIntent('document the requirements for this module');
      expect(result.type).toBe('spec_generation');
    });

    it('should classify "design document" requests as spec_generation', () => {
      const result = classifyIntent('write a design document for the API');
      expect(result.type).toBe('spec_generation');
    });
  });

  describe('confidence scores', () => {
    it('should return confidence between 0 and 1', () => {
      const result = classifyIntent('add a button');
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should return higher confidence for clear intents', () => {
      const clearIntent = classifyIntent('fix the broken login button bug');
      const vagueIntent = classifyIntent('do something with the thing');
      expect(clearIntent.confidence).toBeGreaterThan(vagueIntent.confidence);
    });
  });

  describe('determinism', () => {
    it('should return same result for same input', () => {
      const input = 'add a new feature to the dashboard';
      const result1 = classifyIntent(input);
      const result2 = classifyIntent(input);
      
      expect(result1.type).toBe(result2.type);
      expect(result1.confidence).toBe(result2.confidence);
    });
  });
});
