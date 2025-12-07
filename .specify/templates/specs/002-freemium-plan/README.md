# 002: ShepWhispr MVP - AI-First with Graceful Fallback

**Status:** Planning Complete ✅  
**Ready to Execute:** Week 1 Tasks  
**Launch Target:** 3-5 alpha testers in 7 days

---

## 📚 Documents in This Spec

### 1. [spec.md](./spec.md) - Full Technical Specification

**Comprehensive blueprint covering:**
- Industry research (OpenAI, Anthropic limits)
- MVP: 30 AI prompts/day → Fallback to rule-based
- Feedback loop to BUILD Pro tier for Beta
- Usage tracking implementation
- Cost protection (< $100/month budget)
- Backend bundling approach
- UI/UX for limit-reached modal
- Risk mitigation strategies

**Read this for:** Technical implementation details

---

### 2. [PILOT-LAUNCH-PLAN.md](./PILOT-LAUNCH-PLAN.md) - Execution Playbook

**Week-by-week actionable plan:**
- Week 1: Bundle backend + Claude Haiku + usage tracking + alpha launch
- Week 2: Collect feedback + fix bugs + validate Pro tier pricing
- Pro tier built FOR Beta (based on MVP feedback)
- Success metrics
- Communication templates
- Risk mitigation

**Read this for:** What to do each day

---

## 🎯 TL;DR - The Plan

### MVP (NOW - What We're Launching)

**Every user gets:**
```
✅ 30 AI-enhanced prompts/day (Claude Haiku)
✅ Local Whisper transcription
✅ AFTER 30 prompts → Falls back to rule-based templates
✅ At limit → Feedback form to shape Pro tier for Beta
✅ Never blocked - graceful degradation
```

### Pro Tier (FUTURE - Built in Beta Phase)

**Pro tier does NOT exist in MVP.** We're collecting feedback to build it.

```
⚡ Unlimited AI prompts (no daily limit)
⚡ Better AI (Claude Sonnet or GPT-4o)
⚡ Cloud sync, custom templates
💰 Pricing TBD by user feedback (target $10/month)
📅 Launches IN Beta phase, not MVP
```

---

## 💰 Economics

### MVP Costs (AI-Enhanced, 30/day limit)

**Per AI prompt:** ~$0.0003 (Claude Haiku)  
**Per user/day (30 prompts):** ~$0.009/day  
**Per user/month:** ~$0.27/month  
**100 users/month:** ~$27/month  
**Budget Cap:** $100/month (hard limit)  
**After limit:** $0 (rule-based fallback)  
**Risk of Bankruptcy:** Very low ✅

### Why This Works

- 30 AI prompts × $0.0003 = $0.009/user/day
- Most users use < 15/day → ~$14/month for 100 users
- Power users hit limit → Fall back to rule-based ($0)
- Hard cap at $100/month → Can't overspend

---

## 🚀 Next Steps

### This Week (Days 1-7):

**Monday-Tuesday:** Bundle backend inside Electron
- No more `npm run dev` in terminal
- Double-click .app → everything works

**Wednesday:** Add usage tracking
- 30 prompts/day limit
- Show remaining in menu bar
- Limit-reached modal with feedback link

**Thursday:** Create feedback loop
- Google Form with pricing questions
- What features do they want?
- NPS score

**Friday:** Final testing
- Test on fresh Mac
- Fix showstoppers
- Prepare alpha package

**Weekend:** LAUNCH 🚀
- Send to 3-5 trusted developers
- Monitor Slack for feedback
- Goal: 3+ active users by Monday

---

## ✅ What's Already Done

- [x] Local Whisper (offline transcription)
- [x] Rule-based prompt generation
- [x] Menu bar icon (cute sheep 🐑)
- [x] Recent Sessions window
- [x] Copy/paste functionality
- [x] .app built with proper branding
- [x] Alpha tester guide written
- [x] Freemium strategy documented
- [x] Cost protection designed
- [x] Industry research complete

---

## 📊 Success Criteria

**Week 1 Launch:**
- ✅ 3-5 active testers
- ✅ Zero "how do I install?" questions (one-click works!)
- ✅ 2+ users hit daily limit (validates limit is working)
- ✅ 3+ feedback submissions
- ✅ NPS > 7

**Week 2 Validation:**
- ✅ 60%+ willing to pay $10/month
- ✅ Top 3 bugs fixed
- ✅ Feature roadmap prioritized

**Week 3 Pro Tier:**
- ✅ 3-5 Pro beta users
- ✅ AI cost < $50/month
- ✅ Ready for Stripe

---

## 🎓 Key Learnings from Research

### OpenAI & Anthropic Best Practices:
- **Generous free tier** - 20-60 prompts/day is standard
- **Graceful degradation** - Don't block users completely
- **Transparent limits** - Show remaining upfront
- **$20/month Pro** - Industry standard (we're doing $10!)
- **Simple reset cycles** - 24-hour or 5-hour windows

### Our Competitive Advantages:
- ✨ **Offline fallback** - Always works (OpenAI/Claude don't have this!)
- ✨ **Feedback before checkout** - Learn before building Stripe
- ✨ **Pilot-first approach** - Validate, don't assume
- ✨ **$10/month** - More accessible than $20
- ✨ **Cost protection** - Can't go bankrupt

---

## 🛡️ Risk Mitigation

**Risk:** Backend doesn't bundle correctly  
**Plan:** Test on fresh Mac before alpha launch

**Risk:** Users don't hit 30/day limit  
**Plan:** Track analytics, adjust to 20/day if needed

**Risk:** AI costs explode  
**Plan:** $100 hard cap, circuit breakers at 75%/90%

**Risk:** Everyone wants Pro for free  
**Plan:** 1-month free trial for first 10 users

---

## 📝 Documents You'll Need

**For Developers:**
- `spec.md` - Technical implementation
- `PILOT-LAUNCH-PLAN.md` - Week-by-week tasks

**For Testers:**
- `/ALPHA-TESTERS.md` (root) - Installation guide
- Google Form - Feedback & pricing

**For Monitoring:**
- Anthropic dashboard - Cost tracking
- Slack channel - Bug reports
- Spreadsheet - Feedback responses

---

## 🏁 Launch Checklist

Before sending to alpha testers:

- [ ] Backend bundled (no terminal!)
- [ ] Usage tracking works (30/day limit)
- [ ] Limit modal appears correctly
- [ ] Feedback form linked and tagged
- [ ] Tested on fresh Mac
- [ ] 3-5 testers lined up
- [ ] QUICK-START.md ready
- [ ] Slack channel created
- [ ] Cost monitoring dashboard set up
- [ ] Emergency kill switch ready

---

## 💡 Philosophy

**Done > Perfect**  
**Ship > Plan**  
**Learn > Assume**  
**Users > Features**  
**Feedback > Revenue (for now)**

This is an MVP pilot. The goal is **validation**, not perfection.

Launch smart. Stay lean. Listen hard. Iterate fast.

---

**Questions?** Read the full spec: [spec.md](./spec.md)  
**Ready to execute?** Follow the plan: [PILOT-LAUNCH-PLAN.md](./PILOT-LAUNCH-PLAN.md)

Let's ship this 🐑🚀
