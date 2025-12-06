import type { PromptSchema } from '../types.js';

export const bugFixSchema: PromptSchema = {
  id: 'bug_fix_v1',
  name: 'Bug Fix',
  description: 'Template for fixing bugs and resolving issues',
  sections: [
    {
      name: 'goal',
      title: '## Goal',
      template: 'Fix the following issue: {{goal}}',
      required: true,
    },
    {
      name: 'context',
      title: '## Context',
      template: `Working in: \`{{activeFile}}\`
{{#if cursorLine}}Current line: {{cursorLine}}{{/if}}
{{#if tone}}User tone: {{tone}}{{/if}}`,
      required: true,
    },
    {
      name: 'code',
      title: '## Relevant Code',
      template: '```\n{{selectedCode}}\n```',
      required: false,
    },
    {
      name: 'constraints',
      title: '## Constraints',
      template: `- Do NOT invent APIs, methods, or functions that don't exist in the codebase
- Explain any assumptions you make about the bug's root cause
- If the issue is unclear, ask for clarification before making changes
- Preserve existing functionality while fixing the bug
- Add appropriate error handling if missing`,
      required: true,
    },
    {
      name: 'output',
      title: '## Expected Output',
      template: `Provide:
1. Root cause analysis (brief)
2. The fix with code changes
3. Any additional recommendations to prevent similar issues`,
      required: true,
    },
  ],
  safetyConstraints: [
    'Do not modify unrelated code',
    'Explain the root cause before fixing',
    'Preserve backward compatibility',
  ],
};
