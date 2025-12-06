import type { PromptSchema } from '../types.js';

export const explainCodeSchema: PromptSchema = {
  id: 'explain_code_v1',
  name: 'Explain Code',
  description: 'Template for code explanations',
  sections: [
    {
      name: 'goal',
      title: '## Goal',
      template: '{{goal}}',
      required: true,
    },
    {
      name: 'context',
      title: '## Context',
      template: `File: \`{{activeFile}}\`
{{#if cursorLine}}Focus area: around line {{cursorLine}}{{/if}}`,
      required: true,
    },
    {
      name: 'code',
      title: '## Code to Explain',
      template: '```\n{{selectedCode}}\n```',
      required: false,
    },
    {
      name: 'constraints',
      title: '## Constraints',
      template: `- Explain in simple, clear language suitable for someone learning
- Break down complex concepts into digestible parts
- Use analogies where helpful
- If the code has issues, mention them but focus on explanation first
- Highlight any important patterns or best practices used`,
      required: true,
    },
    {
      name: 'output',
      title: '## Expected Output',
      template: `Provide:
1. High-level summary of what this code does
2. Step-by-step breakdown of how it works
3. Key concepts or patterns used
4. Any potential improvements (optional)`,
      required: true,
    },
  ],
  safetyConstraints: [
    'Focus on education and clarity',
    'Avoid jargon without explanation',
    'Be accurate about what the code actually does',
  ],
};
