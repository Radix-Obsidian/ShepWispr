import type { IDEContext, IntentType } from '../../schemas/api.js';
import type { NormalizationResult } from '../normalizer/index.js';
import type { IntentClassification } from '../intent/classifier.js';
import type { PromptSchema } from '../schema/types.js';
import { selectSchema } from '../schema/selector.js';

/**
 * Composed prompt result
 */
export interface ComposedPrompt {
  markdown: string;
  sections: {
    goal: string;
    context: string;
    code?: string;
    constraints: string;
    outputFormat: string;
  };
  metadata: {
    intent: IntentType;
    schemaId: string;
    composedAt: string;
  };
}

/**
 * Template context for rendering
 */
interface TemplateContext {
  goal: string;
  activeFile: string;
  selectedCode?: string;
  cursorLine?: number;
  ideType: string;
  tone: string;
}

/**
 * Simple template renderer (replaces {{variable}} patterns)
 */
function renderTemplate(template: string, context: TemplateContext): string {
  let result = template;

  // Replace simple variables
  result = result.replace(/\{\{goal\}\}/g, context.goal);
  result = result.replace(/\{\{activeFile\}\}/g, context.activeFile);
  result = result.replace(/\{\{ideType\}\}/g, context.ideType);
  result = result.replace(/\{\{tone\}\}/g, context.tone);
  
  if (context.selectedCode) {
    result = result.replace(/\{\{selectedCode\}\}/g, context.selectedCode);
  }
  
  if (context.cursorLine !== undefined) {
    result = result.replace(/\{\{cursorLine\}\}/g, String(context.cursorLine));
  }

  // Handle conditional blocks {{#if variable}}...{{/if}}
  result = result.replace(/\{\{#if cursorLine\}\}(.*?)\{\{\/if\}\}/gs, 
    context.cursorLine !== undefined ? '$1' : '');
  result = result.replace(/\{\{#if selectedCode\}\}(.*?)\{\{\/if\}\}/gs, 
    context.selectedCode ? '$1' : '');
  result = result.replace(/\{\{#if tone\}\}(.*?)\{\{\/if\}\}/gs, 
    context.tone !== 'neutral' ? '$1' : '');

  return result;
}

/**
 * Compose a structured prompt from normalized text, intent, and context
 */
export function composePrompt(
  normalization: NormalizationResult,
  intent: IntentClassification,
  context: IDEContext
): ComposedPrompt {
  // Select appropriate schema
  const schema = selectSchema(intent.type);

  // Build template context
  const templateContext: TemplateContext = {
    goal: normalization.possibleGoal || normalization.cleanText,
    activeFile: context.activeFile,
    selectedCode: context.selectedCode,
    cursorLine: context.cursorLine,
    ideType: context.ideType,
    tone: normalization.tone,
  };

  // Render each section
  const renderedSections: string[] = [];
  const sectionContents: Record<string, string> = {};

  for (const section of schema.sections) {
    // Skip code section if no selected code
    if (section.name === 'code' && !context.selectedCode) {
      continue;
    }

    const rendered = renderTemplate(section.template, templateContext);
    const fullSection = `${section.title}\n\n${rendered}`;
    renderedSections.push(fullSection);
    sectionContents[section.name] = rendered;
  }

  // Combine into final markdown
  const markdown = renderedSections.join('\n\n---\n\n');

  return {
    markdown,
    sections: {
      goal: sectionContents['goal'] || '',
      context: sectionContents['context'] || '',
      code: sectionContents['code'],
      constraints: sectionContents['constraints'] || '',
      outputFormat: sectionContents['output'] || '',
    },
    metadata: {
      intent: intent.type,
      schemaId: schema.id,
      composedAt: new Date().toISOString(),
    },
  };
}
