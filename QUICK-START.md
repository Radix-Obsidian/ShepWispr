# ShepWhispr Quick Start Guide

Welcome to ShepWhispr MVP! This guide will get you up and running in 2 minutes.

---

## 📥 Installation

### Step 1: Download
Download the latest release from GitHub:
- **macOS (Intel/Apple Silicon):** `ShepWhispr-0.1.0-arm64.dmg`
- **Alternative:** `ShepWhispr-0.1.0-arm64-mac.zip`

[Get it here →](https://github.com/Radix-Obsidian/ShepWispr/releases/tag/v0.1.0-alpha)

### Step 2: Install
1. Double-click the `.dmg` file
2. Drag **ShepWhispr** to the **Applications** folder
3. Wait for copy to complete
4. Eject the disk image

### Step 3: Launch
1. Open **Applications** folder
2. Find **ShepWhispr**
3. Double-click to launch
4. **First run:** macOS will ask for microphone permission → Click **Allow**

That's it! No terminal. No npm install. Just works. ✨

---

## 🎤 First Recording

### Start Recording
Press **`Ctrl+Shift+R`** (or click the sheep icon in the menu bar)

You'll see:
- Menu bar shows: "🎙️ Recording..."
- A small capture window appears

### Speak Your Idea
Say anything! Examples:
- "Create a responsive navigation bar with a logo and 5 links"
- "Add a search feature with autocomplete and filters"
- "Build a user dashboard with stats and charts"

Speak naturally. Don't worry about perfect grammar.

### Get Your Prompt
When you stop recording:
1. ShepWhispr transcribes your voice (locally, no internet needed)
2. Claude Haiku enhances it into a structured prompt
3. The prompt appears in your **Recent Sessions** window
4. Click **Copy** to paste into your IDE

### Paste & Ship
1. Open Cursor, Windsurf, or VS Code
2. Paste the prompt into a new chat
3. Let Claude build it
4. Ship it! 🚀

---

## 📊 Daily Limit

### You Get 30 AI-Enhanced Prompts Per Day

**First 30 prompts:**
- ✨ AI-enhanced (Claude Haiku)
- 📝 Detailed specs with constraints
- 🎯 Ready to paste into your IDE

**After 30 prompts:**
- 📋 Rule-based templates (still works!)
- ✅ Functional, but simpler
- 💬 A modal appears asking for feedback

**Reset:** Midnight (local time) → 30 more AI prompts

### Check Your Usage
Look at the menu bar: **"✨ 28 AI prompts left"**

---

## 💬 Feedback Form

When you hit your daily limit (31st prompt), you'll see a modal:

```
🎯 AI Limit Reached

You've used all 30 AI-enhanced prompts today!

Don't worry - ShepWhispr still works! Your prompts will use 
our template-based system until midnight when your AI limit resets.

Help us build the Pro version by sharing your feedback!

[Give Feedback] [Continue]
```

Click **"Give Feedback"** to fill out our form. It takes 2 minutes and directly shapes the Pro tier.

**Questions we ask:**
- Would you pay for unlimited AI prompts?
- What's a fair monthly price?
- What features would make Pro worth it?
- How would you rate the AI quality?

Your answers matter. We're building Pro based on YOUR feedback.

---

## 🐛 Troubleshooting

### "Microphone permission denied"
**Fix:** 
1. Go to **System Preferences** → **Security & Privacy** → **Microphone**
2. Find **ShepWhispr** in the list
3. Check the box next to it
4. Restart ShepWhispr

### "Recording doesn't work"
**Fix:**
1. Check that your microphone is plugged in and working
2. Try recording in another app (Voice Memos) to test
3. Restart ShepWhispr
4. Report the issue in Slack: `#shepwhispr-alpha-feedback`

### "Prompt quality is poor"
**This is expected!** 
- First run: Whisper model downloads (~1.5GB) - takes ~30 seconds
- First few prompts: Claude is learning your style
- After 5-10 prompts: Quality improves significantly

### "App crashes on launch"
**Fix:**
1. Delete ShepWhispr from Applications
2. Re-download the `.dmg`
3. Reinstall fresh
4. Report in Slack with error message

---

## 📞 Need Help?

### Report a Bug
Post in Slack: `#shepwhispr-alpha-feedback`

Include:
- What you were doing
- What happened
- What you expected
- Screenshot if possible

### Feature Request
Reply in the Slack thread with your idea

### General Question
DM @[your-name] on Slack

---

## 🎯 What We're Testing

During this alpha, we're measuring:

1. **Does it work?** (Zero-friction install, no crashes)
2. **Do people use it?** (Daily active users, prompts/day)
3. **Is it valuable?** (NPS, feedback quality)
4. **What's the pricing?** (Would you pay? How much?)
5. **What features matter?** (Unlimited AI? Better model? Cloud sync?)

Your usage and feedback directly shapes the Pro tier.

---

## 🚀 Tips for Best Results

### Tip 1: Be Specific
❌ "Make a button"
✅ "Create a blue submit button with rounded corners and hover effect"

### Tip 2: Include Context
❌ "Add a feature"
✅ "Add a search feature with autocomplete for our product database"

### Tip 3: Mention Constraints
❌ "Build a dashboard"
✅ "Build a dashboard that shows user stats, loads in <2s, and works on mobile"

### Tip 4: Use It Daily
The more you use ShepWhispr, the better the feedback we get. Try to hit that 30-prompt limit!

### Tip 5: Share Your Feedback
When you hit the limit, fill out the form. Your answers directly shape what we build next.

---

## 📋 System Requirements

- **macOS 10.12+** (Sierra or newer)
- **1.5GB free disk space** (for local AI models)
- **Microphone** (built-in or external)
- **Internet** (only for Claude API, Whisper is local)

---

## 🎉 You're Ready!

1. ✅ Installed ShepWhispr
2. ✅ Pressed Ctrl+Shift+R
3. ✅ Got your first AI-enhanced prompt
4. ✅ Pasted into your IDE
5. ✅ Shipped something awesome

**Now:** Use it daily, hit that 30-prompt limit, and give us feedback!

Questions? Post in `#shepwhispr-alpha-feedback` on Slack.

---

**Built with ❤️ by Golden Sheep AI**

*Vibe coding, powered by AI.*
