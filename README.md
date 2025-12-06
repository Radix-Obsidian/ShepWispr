# 🐑 ShepWhisper

> **"Transform messy voice into production-grade prompts."**

ShepWhisper is a voice-to-prompt transformation engine that helps non-technical founders interact with AI coding assistants using natural speech. Speak like a human, get prompts like an engineer.

## ✨ What It Does

1. **You speak** (push-to-talk in VS Code/Cursor/Windsurf)
2. **ShepWhisper listens** and transcribes via Whisper API
3. **Pipeline transforms** messy speech → structured, safe prompt
4. **Review panel shows** raw speech + structured prompt side-by-side
5. **You approve** → prompt sent to your chosen LLM

**The magic**: Your voice `"um so like I want to add a button that saves the form"` becomes:

```markdown
## Goal
Add a save button to the form

## Context
Working in: `/src/components/Form.tsx`

## Constraints
- Do NOT invent APIs that don't exist in the codebase
- Follow existing code patterns
- Ask for clarification if requirements are unclear
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     VS Code Extension                        │
│  ┌─────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │Recorder │→ │  API Client  │→ │    Review Panel        │  │
│  │(Webview)│  │              │  │  Raw | Structured      │  │
│  └─────────┘  └──────────────┘  │  [Send to Cursor]      │  │
│                                  └────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ POST /v1/voice-to-prompt
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend API                              │
│  ┌─────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌─────┐ │
│  │ STT │→ │Normalizer│→ │Classifier│→ │ Schema  │→ │Comp-│ │
│  │     │  │          │  │          │  │Selector │  │oser │ │
│  └─────┘  └──────────┘  └──────────┘  └─────────┘  └─────┘ │
│  Whisper   Filler       Intent        bug_fix     Markdown  │
│   API      removal      detection     add_feature  prompt   │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- OpenAI API key (for Whisper)
- VS Code, Cursor, or Windsurf

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Add your OPENAI_API_KEY to .env
npm run dev
```

### Extension Setup
```bash
cd extensions/vscode
npm install
npm run compile
# Press F5 in VS Code to launch extension host
```

### Usage
1. Open a file in VS Code
2. Press `Ctrl+Shift+V` (or `Cmd+Shift+V` on Mac)
3. Speak your request
4. Release the key
5. Review the structured prompt in the panel
6. Click "Send to Cursor" (or your preferred LLM)

## 📁 Project Structure

```
ShepWispr/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── api/               # Routes & middleware
│   │   ├── engine/            # Pipeline components
│   │   │   ├── stt/           # Speech-to-text (Whisper)
│   │   │   ├── normalizer/    # Filler word removal
│   │   │   ├── intent/        # Intent classification
│   │   │   ├── schema/        # Prompt templates
│   │   │   ├── composer/      # Prompt composition
│   │   │   └── dispatch/      # LLM routing
│   │   ├── schemas/           # Zod validation
│   │   └── utils/             # Logger, errors
│   └── tests/                 # Vitest tests (63 passing)
├── extensions/
│   └── vscode/                # VS Code extension
│       ├── src/
│       │   ├── api/           # Backend client
│       │   ├── panels/        # Review panel webview
│       │   ├── recorder.ts    # Audio recording
│       │   └── extension.ts   # Entry point
│       └── tests/
└── .specify/                  # Spec Kit templates & memory
```

## 🧪 Testing

```bash
# Backend tests (63 passing)
cd backend
npm run test:run

# Watch mode
npm test
```

## 🎯 Intent Classification

ShepWhisper automatically classifies your intent:

| Intent | Trigger Words | Schema |
|--------|--------------|--------|
| `bug_fix` | fix, broken, error, bug | Root cause + fix + prevention |
| `add_feature` | add, create, build, implement | Goal + context + constraints |
| `explain_code` | explain, what does, how does | Summary + breakdown + concepts |
| `spec_generation` | spec, PRD, requirements | Overview + user stories + criteria |

## 🔒 Safety Principles

From our [constitution](.specify/memory/constitution.md):

1. **No invented APIs** - Never suggest functions that don't exist
2. **Human approval required** - Nothing executes without your explicit "Send"
3. **Explain assumptions** - AI must state what it assumes
4. **User-friendly errors** - No stack traces, just helpful suggestions

## 🛠️ Configuration

### Extension Settings
```json
{
  "shepwhisper.apiUrl": "http://localhost:3000",
  "shepwhisper.defaultLlm": "cursor"
}
```

### Environment Variables
```bash
# backend/.env
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=sk-...
DEBUG=shepwhisper:*
```

## 📈 Implementation Status

- [x] **Phase 1-2**: Setup & Foundational ✅
- [x] **Phase 3**: Voice Capture (US1) ✅
- [x] **Phase 4**: Transformation Pipeline (US2) ✅
- [x] **Phase 5**: Review Panel (US3) ✅
- [x] **Phase 6**: LLM Dispatch (US4) ✅
- [x] **Phase 7**: Error Handling (US5) ✅
- [ ] **Phase 8**: Polish (rate limiting, auth, packaging)

## 🤝 Built With

- [Golden Sheep AI Methodology](.specify/memory/GSAIM%20-%20Copy) - Verification-first development
- [OpenAI Whisper](https://openai.com/research/whisper) - Speech-to-text
- [Express](https://expressjs.com/) + [Zod](https://zod.dev/) - Backend API
- [VS Code Extension API](https://code.visualstudio.com/api) - IDE integration

## 📄 License

MIT © Golden Sheep AI

---

*"ShepWhisper should make a normal human feel like a superhuman founder."*
