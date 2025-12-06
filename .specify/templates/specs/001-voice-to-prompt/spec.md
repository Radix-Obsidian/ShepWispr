# Feature Specification: Voice-to-Prompt Engine

**Feature Branch**: `001-voice-to-prompt`  
**Created**: 2025-12-05  
**Status**: Draft  
**Input**: ShepWhisper PRD — "Hold a key → talk naturally → release → see magic"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Push-to-Talk Voice Capture (Priority: P1)

A non-technical founder taps a global hotkey on their Mac, speaks naturally about what they want to build, taps again to stop, and sees their messy speech instantly transformed into a clean, structured prompt they could never have written themselves.

**Why this priority**: This is the core WOW moment — the instant the founder sees their messy voice transformed into a production-grade prompt. Without this, there is no product.

**Independent Test**: Can be fully tested by recording a voice sample via global hotkey and receiving a structured prompt back. Delivers the core value proposition.

**Acceptance Scenarios**:

1. **Given** the ShepWhispr desktop app is running, **When** user taps the hotkey and speaks "I want to add a button that saves the user's preferences", **Then** the system captures audio until second tap
2. **Given** audio has been captured, **When** user taps hotkey again, **Then** audio is sent to the transcription service within 500ms
3. **Given** audio is being processed, **When** transcription completes, **Then** structured prompt is available for paste within 2 seconds

---

### User Story 2 - Speech-to-Structured-Prompt Transformation (Priority: P1)

The captured speech is transformed through a pipeline that normalizes filler words, classifies intent, selects the appropriate schema, and composes a structured, safe, ready-to-run prompt.

**Why this priority**: The translation engine is the core IP — human expression → structured intent → deterministic schema. Without accurate transformation, the voice capture is useless.

**Independent Test**: Can be tested by passing raw transcription text through the pipeline and verifying structured output matches expected schema.

**Acceptance Scenarios**:

1. **Given** raw transcription "um so I want to like add a feature that lets users um save their stuff", **When** processed through normalizer, **Then** output is "add a feature that lets users save their stuff" with filler removed
2. **Given** normalized text describing a feature request, **When** intent classifier runs, **Then** intent is classified as `add_feature` with confidence score
3. **Given** classified intent `add_feature`, **When** schema selector runs, **Then** appropriate prompt schema is selected
4. **Given** schema and context, **When** composer runs, **Then** output is a structured markdown prompt with goal, context, constraints, and output format

---

### User Story 3 - Recent Sessions & Paste (Priority: P1)

User sees a Recent Sessions window displaying past transcriptions with raw speech, structured prompt, and "Copy" / "Paste" buttons. User explicitly pastes when ready.

**Why this priority**: Safety guardrails are non-negotiable. Every action requires human approval. This builds the trust that enables growth.

**Independent Test**: Can be tested by verifying the Recent Sessions window displays correct content and paste/copy actions work.

**Acceptance Scenarios**:

1. **Given** transformation is complete, **When** result is ready, **Then** user can either auto-paste or view in Recent Sessions
2. **Given** Recent Sessions is open, **When** user views a session, **Then** raw speech and structured prompt are displayed clearly
3. **Given** user wants to use a prompt, **When** user clicks "Paste", **Then** prompt is pasted at cursor in the previously focused app
4. **Given** user wants to copy, **When** user clicks "Copy", **Then** prompt is copied to clipboard for manual paste

---

### User Story 4 - LLM-Agnostic Output Delivery (Priority: P2)

The structured prompt can be sent to Claude, GPT, Cursor agent, or Windsurf agent — the output format is model-independent.

**Why this priority**: Multi-IDE and multi-LLM support expands the addressable market and prevents vendor lock-in. Important but not core to MVP.

**Independent Test**: Can be tested by sending the same structured prompt to different LLM targets and verifying compatible output.

**Acceptance Scenarios**:

1. **Given** user has configured Claude as target, **When** "Send" is clicked, **Then** prompt is delivered to Claude API
2. **Given** user has configured Cursor agent as target, **When** "Send" is clicked, **Then** prompt is injected into Cursor's agent interface
3. **Given** user has configured Windsurf agent as target, **When** "Send" is clicked, **Then** prompt is injected into Windsurf's Cascade

---

### User Story 5 - Graceful Error Handling (Priority: P2)

When errors occur (network issues, transcription failures, API limits), users see friendly, actionable messages — never technical stack traces.

**Why this priority**: Non-technical founders are the target audience. Confusing errors break trust and create support burden.

**Independent Test**: Can be tested by simulating various failure modes and verifying user-friendly error messages appear.

**Acceptance Scenarios**:

1. **Given** network is unavailable, **When** user tries to send audio, **Then** message displays "Couldn't connect. Check your internet and try again."
2. **Given** Whisper API returns an error, **When** transcription fails, **Then** message displays "Couldn't understand that. Try speaking more clearly."
3. **Given** LLM rate limit is hit, **When** send fails, **Then** message displays "The AI is busy. Please wait a moment and try again."

---

### Edge Cases

- What happens when user speaks in a language other than English? → V1: English only, return friendly "English only for now" message
- How does system handle extremely long recordings (> 2 minutes)? → Truncate at 2 minutes with warning
- What happens when audio is silent or just noise? → Return "Didn't catch anything. Try again?"
- How does system handle profanity or sensitive content? → Pass through (user responsibility), but never in error messages
- What happens if IDE loses focus during recording? → Continue recording until key release

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST capture audio via global hotkey in Mac desktop app (tap to start, tap to stop)
- **FR-002**: System MUST transcribe audio using Whisper API or Whisper.cpp
- **FR-003**: System MUST normalize transcription (remove filler words, detect tone, extract goals)
- **FR-004**: System MUST classify intent into predefined categories (bug_fix, add_feature, explain_code, spec_generation)
- **FR-005**: System MUST select appropriate prompt schema based on classified intent
- **FR-006**: System MUST compose structured prompt with: goal, context, constraints, output format
- **FR-007**: System MUST display raw speech and structured prompt in Recent Sessions window
- **FR-008**: System MUST require explicit user action (paste or copy) before prompt is used
- **FR-009**: System MUST work across all apps (paste into Cursor, VS Code, Windsurf, browser, etc.)
- **FR-010**: System MUST display user-friendly error messages for all failure modes
- **FR-011**: System MUST complete full pipeline in < 2.5 seconds from second tap

### Key Entities

- **VoiceRequest**: Audio buffer, timestamp, IDE context (active file, selected code, cursor position)
- **Transcription**: Raw text from STT, confidence score, language detected
- **NormalizedText**: Cleaned text, detected tone, extracted goal, detected frustrations
- **Intent**: Classification (bug_fix | add_feature | explain_code | spec_generation), confidence score
- **PromptSchema**: Template structure for the classified intent type
- **StructuredPrompt**: Final composed prompt with all sections filled
- **LLMTarget**: Configuration for which agent/API to send the prompt to

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 90%+ of users report "it captured my intent" in post-session survey
- **SC-002**: 80%+ of generated prompts produce correct or near-correct LLM responses
- **SC-003**: < 2.5 seconds from push-to-talk release to structured prompt displayed (p95)
- **SC-004**: < 5% of sessions result in error messages shown to user
- **SC-005**: Zero autonomous code modifications without explicit user approval (safety metric)
