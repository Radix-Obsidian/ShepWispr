# Spec: ShepWhispr MVP Freemium Model & Pilot Protection

**Status:** Draft  
**Created:** 2025-12-06  
**Owner:** Golden Sheep AI  
**Priority:** P0 (Launch Blocker)

---

## Problem Statement

We need to launch ShepWhispr MVP with:
1. **Zero-friction install** - One-click, no terminal commands
2. **AI-enhanced prompts from day 1** - Users get real value immediately
3. **Graceful degradation** - When limit hit, fall back to rule-based (never block)
4. **Cost protection** - Don't go bankrupt during MVP (< $100/month)
5. **Feedback loop** - Learn what Pro tier should include and what users will pay
6. **No premature monetization** - No Stripe, no Pro tier in MVP

---

## Product Timeline

### MVP (NOW - Private Launch to 3-5 Users)
- ✅ 30 AI-enhanced prompts/day (Claude Haiku)
- ✅ After limit: Graceful fallback to rule-based templates
- ✅ At limit: Show feedback form (pricing, features, NPS)
- ❌ NO Pro tier exists - we're collecting data to BUILD it

### Beta (AFTER MVP Validated)
- Pro tier BUILT based on MVP feedback
- Pro tier LAUNCHES with validated pricing
- Features prioritized by user requests
- Stripe integration added

### Full Launch (AFTER Beta Validated)
- Public release
- Marketing push
- Scale to 100+ users

---

## Goals

### MVP Goals (Current Phase)
- ✅ Launch to 3-5 alpha testers with bundled backend
- ✅ Give users AI-enhanced prompts (Claude Haiku) from day 1
- ✅ Collect pricing/feature feedback to shape Pro tier
- ✅ Protect against AI cost runaway (< $100/month total)
- ✅ Validate product-market fit

### Non-Goals (For MVP)
- ❌ Stripe integration (Beta phase)
- ❌ Pro tier (Beta phase - doesn't exist yet)
- ❌ User authentication
- ❌ Cloud sync
- ❌ Team features

---

## Industry Research: Free Tier Benchmarks

### OpenAI ChatGPT (2025)
**Free Tier:**
- 10-60 messages per 5-hour window (GPT-4o)
- After limit: Falls back to GPT-4o mini
- Users not blocked, just degraded

**Plus ($20/month):**
- Higher limits
- Priority access
- Advanced features

### Anthropic Claude (2025)
**Free Tier:**
- ~40 short messages per day
- ~20-30 messages with attachments
- 24-hour reset

**Pro ($20/month):**
- ~216 messages per day (45 per 5 hours)
- Priority access
- Projects & Knowledge Base

### Key Insights
1. **Generous limits** - 20-60 messages/day is standard
2. **Graceful degradation** - Don't block, downgrade
3. **Time-based resets** - 5-hour or 24-hour windows
4. **$20/month** is the industry standard for Pro tier

---

## ShepWhispr MVP Architecture

### MVP Tier (Current - Everyone Gets This)

| Feature | First 30 Prompts/Day | After Limit (31+) |
|---------|---------------------|-------------------|
| **Transcription** | Local Whisper (offline) | Local Whisper (offline) |
| **Prompt Generation** | AI-enhanced (Claude Haiku) 🤖 | Rule-based templates 📝 |
| **Quality** | Excellent ⭐⭐⭐⭐⭐ | Good ⭐⭐⭐ |
| **Speed** | 2-4 seconds | < 1 second |
| **Offline** | ⚠️ No (AI needs internet) | ✅ Yes (works offline) |
| **Cost to us** | ~$0.0003/prompt | $0 |
| **User experience** | Full AI context awareness | Basic template-based |
| **At limit** | - | Show feedback form |
| **After form** | - | Continue with rule-based |

### Pro Tier (FUTURE - Built in Beta Phase)

**Pro tier does NOT exist in MVP.** We're collecting feedback to build it.

What Pro tier MIGHT include (validated by feedback):
- Unlimited AI-enhanced prompts (no 30/day limit)
- Higher quality AI (Claude Sonnet or GPT-4o-mini)
- Cloud sync across devices
- Custom prompt templates
- Priority support
- Pricing: TBD by user feedback (target $10/month)

---

## MVP Design

### How MVP Works (AI-First, Graceful Fallback)

**Every user in MVP gets:**
1. **First 30 prompts/day** → Claude Haiku AI enhancement (smart, context-aware)
2. **After 30 prompts** → Rule-based templates (still works, just simpler)
3. **At limit** → Feedback form shown (helps us build Pro tier for Beta)
4. **Reset at midnight** → 30 more AI prompts tomorrow

**This is NOT a "free vs paid" tier.** MVP has ONE tier with graceful degradation.

### Why 30 AI Prompts/Day?

**Reasoning:**
- OpenAI: 10-60/5hr = ~48-96/day (aggressive)
- Claude: 20-40/day (conservative)
- **Our choice: 30/day** (balanced)

**Why this works:**
- Users get REAL AI value from day 1
- Most users won't hit 30/day during MVP
- Power users who hit it → Most valuable feedback sources
- After limit: Still works with rule-based (no blocking)
- Industry-validated range
- Protects us from cost blowout (< $100/month)

### Reset Cycle: 24 Hours (Midnight Local Time)

**Why midnight local:**
- Simple to understand: "30 AI prompts per day"
- Users start fresh each morning
- No complex 5-hour windows to track
- Aligns with "daily limit" mental model

**Implementation:**
```typescript
// Store in local settings
interface UsageTracking {
  date: string; // 'YYYY-MM-DD' in user's timezone
  promptsUsed: number;
  maxPrompts: 30;
}

// Check on each prompt
function canUseAI(): boolean {
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
  const usage = getUsageTracking();
  
  if (usage.date !== today) {
    // New day - reset
    resetUsage(today);
    return true;
  }
  
  return usage.promptsUsed < usage.maxPrompts;
}
```

---

## What Happens When User Hits Limit?

### UX Flow

```
User clicks Record (31st prompt of the day)
       ↓
App shows modal:

╔══════════════════════════════════════════════════╗
║  🐑 You've Used All 30 AI Prompts Today!        ║
║                                                  ║
║  Don't worry - you can still keep using         ║
║  ShepWhispr with our offline mode!              ║
║                                                  ║
║  ⚡ Offline Mode (Always Free):                 ║
║     • Local Whisper transcription               ║
║     • Template-based prompts                    ║
║     • Works 100% offline                        ║
║                                                  ║
║  ✨ Want AI-Enhanced Prompts?                   ║
║                                                  ║
║  We're planning a Pro tier with:                ║
║    ✓ Unlimited AI-enhanced prompts              ║
║    ✓ Smarter context awareness                  ║
║    ✓ Cloud sync for sessions                   ║
║                                                  ║
║  Help us shape it! Share your feedback:         ║
║                                                  ║
║  [Give Feedback & Join Waitlist]                ║
║  [Continue with Offline Mode]                   ║
║                                                  ║
║  Resets at midnight (16 hours remaining)        ║
╚══════════════════════════════════════════════════╝
```

**User chooses:**
1. **Give Feedback** → Opens feedback form
2. **Continue** → Uses rule-based system (still works!)

**Key principle:** Never block the user completely. Always degrade gracefully.

---

## Feedback Form (Google Forms)

### Questions to Ask

When user clicks "Give Feedback & Join Waitlist":

**Open Google Form with:**

1. **Email** (for waitlist)
   - Optional but encouraged

2. **How do you feel about ShepWhispr so far?** (1-5 stars)
   - ⭐ Needs work
   - ⭐⭐ It's okay
   - ⭐⭐⭐ I like it
   - ⭐⭐⭐⭐ I love it
   - ⭐⭐⭐⭐⭐ Can't live without it

3. **What would you pay for unlimited AI-enhanced prompts?**
   - $0 (I prefer free tier)
   - $5/month
   - $10/month ⭐ (our target)
   - $15/month
   - $20/month
   - $25+/month
   - Other: _____

4. **What feature would make you upgrade?** (Select all)
   - [ ] Unlimited AI-enhanced prompts
   - [ ] Smarter context awareness
   - [ ] Cloud sync (access sessions anywhere)
   - [ ] Custom prompt templates
   - [ ] IDE integrations (Cursor, Windsurf)
   - [ ] Voice commands (no typing at all)
   - [ ] Team collaboration
   - [ ] Other: _____

5. **What's missing or broken?** (Free text)

6. **Would you recommend ShepWhispr to other developers?** (NPS)
   - 0 = No way
   - 10 = Definitely

**Auto-tags in spreadsheet:**
- Date reached limit
- Total prompts used that day
- User's OS, app version

---

## Cost Protection Strategy

### Maximum Monthly Costs (Pilot Phase)

**Assumptions:**
- 100 pilot users
- 30% reach daily limit
- 70% use < 10 prompts/day

**Free Tier Cost:** $0 (rule-based)

**If we add Pro tier (future):**
- Claude Haiku: $0.25/$1.25 per 1M tokens (input/output)
- Average prompt: 200 input + 300 output tokens
- Cost per AI prompt: ~$0.0003

**Monthly cost at 100 users:**
```
30 power users × 30 AI prompts/day × 30 days × $0.0003 = $8.10
70 light users × 10 AI prompts/day × 30 days × $0.0003 = $6.30
Total: ~$14.40/month
```

**Safety margin:** Set hard cap at $100/month in Anthropic dashboard.

### Kill Switches

**Level 1: Warning (75% of budget)**
```typescript
if (monthlyAICost > 75) {
  notifyAdmin('AI costs at 75%');
  // Continue service
}
```

**Level 2: Pause New AI (90% of budget)**
```typescript
if (monthlyAICost > 90) {
  notifyAdmin('⚠️ AI costs at 90% - pausing new Pro users');
  ALLOW_PRO_SIGNUPS = false;
  // Existing Pro users still work
}
```

**Level 3: Full Degradation (100% of budget)**
```typescript
if (monthlyAICost >= 100) {
  notifyAdmin('🚨 BUDGET HIT - reverting all to free tier');
  ALL_USERS_USE_RULE_BASED = true;
  // Everyone uses offline mode
}
```

**Resets:** 1st of each month

---

## Backend Bundling (Zero-Config Install)

### Problem
Current: User downloads app → Opens terminal → `npm install` → `npm run dev`  
**This is terrible UX.**

### Solution
Bundle Express backend inside Electron app.

### Implementation

**File:** `/Users/goldensheepai/Desktop/GoldenSheepAI/ShepWispr/desktop/src/main/backend-server.ts`

```typescript
import express from 'express';
import { router } from '../../../backend/src/api/index.js';
import dotenv from 'dotenv';

let backendServer: any = null;

export async function startBackend(): Promise<void> {
  console.log('🐑 Starting ShepWhispr backend...');
  
  // Load env vars (if Pro tier key exists)
  dotenv.config();
  
  const app = express();
  app.use(express.json());
  
  // Mount backend routes
  app.use('/v1', router);
  
  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', tier: 'free' });
  });
  
  const PORT = 3000;
  
  return new Promise((resolve, reject) => {
    backendServer = app.listen(PORT, () => {
      console.log(`✅ Backend running on http://localhost:${PORT}`);
      resolve();
    });
    
    backendServer.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} already in use`);
        // Try next port
        startBackend();
      } else {
        reject(err);
      }
    });
  });
}

export function stopBackend(): void {
  if (backendServer) {
    backendServer.close();
    console.log('Backend stopped');
  }
}
```

**File:** `desktop/src/main/index.ts` (update)

```typescript
import { startBackend, stopBackend } from './backend-server.js';

app.whenReady().then(async () => {
  // Start backend FIRST
  await startBackend();
  
  // Then start UI
  createMainWindow();
  createCaptureWindow();
  createTray();
  registerHotkey();
});

app.on('before-quit', () => {
  stopBackend();
});
```

**Result:** User double-clicks app → Backend auto-starts → Everything works!

---

## Usage Tracking Implementation

### Local Storage (No Auth Required)

```typescript
// desktop/src/store/usage-tracking.ts
import Store from 'electron-store';

interface UsageData {
  date: string; // YYYY-MM-DD
  promptsUsed: number;
  tier: 'free' | 'pro';
  lastPromptAt: number; // timestamp
}

const store = new Store<UsageData>({
  defaults: {
    date: new Date().toLocaleDateString('en-CA'),
    promptsUsed: 0,
    tier: 'free',
    lastPromptAt: 0,
  },
});

export function getUsageToday(): UsageData {
  const today = new Date().toLocaleDateString('en-CA');
  const data = store.get();
  
  // Reset if new day
  if (data.date !== today) {
    store.set({
      date: today,
      promptsUsed: 0,
      tier: data.tier,
      lastPromptAt: Date.now(),
    });
    return store.get();
  }
  
  return data;
}

export function incrementUsage(): boolean {
  const usage = getUsageToday();
  const FREE_LIMIT = 30;
  
  if (usage.tier === 'free' && usage.promptsUsed >= FREE_LIMIT) {
    return false; // Hit limit
  }
  
  store.set({
    ...usage,
    promptsUsed: usage.promptsUsed + 1,
    lastPromptAt: Date.now(),
  });
  
  return true;
}

export function getRemainingPrompts(): number {
  const usage = getUsageToday();
  const FREE_LIMIT = 30;
  
  if (usage.tier === 'pro') return Infinity;
  return Math.max(0, FREE_LIMIT - usage.promptsUsed);
}

export function getTimeUntilReset(): string {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  return `${hours} hours`;
}
```

---

## UI Updates

### Menu Bar Icon - Show Remaining

```typescript
function updateTrayMenu(): void {
  const remaining = getRemainingPrompts();
  const resetTime = getTimeUntilReset();
  
  const menu = Menu.buildFromTemplate([
    {
      label: isRecording ? '⏹ Stop Recording' : '⏺ Start Recording',
      click: toggleRecording,
    },
    { type: 'separator' },
    {
      label: `${remaining === Infinity ? '∞' : remaining} prompts left today`,
      enabled: false,
    },
    {
      label: `Resets in ${resetTime}`,
      enabled: false,
    },
    { type: 'separator' },
    { label: 'Recent Sessions', click: showMainWindow },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() },
  ]);
  
  tray?.setContextMenu(menu);
}
```

### Limit Reached Modal

**File:** `desktop/src/renderer/limit-modal.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>Daily Limit Reached</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="modal-container">
    <div class="sheep-icon">🐑</div>
    <h1>You've Used All 30 AI Prompts Today!</h1>
    
    <p class="message">
      Don't worry - you can still keep using ShepWhispr with our offline mode!
    </p>
    
    <div class="offline-box">
      <h3>⚡ Offline Mode (Always Free):</h3>
      <ul>
        <li>Local Whisper transcription</li>
        <li>Template-based prompts</li>
        <li>Works 100% offline</li>
      </ul>
    </div>
    
    <div class="pro-box">
      <h3>✨ Want AI-Enhanced Prompts?</h3>
      <p>We're planning a Pro tier with:</p>
      <ul>
        <li>✓ Unlimited AI-enhanced prompts</li>
        <li>✓ Smarter context awareness</li>
        <li>✓ Cloud sync for sessions</li>
      </ul>
    </div>
    
    <p class="feedback-prompt">
      <strong>Help us shape it! Share your feedback:</strong>
    </p>
    
    <div class="buttons">
      <button class="btn btn-primary" onclick="openFeedbackForm()">
        Give Feedback & Join Waitlist
      </button>
      <button class="btn btn-secondary" onclick="continueOffline()">
        Continue with Offline Mode
      </button>
    </div>
    
    <p class="reset-info" id="resetTime"></p>
  </div>
  
  <script>
    function openFeedbackForm() {
      window.shepwhispr.openExternal('https://forms.gle/YOUR_GOOGLE_FORM_ID');
      window.close();
    }
    
    function continueOffline() {
      window.close();
    }
    
    // Update reset time
    window.shepwhispr.getResetTime().then(time => {
      document.getElementById('resetTime').textContent = 
        `Resets at midnight (${time} remaining)`;
    });
  </script>
</body>
</html>
```

---

## Rollout Plan

### Phase 1: Bundle Backend (Week 1)
**Goal:** One-click install, zero terminal commands

**Tasks:**
- [ ] Create `backend-server.ts`
- [ ] Update `main/index.ts` to start backend
- [ ] Copy backend source into desktop build
- [ ] Update `package.json` to bundle backend deps
- [ ] Test: Double-click app → backend starts automatically

**Acceptance:**
- User downloads .app
- User double-clicks
- Everything works (no `npm run dev` needed)

### Phase 2: Usage Tracking (Week 1)
**Goal:** Track daily usage, show limits gracefully

**Tasks:**
- [ ] Create `usage-tracking.ts`
- [ ] Add limit check before each prompt
- [ ] Update tray menu to show remaining
- [ ] Create limit-reached modal
- [ ] Test: Trigger 31st prompt → see modal

**Acceptance:**
- User sees "29 prompts left" in menu bar
- After 30 prompts → modal appears
- User can still record (uses rule-based)

### Phase 3: Feedback Loop (Week 1)
**Goal:** Collect pricing & feature feedback

**Tasks:**
- [ ] Create Google Form
- [ ] Add "Give Feedback" button to modal
- [ ] Auto-populate form with metadata
- [ ] Test: Submit feedback → appears in sheet

**Acceptance:**
- Feedback form collects email, pricing, features
- Responses tagged with usage data
- Admin can see feedback in real-time

### Phase 4: Alpha Launch (Week 1, Day 7)
**Goal:** 3-5 testers using the app

**Tasks:**
- [ ] Build final .app with bundled backend
- [ ] Zip and upload to Google Drive
- [ ] Send to 3-5 trusted developers
- [ ] Monitor: # of prompts, feedback submissions
- [ ] Fix any showstopper bugs

**Acceptance:**
- 3-5 testers successfully install
- Testers use app daily
- At least 2 hit daily limit (validates limit works)
- At least 3 submit feedback

### Phase 5: Pro Tier (Week 2-3)
**Goal:** Add AI enhancement for paying users

**Tasks:**
- [ ] Integrate Claude Haiku SDK
- [ ] Add Pro tier toggle (local flag for now)
- [ ] Test AI enhancement quality
- [ ] Set up cost monitoring dashboard
- [ ] Validate pricing with feedback data

**Acceptance:**
- Pro users get AI-enhanced prompts
- Free users still work (graceful degradation)
- Cost stays under $100/month
- Pricing validated ($10/month)

---

## Success Metrics

### Week 1 (Alpha)
- ✅ 3-5 testers actively using
- ✅ Zero "how do I install?" questions
- ✅ At least 2 users hit daily limit
- ✅ At least 3 feedback submissions
- ✅ NPS > 7 (from feedback)

### Week 2 (Iterate)
- ✅ Fixed top 3 bugs from feedback
- ✅ 60%+ say they'd pay $10/month
- ✅ Pro tier working with < 5 beta users
- ✅ Total AI cost < $50

### Week 3 (Expand)
- ✅ 10-20 users total
- ✅ Pro tier waitlist > 5 people
- ✅ Ready to add Stripe integration
- ✅ Pricing validated, features prioritized

---

## Risk Mitigation

### Risk 1: Users Abuse Free Tier
**Scenario:** Power user creates multiple accounts to get 30 prompts × N

**Mitigation:**
- Track by machine ID (Electron `app.getPath('userData')` is unique)
- Not by email (no auth yet)
- If detected: Show message "We noticed multiple accounts. Join waitlist for Pro!"

### Risk 2: AI Costs Explode
**Scenario:** Bug in code causes infinite API calls

**Mitigation:**
- Hard cap in Anthropic dashboard: $100/month
- Circuit breaker: If daily cost > $10, auto-disable AI
- Monitor daily in Slack/email

### Risk 3: Users Don't Hit Limits
**Scenario:** 30 prompts/day is too high, users never upgrade

**Mitigation:**
- Analytics: Track avg prompts/user/day
- If avg < 10, we're being too generous
- Adjust to 20/day if needed (announce 1 week before)

### Risk 4: Backend Doesn't Bundle
**Scenario:** electron-builder fails to include backend

**Mitigation:**
- Test build on fresh Mac (not dev machine)
- Use `asar` unpacking for backend folder
- Add to `package.json`:
```json
"build": {
  "asarUnpack": ["backend/**/*"]
}
```

---

## Open Questions

1. **Should we show usage in real-time?**
   - Option A: "29 left" in menu bar (always visible)
   - Option B: Only show when < 5 remaining (less intrusive)
   - **Decision:** Option A - transparency builds trust

2. **What if user runs out mid-conversation?**
   - Option A: Finish current prompt, block next one
   - Option B: Block immediately
   - **Decision:** Option A - don't interrupt flow

3. **Should we auto-open feedback form?**
   - Option A: Auto-open after hitting limit
   - Option B: User clicks button
   - **Decision:** Option B - less aggressive

---

## Appendix: Freemium Best Practices

### Do's ✅
- **Be generous** - 30/day feels fair
- **Degrade gracefully** - Never fully block
- **Transparent limits** - Show remaining prompts
- **Ask for feedback** - Before asking for money
- **Validate pricing** - Let users tell you what to charge

### Don'ts ❌
- **Don't paywall too early** - Build trust first
- **Don't surprise users** - Always show limits upfront
- **Don't block completely** - Offline mode always works
- **Don't over-complicate** - Simple daily limit, midnight reset
- **Don't assume pricing** - Validate with real users

---

**End of Spec**

This spec will evolve based on alpha feedback. Updates will be logged below.

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2025-12-06 | Initial spec | Pilot launch planning |
