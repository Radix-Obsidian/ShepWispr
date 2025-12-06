import type { PromptSchema } from '../types.js';

export const addFeatureSchema: PromptSchema = {
  id: 'add_feature_v1',
  name: 'Add Feature',
  description: 'Template for implementing new features',
  sections: [
    {
      name: 'goal',
      title: '## Goal',
      template: 'Implement the following feature: {{goal}}',
      required: true,
    },
    {
      name: 'context',
      title: '## Context',
      template: `Working in: \`{{activeFile}}\`
{{#if cursorLine}}Insert near line: {{cursorLine}}{{/if}}
IDE: {{ideType}}`,
      required: true,
    },
    {
      name: 'code',
      title: '## Existing Code',
      template: '```\n{{selectedCode}}\n```',
      required: false,
    },
    {
      name: 'constraints',
      title: '## Constraints',
      template: `- Do NOT invent APIs, libraries, or dependencies that aren't already in the project
- Follow the existing code style and patterns in this file
- If requirements are ambiguous, ask for clarification
- Keep the implementation simple and focused on the requested feature
- Add appropriate TypeScript types if applicable`,
      required: true,
    },
    {
      name: 'output',
      title: '## Expected Output',
      template: `Provide:
1. Implementation code that integrates with the existing codebase
2. Brief explanation of the approach
3. Any necessary imports or dependencies (only existing ones)`,
      required: true,
    },
  ],
  safetyConstraints: [
    'Use only existing project dependencies',
    'Follow existing code patterns',
    'Ask for clarification on ambiguous requirements',
  ],
};
