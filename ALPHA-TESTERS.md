# ShepWhispr Alpha - Private Launch 🐑

Welcome to ShepWhispr! You're one of our first 3-5 alpha testers.

## What is ShepWhispr?

**Voice-to-structured-prompt** for developers. Speak naturally, get perfect coding prompts.

Think Wispr Flow, but for LLM prompts instead of typing.

---

## Quick Start (2 minutes)

### 1. Install

1. Download `ShepWhispr.zip`
2. Unzip and drag `ShepWhispr.app` to **Applications**
3. **First launch**: Right-click → Open (to bypass Gatekeeper)
4. Grant microphone permissions when prompted

### 2. Start the Backend

```bash
cd backend
npm install
npm run dev
```

**Keep this running** in a terminal window.

### 3. Use It!

**Two ways to record:**

**Option A: Menu Bar Icon** 🐑
1. Look for the sheep in your menu bar (top-right)
2. Click sheep → "Start Recording"
3. Speak: *"Add a search feature to the homepage"*
4. Click sheep → "Stop Recording"
5. Wait 2-3 seconds for transcription

**Option B: Keyboard Shortcut**
1. Press `Ctrl+Shift+R`
2. Speak: *"Fix the bug where the button doesn't work"*
3. Press `Ctrl+Shift+R` again
4. Wait 2-3 seconds

**Result:**
- Recent Sessions window pops up
- Shows your structured prompt
- Click **"Paste"** → it copies to clipboard
- Press `Cmd+V` in Cursor/Windsurf/Claude

---

## What to Test

### ✅ Does it work?
- Can you record your voice?
- Does it transcribe correctly?
- Is the structured prompt useful?

### 🎯 Does it feel right?
- Is it fast enough (< 5 seconds total)?
- Is the hotkey convenient?
- Is the UI clear?

### 🐛 What breaks?
- Any errors?
- Any crashes?
- Any weird behavior?

---

## Known Limitations (Alpha)

- **macOS only** (tested on macOS 11+)
- **English only** (Whisper base.en model)
- **Requires backend running** (will be bundled later)
- **Sessions don't persist** (restart = lost history)
- **No microphone level indicator** (just start talking!)

---

## Give Feedback

**What we want to know:**

1. **First impression?** (< 1 min of using it)
2. **Would you use this daily?** Why or why not?
3. **What's confusing?**
4. **What's missing?**
5. **Compared to typing prompts manually** - better/worse/same?

**Send to:** [your email/Slack/Discord]

---

## Troubleshooting

### "No speech detected"
- Make sure backend is running (`npm run dev` in backend/)
- Check System Preferences → Privacy → Microphone
- Try speaking louder or closer to mic

### "Network error"
- Backend not running? Start it: `cd backend && npm run dev`
- Check: http://localhost:3000/v1/health should return `{"status":"ok"}`

### App won't open
- Right-click → Open (first time only)
- macOS 11+ required

### Menu bar icon too small
- It's a 16x16 pixel design (macOS standard)
- Look for the sheep 🐑 near WiFi/Battery icons

---

## What's Next?

This is **v0.1 Alpha** - extremely rough, but it works.

Next releases will add:
- ✨ Bundled backend (no terminal needed)
- ✨ Persistent session storage
- ✨ IDE integrations (Cursor, Windsurf)
- ✨ Customizable hotkeys
- ✨ Better error messages
- ✨ Live transcription preview

---

**Thank you for testing!** 🙏

Your feedback will shape the product.

— Golden Sheep AI Team 🐑
