# Data Model: Voice-to-Prompt Engine

**Feature**: 001-voice-to-prompt  
**Date**: 2025-12-05

## Entities

### VoiceRequest

The incoming request from the IDE extension.

```typescript
interface VoiceRequest {
  audio: string;           // Base64 encoded audio buffer
  context: IDEContext;     // Current IDE state
  timestamp: string;       // ISO 8601 timestamp
}

interface IDEContext {
  activeFile: string;      // Full path to current file
  selectedCode?: string;   // Highlighted code, if any
  cursorLine?: number;     // Current cursor line number
  ideType: 'vscode' | 'cursor' | 'windsurf';
}
```

### Transcription

Output from STT handler.

```typescript
interface Transcription {
  rawText: string;         // Original transcribed text
  confidence: number;      // 0-1 confidence score from Whisper
  language: string;        // Detected language code (e.g., 'en')
  durationMs: number;      // Audio duration in milliseconds
}
```

### NormalizedText

Output from normalizer.

```typescript
interface NormalizedText {
  cleanText: string;       // Text with filler removed
  tone: Tone;              // Detected emotional tone
  possibleGoal: string;    // Extracted goal statement
  frustrations: string[];  // Detected frustration indicators
}

type Tone = 'neutral' | 'frustrated' | 'excited' | 'confused' | 'urgent';
```

### Intent

Output from intent classifier.

```typescript
interface Intent {
  type: IntentType;        // Classified intent category
  confidence: number;      // 0-1 confidence score
  keywords: string[];      // Keywords that triggered classification
}

type IntentType = 
  | 'bug_fix'
  | 'add_feature'
  | 'explain_code'
  | 'spec_generation';
```

### PromptSchema

Template for composing structured prompts.

```typescript
interface PromptSchema {
  id: string;              // e.g., 'bug_fix_v1'
  name: string;            // Human-readable name
  sections: SchemaSection[];
  safetyConstraints: string[];
}

interface SchemaSection {
  name: string;            // e.g., 'goal', 'context', 'constraints'
  required: boolean;
  template: string;        // Markdown template with placeholders
}
```

### StructuredPrompt

Final output from composer.

```typescript
interface StructuredPrompt {
  markdown: string;        // Complete formatted prompt
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
    composedAt: string;    // ISO 8601 timestamp
  };
}
```

### VoiceToPromptResponse

API response to extension.

```typescript
interface VoiceToPromptResponse {
  success: true;
  data: {
    rawSpeech: string;           // Original transcription
    structuredPrompt: string;    // Composed markdown
    intent: IntentType;          // Classified intent
    confidence: number;          // Overall confidence
    processingTimeMs: number;    // Total pipeline latency
  };
}

interface VoiceToPromptError {
  success: false;
  error: {
    code: ErrorCode;
    message: string;             // User-friendly message
    retryable: boolean;
  };
}

type ErrorCode =
  | 'NETWORK_ERROR'
  | 'TRANSCRIPTION_FAILED'
  | 'RATE_LIMITED'
  | 'AUDIO_TOO_LONG'
  | 'AUDIO_EMPTY'
  | 'INVALID_REQUEST'
  | 'INTERNAL_ERROR';
```

### LLMTarget

Configuration for LLM dispatch.

```typescript
interface LLMTarget {
  type: LLMTargetType;
  config: LLMConfig;
}

type LLMTargetType = 'claude' | 'gpt' | 'cursor' | 'windsurf';

interface LLMConfig {
  apiKey?: string;         // For direct API calls (Claude/GPT)
  endpoint?: string;       // Custom endpoint if needed
}
```

## Relationships

```
VoiceRequest
    │
    ├── audio ──────────────► Transcription (via STT)
    │                              │
    │                              ▼
    │                         NormalizedText (via Normalizer)
    │                              │
    │                              ▼
    │                         Intent (via Classifier)
    │                              │
    │                              ▼
    │                         PromptSchema (via Selector)
    │                              │
    ├── context ──────────────────►│
    │                              ▼
    │                         StructuredPrompt (via Composer)
    │                              │
    │                              ▼
    └────────────────────► VoiceToPromptResponse
```

## Validation Rules

| Entity | Field | Rule |
|--------|-------|------|
| VoiceRequest | audio | Must be valid base64, max 2 minutes |
| VoiceRequest | activeFile | Must be non-empty string |
| Transcription | confidence | Must be 0-1 |
| Intent | confidence | Must be 0-1 |
| StructuredPrompt | markdown | Must be non-empty |
