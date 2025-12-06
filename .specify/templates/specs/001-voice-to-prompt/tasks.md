# Tasks: Voice-to-Prompt Engine

**Input**: Design documents from `/specs/001-voice-to-prompt/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Integration and contract tests included per constitution requirement.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

**Pivot Note (2025-12-06)**: Replaced VS Code extension with Mac-first Electron desktop app.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Exact file paths included in descriptions

## Path Conventions

- **Backend**: `backend/src/`, `backend/tests/`
- **Desktop App**: `desktop/src/main/`, `desktop/src/renderer/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create monorepo structure with `backend/` and `extensions/vscode/` directories
- [x] T002 Initialize backend Node.js + TypeScript project in `backend/package.json`
- [x] T003 [P] Configure ESLint + Prettier for backend in `backend/.eslintrc.js`
- [x] T004 [P] Configure Vitest for testing in `backend/vitest.config.ts`
- [x] T005 Add Express + Zod + dotenv dependencies to `backend/package.json`
- [x] T006 Create `backend/src/index.ts` with Express server initialization
- [x] T007 Create `backend/src/api/routes/health.ts` returning `{ status: 'ok' }`

**Acceptance**: Server starts on `npm run dev`, `/health` returns `{ status: 'ok' }`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Create Zod schemas for API request/response in `backend/src/schemas/api.ts`
- [x] T009 [P] Implement error handler middleware in `backend/src/api/middleware/error-handler.ts`
- [x] T010 [P] Implement request validation middleware using Zod in `backend/src/api/middleware/validate.ts`
- [x] T011 [P] Create logger utility in `backend/src/utils/logger.ts`
- [x] T012 [P] Create custom error classes in `backend/src/utils/errors.ts`
- [x] T013 Create API route structure in `backend/src/api/routes/voice-to-prompt.ts` (stub)
- [x] T014 Wire routes to Express app in `backend/src/api/index.ts`
- [x] T015 Create engine pipeline orchestrator stub in `backend/src/engine/pipeline.ts`

**Acceptance**: 
- POST `/v1/voice-to-prompt` returns 501 Not Implemented (stub)
- Invalid requests return 400 with Zod validation errors
- Errors are logged consistently

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Push-to-Talk Voice Capture (Priority: P1) 🎯 MVP

**Goal**: User taps hotkey, speaks, taps again, audio is captured and sent to backend

**Independent Test**: Record audio via global hotkey → receive transcription back

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T016 [P] [US1] Contract test for POST `/v1/voice-to-prompt` in `backend/tests/contract/voice-to-prompt.test.ts`
- [x] T017 [P] [US1] Unit test for STT handler in `backend/tests/unit/stt.test.ts`

### Implementation for User Story 1

- [x] T018 [US1] Implement STT handler with Whisper API in `backend/src/engine/stt/whisper.ts`
  - Accept audio buffer (base64)
  - Call OpenAI Whisper API
  - Return `{ rawText: string, confidence: number }`
  - Handle API errors gracefully

**--- PIVOT: VS Code Extension → Mac Desktop App (Electron) ---**

- [x] T019 [US1] Create Electron desktop app project in `desktop/`
  - Initialize with `npm init` + Electron dependencies
  - Configure TypeScript
  - Set up electron-builder for macOS
  - Create basic main/renderer structure
- [ ] T020 [US1] Implement global hotkey manager in `desktop/src/main/hotkey.ts`
  - Use Electron `globalShortcut.register()`
  - Default: `Cmd+Shift+;` (Mac)
  - Tap once → start recording
  - Tap again → stop recording & process
- [ ] T021 [US1] Implement native audio recorder in `desktop/src/main/recorder.ts`
  - Use macOS-compatible audio capture (sox or node-audiorecorder)
  - Record to WAV/PCM buffer
  - Start/stop controlled by hotkey manager
- [ ] T022 [US1] Implement API client in `desktop/src/api/client.ts`
  - POST audio + context to `/v1/voice-to-prompt`
  - Handle network errors
  - Return structured response
- [ ] T023 [US1] Create floating capture bar UI in `desktop/src/renderer/capture-bar.html`
  - Minimal floating window
  - Shows "Recording..." with animation
  - Appears when recording starts, hides when done
- [ ] T024 [US1] Wire hotkey → recorder → API client → result handler in `desktop/src/main/index.ts`

**Acceptance**:
- User taps hotkey → recording starts + capture bar visible
- User taps again → audio sent to backend
- Backend transcribes → raw text returned
- Result available for paste or review

**Checkpoint**: Voice capture E2E working on Mac

---

## Phase 4: User Story 2 - Speech-to-Structured-Prompt Transformation (Priority: P1)

**Goal**: Raw transcription transformed through pipeline to structured prompt

**Independent Test**: Pass raw text → receive structured prompt with correct schema

### Tests for User Story 2 ⚠️

- [x] T024 [P] [US2] Unit test for normalizer in `backend/tests/unit/normalizer.test.ts`
- [x] T025 [P] [US2] Unit test for intent classifier in `backend/tests/unit/classifier.test.ts`
- [x] T026 [P] [US2] Unit test for prompt composer in `backend/tests/unit/composer.test.ts`
- [ ] T027 [US2] Integration test for full pipeline in `backend/tests/integration/pipeline.test.ts`

### Implementation for User Story 2

- [x] T028 [US2] Implement normalizer in `backend/src/engine/normalizer/index.ts`
  - Remove filler words (um, uh, like, so, you know)
  - Detect tone/emotion keywords
  - Extract possible goal statement
  - Identify frustration indicators
  - Return `{ cleanText, tone, possibleGoal, frustrations }`
- [x] T029 [US2] Implement intent classifier in `backend/src/engine/intent/classifier.ts`
  - Rule-based keyword matching (V1)
  - Categories: `bug_fix`, `add_feature`, `explain_code`, `spec_generation`
  - Return `{ intent, confidence }`
  - MUST be deterministic
- [x] T030 [P] [US2] Create schema definitions in `backend/src/engine/schema/definitions/`
  - `bug-fix.ts` - Bug fix prompt template
  - `add-feature.ts` - Feature request prompt template
  - `explain-code.ts` - Code explanation prompt template
  - `spec-generation.ts` - Spec generation prompt template
- [x] T031 [US2] Implement schema selector in `backend/src/engine/schema/selector.ts`
  - Map intent → schema definition
  - Load and return schema template
- [x] T032 [US2] Implement prompt composer in `backend/src/engine/composer/index.ts`
  - Take schema + normalization output + IDE context
  - Fill template sections: goal, context, code, constraints, output format
  - Add safety constraints (no invented APIs, explain assumptions)
  - Return formatted markdown
- [x] T033 [US2] Wire full pipeline in `backend/src/engine/pipeline.ts`
  - Orchestrate: STT → Normalize → Classify → Select → Compose
  - Measure and return processing time
  - Handle errors at each stage
- [x] T034 [US2] Update API route to use pipeline in `backend/src/api/routes/voice-to-prompt.ts`

**Acceptance**:
- Raw text "um I want to like add a button" → cleanText "I want to add a button"
- Intent correctly classified for 5 test phrases
- Structured prompt contains all required sections
- Pipeline completes in < 2 seconds

**Checkpoint**: Transformation pipeline fully working

---

## Phase 5: User Story 3 - Recent Sessions & Review (Priority: P1)

**Goal**: User sees raw + structured prompt in Recent Sessions window, can paste or copy

**Independent Test**: Recent Sessions displays correctly, paste/copy actions work

### Tests for User Story 3 ⚠️

- [ ] T035 [US3] E2E test for Recent Sessions flow in `desktop/tests/sessions.test.ts`

### Implementation for User Story 3

**--- PIVOT: VS Code Review Panel → Desktop Recent Sessions Window ---**

- [ ] T036 [US3] Create Recent Sessions window in `desktop/src/renderer/index.html`
  - List of past sessions with timestamps
  - Each session shows: raw speech, structured prompt, intent badge
  - "Copy" and "Paste" action buttons per session
  - Clean, minimal Wispr-like design
- [ ] T037 [US3] Implement local session storage in `desktop/src/store/sessions.ts`
  - Store sessions in local JSON file or SQLite
  - Persist across app restarts
  - Limit to last 50 sessions
- [ ] T038 [US3] Implement paste-at-cursor in `desktop/src/main/paste.ts`
  - Use Electron `clipboard.writeText()` + simulated Cmd+V
  - Works in any app with text cursor
- [ ] T039 [US3] Wire result handler to session storage + paste in `desktop/src/main/index.ts`
  - On successful API response:
    - Store in session history
    - Option A: Auto-paste structured prompt
    - Option B: Show in Recent Sessions window

**Acceptance**:
- Structured prompt available after processing
- Session history persists
- User can paste or copy any past session
- Nothing executes without explicit user action

**Checkpoint**: Recent Sessions complete - full E2E from voice to usable prompt

---

## Phase 6: User Story 4 - LLM-Agnostic Output Delivery (Priority: P2)

**Goal**: Structured prompt can be pasted into any LLM/IDE

**Independent Test**: Same prompt can be pasted into Cursor, Windsurf, Claude, etc.

### Tests for User Story 4 ⚠️

- [ ] T040 [P] [US4] Manual test: paste prompt into Cursor, Windsurf, Claude web

### Implementation for User Story 4

**--- PIVOT: Extension-based dispatch → Clipboard-based paste ---**

Since we're now a desktop app, LLM "dispatch" is simpler:
- User's prompt is copied to clipboard
- User pastes into their preferred LLM (Cursor, Windsurf, Claude, etc.)
- No need for complex integrations in V1

- [ ] T041 [US4] Add "Copy to Clipboard" action in Recent Sessions
  - Button per session
  - Confirmation toast/notification
- [ ] T042 [US4] Add "Paste Now" action that simulates Cmd+V
  - Uses Electron to focus previous app and paste
- [ ] T043 [P] [US4] (Future) Add direct Cursor/Windsurf integration if APIs become available

**Acceptance**:
- User can copy any structured prompt
- User can paste into any app with text input
- No vendor lock-in

**Checkpoint**: LLM-agnostic output complete

---

## Phase 7: User Story 5 - Graceful Error Handling (Priority: P2)

**Goal**: All errors show user-friendly messages, never stack traces

**Independent Test**: Simulate failures → verify friendly messages appear

### Tests for User Story 5 ⚠️

- [ ] T047 [US5] Integration test for error scenarios in `backend/tests/integration/errors.test.ts`

### Implementation for User Story 5

- [x] T048 [US5] Create user-friendly error messages in `backend/src/utils/errors.ts`
  - NETWORK_ERROR → "Couldn't connect. Check your internet and try again."
  - TRANSCRIPTION_FAILED → "Didn't catch that clearly."
  - RATE_LIMITED → "You're going too fast!"
  - AUDIO_TOO_LONG → "Recording was too long."
  - AUDIO_EMPTY → "Didn't hear anything."
  - All errors include suggestion field for next steps
- [x] T049 [US5] Update error handler to use friendly messages in `backend/src/api/middleware/error-handler.ts`
  - Added suggestion field to error responses
- [ ] T050 [US5] Create error display in desktop app
  - Native notification or in-app toast
  - Clear, actionable text
- [ ] T051 [US5] Wire error display to API client failures in `desktop/src/main/index.ts`

**Acceptance**:
- Network error → friendly message, no stack trace
- Transcription failure → friendly message
- Rate limit → friendly message with retry hint
- All errors are logged on backend for debugging

**Checkpoint**: Error handling complete

---

## Phase 8: Polish & Alpha Distribution

**Purpose**: Final quality improvements and Mac alpha release

### Backend Polish

- [ ] T052 [P] Add request logging middleware in `backend/src/api/middleware/logger.ts`
  - Log intent, schema, transcription length
  - No sensitive audio stored
- [ ] T053 [P] Add rate limiting middleware in `backend/src/api/middleware/rate-limit.ts`
- [ ] T054 [P] Add API key auth middleware in `backend/src/api/middleware/auth.ts`
- [ ] T055 [P] Create README.md with setup instructions
- [ ] T056 [P] Create .env.example with required environment variables

### Desktop App Polish

- [ ] T057 [P] Add macOS app icon in `desktop/assets/icon.icns`
- [ ] T058 [P] Configure electron-builder for macOS in `desktop/electron-builder.yml`
- [ ] T059 [P] Add "About" window with version info
- [ ] T060 [P] Add Settings window for hotkey customization

### Testing & Distribution

- [ ] T061 Run full E2E test suite
- [ ] T062 Performance testing - verify < 2.5s p95 latency
- [ ] T063 Build unsigned `.app` for local testing
- [ ] T064 Create alpha tester install guide (Gatekeeper bypass instructions)
- [ ] T065 Zip and share with 3-5 trusted testers

### 🗑️ Deprecated Tasks (VS Code Extension)

The following tasks are no longer needed:
- ~~T059 Package VS Code extension for distribution~~
- All `extensions/vscode/` related tasks are superseded by `desktop/` tasks

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS all user stories
- **Phase 3 (US1)**: Depends on Phase 2 - **Mac desktop app setup here**
- **Phase 4 (US2)**: Depends on Phase 3 (needs STT output)
- **Phase 5 (US3)**: Depends on Phase 4 (needs structured prompt)
- **Phase 6 (US4)**: Depends on Phase 5 (needs paste flow)
- **Phase 7 (US5)**: Can start after Phase 2, runs parallel to US1-US4
- **Phase 8 (Polish)**: Depends on all US phases complete - **Alpha distribution here**

### Within Each Phase

- Tests MUST be written and FAIL before implementation
- Models/utilities before services
- Services before API routes
- Backend before desktop app (for US1-US2)
- Commit after each task

### Parallel Opportunities

- T003, T004 can run in parallel (both config files)
- T009, T010, T011, T012 can run in parallel (independent utilities)
- T016, T017 can run in parallel (different test files)
- T024, T025, T026 can run in parallel (different test files)
- T030 schema definitions can all run in parallel
- Desktop app tasks T020-T024 should be sequential (hotkey → recorder → API → UI)

---

## Implementation Strategy

### MVP First (US1 + US2 + US3) - Mac Desktop App

1. Complete Phase 1: Setup (backend structure)
2. Complete Phase 2: Foundational (API, middleware, pipeline stubs)
3. Complete Phase 3: US1 (Voice Capture via Mac Electron app)
4. Complete Phase 4: US2 (Transformation pipeline)
5. Complete Phase 5: US3 (Recent Sessions + Paste)
6. **STOP and VALIDATE**: Test full E2E flow on Mac
7. Build unsigned `.app` and dogfood locally

### Then Enhance

8. Phase 6: US4 (Clipboard-based LLM paste)
9. Phase 7: US5 (Error Handling)
10. Phase 8: Polish + Alpha Distribution

### Alpha Release Checklist

- [ ] Unsigned `.app` runs on developer's Mac
- [ ] Hotkey works system-wide
- [ ] Recording captures audio correctly
- [ ] Backend transcribes and returns structured prompt
- [ ] Paste-at-cursor or copy-to-clipboard works
- [ ] Recent Sessions shows history
- [ ] Zip and share with 3-5 testers
- [ ] Collect feedback: "Does this feel like Wispr?"

---

## Notes

- [P] tasks = different files, no dependencies, can run parallel
- [Story] label maps task to user story for traceability
- Verify tests FAIL before implementing
- Commit after each task or logical group
- Stop at checkpoints to validate independently
- Constitution compliance checked at each phase gate
- **Mac-first**: Develop on MacBook; Windows support is future phase
- **No Apple Developer account required for alpha** - testers use Gatekeeper bypass
