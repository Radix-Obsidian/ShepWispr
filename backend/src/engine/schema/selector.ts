import type { IntentType } from '../../schemas/api.js';
import type { PromptSchema } from './types.js';
import { bugFixSchema } from './definitions/bug-fix.js';
import { addFeatureSchema } from './definitions/add-feature.js';
import { explainCodeSchema } from './definitions/explain-code.js';
import { specGenerationSchema } from './definitions/spec-generation.js';

/**
 * Map of intent types to their corresponding schemas
 */
const SCHEMA_MAP: Record<IntentType, PromptSchema> = {
  bug_fix: bugFixSchema,
  add_feature: addFeatureSchema,
  explain_code: explainCodeSchema,
  spec_generation: specGenerationSchema,
};

/**
 * Select the appropriate prompt schema based on classified intent
 */
export function selectSchema(intent: IntentType): PromptSchema {
  const schema = SCHEMA_MAP[intent];
  
  if (!schema) {
    // Fallback to add_feature as default
    return SCHEMA_MAP.add_feature;
  }
  
  return schema;
}

/**
 * Get all available schemas
 */
export function getAllSchemas(): PromptSchema[] {
  return Object.values(SCHEMA_MAP);
}

/**
 * Get schema by ID
 */
export function getSchemaById(id: string): PromptSchema | undefined {
  return Object.values(SCHEMA_MAP).find(schema => schema.id === id);
}
