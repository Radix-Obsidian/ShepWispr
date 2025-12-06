import type { PromptSchema } from '../types.js';

export const specGenerationSchema: PromptSchema = {
  id: 'spec_generation_v1',
  name: 'Specification Generation',
  description: 'Template for generating technical specifications',
  sections: [
    {
      name: 'goal',
      title: '## Goal',
      template: 'Generate a specification for: {{goal}}',
      required: true,
    },
    {
      name: 'context',
      title: '## Context',
      template: `Related file: \`{{activeFile}}\`
{{#if selectedCode}}Reference implementation exists{{/if}}`,
      required: true,
    },
    {
      name: 'code',
      title: '## Reference Code',
      template: '```\n{{selectedCode}}\n```',
      required: false,
    },
    {
      name: 'constraints',
      title: '## Constraints',
      template: `- Create a clear, actionable specification
- Include user stories with acceptance criteria
- Define functional requirements (FR-XXX format)
- List success criteria with measurable outcomes
- Keep scope focused and achievable
- Identify any assumptions or dependencies`,
      required: true,
    },
    {
      name: 'output',
      title: '## Expected Output',
      template: `Generate a specification document with:
1. **Overview**: Brief description of the feature/system
2. **User Stories**: Prioritized user journeys (P1, P2, P3)
3. **Functional Requirements**: Specific capabilities (FR-001, FR-002, etc.)
4. **Success Criteria**: Measurable outcomes
5. **Out of Scope**: What this spec does NOT cover
6. **Open Questions**: Any clarifications needed`,
      required: true,
    },
  ],
  safetyConstraints: [
    'Be specific and measurable',
    'Avoid scope creep',
    'Identify dependencies and risks',
  ],
};
