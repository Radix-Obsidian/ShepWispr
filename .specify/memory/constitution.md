# ShepWhisper Constitution

> **"Build narrow. Test deep. Ship confidently."** — Golden Sheep AI Methodology

## Core Principles

### I. Precision Magic (Altman + Amodei Synthesis)
The tool MUST feel shockingly accurate. Every transformation from human speech to structured prompt must be:
- Deterministic and reproducible
- Explainable (show raw speech → structured prompt)
- Minimal hallucination — never invent APIs, methods, or capabilities
- Safe by default — every action requires human approval before execution

### II. Voice-Native & Natural (Tanay/Wispr Influence)
Push-to-talk is the PRIMARY interface. Design for:
- Low cognitive load — user speaks like a human, system interprets like a seasoned engineer
- Natural interaction — no jargon, no configuration, no coding skill assumptions
- Ambient computing — the tool should feel invisible, not intrusive
- Output must feel like: "This is exactly what I meant, not what I said"

### III. Vertical Slice Delivery (NON-NEGOTIABLE)
Build one complete feature end-to-end before touching anything else:
- Every slice is immediately shippable, testable, demonstrable
- No placeholder logic — full implementation or don't build it yet
- No half-finished features — one slice from spec to production, then next
- Real integrations from day one (real Whisper API, real LLM calls, real IDE)

### IV. Full-Stack Reality Testing
Test everything the way users will actually experience it:
- Integration verification before shipping — verify wiring, not just units
- E2E flows required — UI → API → Engine → Response → Display
- Test with real services (Whisper API, Claude/GPT, actual IDE extension)
- Latency requirements: < 2.5 sec from release → structured prompt displayed

### V. Safety Guardrails (Anthropic-Style)
Reliability builds trust, trust builds growth:
- No invented APIs or unsafe code generation
- Every action requires human approval — no autonomous execution
- Highlight uncertainty explicitly
- Structured error surfaces — never expose internal stack traces to users
- Constrain operations to what was explicitly requested

### VI. LLM-Agnostic Output
The translation engine must be model-independent:
- Support Claude, GPT, Cursor agent, Windsurf agent
- Output structured prompts, not model-specific instructions
- Schema-based composition — same input → same structured output regardless of target

## Technology Constraints

### Stack Requirements
- **Backend**: Node.js + TypeScript + Express/Fastify
- **Engine**: Modular pipeline (STT → Normalize → Intent → Schema → Compose)
- **IDE Extensions**: VS Code, Cursor, Windsurf (same core, platform-specific UI)
- **STT**: Whisper.cpp or OpenAI Whisper API
- **Validation**: Zod for runtime schema validation

### Performance Standards
- < 2.5 seconds from push-to-talk release to structured prompt displayed
- 90%+ users report "it captured my intent"
- 80%+ of outputs produce correct or near-correct LLM responses

### Non-Goals for V1
- Continuous listening (push-to-talk only)
- Autonomous code modification (human approval required)
- Memory of prior sessions
- Multi-agent orchestration

## Development Workflow

### The Core Loop
1. User speaks (push-to-talk)
2. ShepWhisper transcribes & interprets intent
3. Engine transforms → structured, safe, ready-to-run prompt
4. IDE panel shows: raw speech + structured prompt + "Send to LLM?" button
5. User approves → agent executes

### Quality Gates
- **Before PR**: All tests pass, integration verification complete
- **Before Merge**: Code review verifies constitution compliance
- **Before Deploy**: E2E flow works in staging environment
- **After Deploy**: Monitor error rates, latency p95, user feedback

### Verification Checkpoints
- Every slice must work when deployed, not just on localhost
- Every transformation must be transparent (show before/after)
- Every error must be user-friendly (non-technical founder audience)

## Governance

This constitution supersedes all other development practices for ShepWhisper.

Amendments require:
1. Documentation of proposed change
2. Justification against core principles
3. Migration plan for existing code
4. Team approval

All PRs and code reviews MUST verify compliance with these principles. Complexity must be justified against the simplest alternative.

**Version**: 1.0.0 | **Ratified**: 2025-12-05 | **Last Amended**: 2025-12-05
