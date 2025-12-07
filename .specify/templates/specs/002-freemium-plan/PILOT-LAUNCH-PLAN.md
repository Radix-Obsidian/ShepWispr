# 🚀 ShepWhispr MVP Launch Plan

**Mission:** Launch to 3-5 users with AI-enhanced prompts, bankruptcy protection, zero friction, and feedback loop to BUILD Pro tier for Beta.

---

## 📋 Pre-Flight Checklist

### ✅ What's Already Working

- [x] Local Whisper transcription (offline)
- [x] Rule-based prompt generation (templates)
- [x] Menu bar icon (cute sheep 🐑)
- [x] Recent Sessions window
- [x] Copy/paste functionality
- [x] Keyboard shortcut (Ctrl+Shift+R)
- [x] .app built with proper icon

### ⚠️ What Needs Fixing (Critical)

- [ ] **Integrate Claude Haiku SDK** for AI-enhanced prompts
- [ ] Bundle backend inside .app (no terminal commands!)
- [ ] Add usage tracking (30 AI prompts/day, then rule-based fallback)
- [ ] Create limit-reached modal with feedback form
- [ ] Create Google Form for pricing feedback
- [ ] Test on fresh Mac (verify one-click install)

---

## 🎯 MVP Launch Strategy

### What Every User Gets (MVP = One Tier with Degradation)

**First 30 prompts/day:**
```
✅ AI-enhanced prompts (Claude Haiku) 🤖
✅ Smart context awareness
✅ Higher quality output
✅ Local Whisper transcription
✅ Cost: ~$0.0003/prompt
```

**After 30 prompts (graceful fallback):**
```
📝 Rule-based templates (still works!)
📝 Simpler output, but functional
📝 Local Whisper transcription
📝 Cost: $0
📝 Show feedback form to shape Pro tier
```

**Reset:** Midnight local time → 30 more AI prompts

### Pro Tier (DOES NOT EXIST IN MVP)

**Pro tier is built FOR Beta phase, based on MVP feedback.**

What it MIGHT include:
- Unlimited AI prompts (no 30/day limit)
- Better AI model (Claude Sonnet or GPT-4o)
- Cloud sync, custom templates
- Pricing: TBD by user feedback ($10/month target)

---

## 💰 Cost Protection

### Budget Cap: $100/month

**Expected costs in MVP (AI for everyone, 30/day limit):**
- Per AI prompt: ~$0.0003 (Claude Haiku)
- Per user/day (30 prompts max): ~$0.009
- 5 alpha users × 30 days × $0.009 = ~$1.35/month
- 100 users (future): ~$27/month

**After limit:** $0 (rule-based fallback - no AI cost)

**Kill switches:**
1. **75% ($75):** Email alert
2. **90% ($90):** Reduce AI limit to 15/day
3. **100% ($100):** Revert ALL to rule-based only

**Risk:** Very low. 5 alpha users = ~$1.35/month max.

---

## 📅 Week-by-Week Plan

### Week 1: AI Integration + Bundle & Ship 🚢

**Monday: Claude Haiku Integration**
- [ ] Install `@anthropic-ai/sdk` in backend
- [ ] Create AI enhancement function for prompts
- [ ] Add fallback to rule-based when AI fails or after limit
- [ ] Test: AI-enhanced vs rule-based output quality

**Tuesday: Backend Bundling**
- [ ] Create `backend-server.ts`
- [ ] Import Express routes into Electron
- [ ] Bundle Anthropic API key securely
- [ ] Test: Double-click .app → backend auto-starts → AI works

**Wednesday: Usage Tracking + Fallback**
- [ ] Implement local usage counter (30/day)
- [ ] Add "X AI prompts left" to menu bar
- [ ] After 30: Switch to rule-based automatically
- [ ] Create limit-reached modal
- [ ] Test: 31st prompt → modal → rule-based still works

**Thursday: Feedback Loop**
- [ ] Create Google Form
- [ ] Questions: Pricing, features, NPS
- [ ] Link from modal to form
- [ ] Auto-tag: Usage data, OS, version

**Friday: Final Testing**
- [ ] Build .app with all changes
- [ ] Test on fresh Mac (borrow friend's)
- [ ] Verify: Install → Record 30 AI prompts → Hit limit → Rule-based works → Feedback form
- [ ] Fix any showstoppers

**Weekend: Alpha Launch**
- [ ] Send .app to 3-5 trusted devs
- [ ] Include: QUICK-START.md
- [ ] Monitor: Slack/email for issues
- [ ] Goal: 3+ active users by Monday

### Week 2: Iterate & Monitor 📊

**Monday: Check-in**
- Review feedback submissions
- Fix top 1-2 bugs
- Adjust limit if needed (too low/high?)

**Mid-week: Analyze Data**
- Avg prompts/user/day
- % who hit limit
- Pricing feedback ($5? $10? $15?)
- Most requested features

**Friday: Decision Point**
- Ship Pro tier? (if 60%+ say they'd pay $10)
- Expand alpha? (10-20 users)
- Wait another week? (if bugs or confusion)

### Week 3: Pro Tier (If Validated) ✨

**Only if:**
- ✅ 60%+ willing to pay $10/month
- ✅ Top bugs fixed
- ✅ Users actively using daily
- ✅ NPS > 7

**Tasks:**
- [ ] Integrate Claude Haiku SDK
- [ ] Add Pro toggle (local flag for now)
- [ ] Invite 3-5 beta Pro users (free for 1 month)
- [ ] Monitor AI costs daily
- [ ] Prepare Stripe integration (Week 4)

---

## 📊 Success Metrics

### Week 1 (Alpha)
- ✅ 3-5 active testers
- ✅ Zero "how do I install?" questions
- ✅ 2+ users hit daily limit (validates limit)
- ✅ 3+ feedback submissions
- ✅ NPS > 7

### Week 2 (Validation)
- ✅ 60%+ willing to pay $10/month
- ✅ Top 3 bugs fixed
- ✅ Avg 10+ prompts/user/day
- ✅ Feature requests prioritized

### Week 3 (Pro)
- ✅ 3-5 Pro beta users
- ✅ AI cost < $50/month
- ✅ Pro waitlist > 5 people
- ✅ Ready for Stripe

---

## 🎓 Lessons from OpenAI & Anthropic

### What They Do Right ✅
1. **Generous free tier** - 20-60 prompts/day
2. **Graceful degradation** - Don't block, downgrade
3. **Transparent limits** - Show remaining upfront
4. **$20/month Pro** - Industry standard
5. **5-hour OR 24-hour resets** - Simple cycles

### What We're Doing Better 💡
1. **Offline fallback** - Always works (they don't have this!)
2. **Feedback before checkout** - Learn pricing first
3. **Pilot-first** - Validate before building Stripe
4. **Cost protection** - Hard caps prevent bankruptcy
5. **$10/month** - More accessible than $20

---

## 🚨 Risk Mitigation

### Risk: Backend doesn't bundle
**Plan:** Test on fresh Mac before sending to testers

### Risk: Users don't hit limits
**Plan:** Track avg usage, adjust to 20/day if needed

### Risk: Everyone wants Pro for free
**Plan:** Offer 1-month free trial to first 10 users

### Risk: AI costs explode
**Plan:** Hard cap at $100, circuit breakers at 75%/90%

---

## 📝 Communication Templates

### Email to Alpha Testers

```
Subject: You're invited to test ShepWhispr 🐑

Hey [Name],

You're one of the first 5 people to try ShepWhispr - voice-to-structured-prompts for developers.

Think Wispr Flow, but for LLM prompts instead of typing.

**How it works:**
1. Click sheep icon in menu bar
2. Speak: "Add a search feature with autocomplete"
3. Get: Structured prompt ready for Cursor/Claude
4. Paste and ship

**What I need from you:**
- Use it daily for 1 week
- Hit the daily limit (on purpose!)
- Fill out the feedback form when prompted
- Report any bugs in our Slack

**Install:**
1. Download: [link to .zip]
2. Drag to Applications
3. Double-click (approve microphone when asked)
4. That's it!

No terminal. No npm install. Just works.

Let me know if you hit any issues!

- Shep
```

### Slack Update Template

```
🐑 ShepWhispr Alpha Update - Day [X]

**Active users:** X/5
**Prompts today:** XX
**Feedback submissions:** X
**Bugs reported:** X

**Top issue:** [most common bug]
**Fix status:** [shipped / in progress / investigating]

**Next milestone:** [goal for tomorrow]
```

---

## 🎯 The Goal

**By end of Week 3:**
- ✅ 10-20 active users
- ✅ Pro tier validated ($10/month)
- ✅ Feature roadmap prioritized
- ✅ Stripe integration ready
- ✅ Ready for public launch

**Then:**
- Product Hunt launch
- Twitter/LinkedIn posts
- YC Bookface (if applicable)
- Scale to 100+ users

---

## 🏁 Final Checklist Before Launch

- [ ] Backend bundled (no terminal!)
- [ ] Usage tracking works
- [ ] Limit modal appears at 31st prompt
- [ ] Feedback form linked and tagged
- [ ] Tested on fresh Mac
- [ ] 3-5 testers lined up
- [ ] QUICK-START.md written
- [ ] Slack channel created for feedback
- [ ] Cost monitoring dashboard set up
- [ ] Emergency kill switch ready

**When all checked:** Ship it. 🚀

---

**Remember:** Done is better than perfect. Ship, learn, iterate.

This is an MVP pilot. The goal is feedback, not perfection.

Launch smart. Stay lean. Don't go broke. 💪🐑
