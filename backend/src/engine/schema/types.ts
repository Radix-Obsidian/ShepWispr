/**
 * Schema section definition
 */
export interface SchemaSection {
  name: string;
  title: string;
  template: string;
  required: boolean;
}

/**
 * Prompt schema definition
 */
export interface PromptSchema {
  id: string;
  name: string;
  description: string;
  sections: SchemaSection[];
  safetyConstraints: string[];
}
