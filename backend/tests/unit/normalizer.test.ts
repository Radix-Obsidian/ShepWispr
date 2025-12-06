import { describe, it, expect } from 'vitest';
import { normalizeTranscription, NormalizationResult } from '../../src/engine/normalizer/index.js';

describe('Normalizer', () => {
  describe('filler word removal', () => {
    it('should remove "um" filler words', () => {
      const result = normalizeTranscription('um I want to add a button');
      expect(result.cleanText).toBe('I want to add a button');
    });

    it('should remove "uh" filler words', () => {
      const result = normalizeTranscription('uh can you help me uh fix this');
      expect(result.cleanText).toBe('Can you help me fix this');
    });

    it('should remove "like" as filler', () => {
      const result = normalizeTranscription('I want to like add a feature');
      expect(result.cleanText).toBe('I want to add a feature');
    });

    it('should remove "so" at the start', () => {
      const result = normalizeTranscription('so I need to fix this bug');
      expect(result.cleanText).toBe('I need to fix this bug');
    });

    it('should remove "you know" filler', () => {
      const result = normalizeTranscription('I want you know to add something');
      expect(result.cleanText).toBe('I want to add something');
    });

    it('should handle multiple fillers', () => {
      const result = normalizeTranscription('um so like I want to uh add a button');
      // Note: 'so' at start after 'um' removal gets capitalized
      expect(result.cleanText.toLowerCase()).toBe('i want to add a button');
    });
  });

  describe('tone detection', () => {
    it('should detect frustrated tone', () => {
      const result = normalizeTranscription("this stupid thing isn't working");
      expect(result.tone).toBe('frustrated');
    });

    it('should detect urgent tone', () => {
      const result = normalizeTranscription('I need this fixed immediately ASAP');
      expect(result.tone).toBe('urgent');
    });

    it('should detect confused tone', () => {
      const result = normalizeTranscription("I don't understand why this doesn't work");
      expect(result.tone).toBe('confused');
    });

    it('should default to neutral tone', () => {
      const result = normalizeTranscription('add a save button to the form');
      expect(result.tone).toBe('neutral');
    });
  });

  describe('goal extraction', () => {
    it('should extract goal from "I want to" pattern', () => {
      const result = normalizeTranscription('I want to add a login button');
      expect(result.possibleGoal).toContain('add a login button');
    });

    it('should extract goal from "can you" pattern', () => {
      const result = normalizeTranscription('can you fix the navigation bug');
      expect(result.possibleGoal).toContain('fix the navigation bug');
    });

    it('should extract goal from "please" pattern', () => {
      const result = normalizeTranscription('please explain this function');
      expect(result.possibleGoal).toContain('explain this function');
    });
  });

  describe('frustration detection', () => {
    it('should detect frustration keywords', () => {
      const result = normalizeTranscription("this broken code won't work");
      expect(result.frustrations.length).toBeGreaterThan(0);
    });

    it('should return empty array for non-frustrated input', () => {
      const result = normalizeTranscription('add a button to save data');
      expect(result.frustrations).toEqual([]);
    });
  });
});
