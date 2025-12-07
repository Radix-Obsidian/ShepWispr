# ShepWhispr MVP Feedback Form Template

**Purpose:** Create a Google Form to collect feedback from alpha testers when they hit their 30/day AI limit.

**Create form at:** https://forms.google.com

---

## Form Title

**ShepWhispr Feedback - Help Shape the Pro Version! 🐑**

---

## Form Description

```
Thanks for using ShepWhispr! You've hit your daily AI limit (30 prompts).

Your feedback will directly shape the Pro version we're building.
This takes 2 minutes and helps us build exactly what you need.

Your prompts will continue working with our basic mode until midnight!
```

---

## Questions

### Section 1: Usage Experience

**Q1. How many times did you use ShepWhispr today?** (Required)
- [ ] 1-10 times
- [ ] 11-20 times
- [ ] 21-30 times
- [ ] 30+ (hit the limit!)

**Q2. What did you use ShepWhispr for most?** (Required, Multiple Choice)
- [ ] Writing new code features
- [ ] Debugging/fixing bugs
- [ ] Understanding existing code
- [ ] Generating specs/documentation
- [ ] Other: ___________

**Q3. How would you rate the quality of AI-enhanced prompts?** (Required)
- ⭐ 1 - Poor
- ⭐ 2 - Fair
- ⭐ 3 - Good
- ⭐ 4 - Very Good
- ⭐ 5 - Excellent

---

### Section 2: Pricing Validation

**Q4. Would you pay for unlimited AI prompts?** (Required)
- [ ] Yes, definitely
- [ ] Probably yes
- [ ] Maybe, depends on price
- [ ] Probably not
- [ ] No, never

**Q5. What's a fair monthly price for Pro?** (Required)
- [ ] $5/month
- [ ] $10/month
- [ ] $15/month
- [ ] $20/month
- [ ] $25+/month
- [ ] I wouldn't pay for it

**Q6. Would you prefer annual billing for a discount?** (Required)
- [ ] Yes, I'd pay annually for 2 months free
- [ ] Maybe, depends on the discount
- [ ] No, I prefer monthly

---

### Section 3: Feature Requests

**Q7. What features would make Pro worth it for you?** (Required, Checkboxes)
- [ ] Unlimited AI prompts (no daily limit)
- [ ] Higher quality AI (Claude Sonnet or GPT-4)
- [ ] Cloud sync across devices
- [ ] Custom prompt templates
- [ ] Team sharing features
- [ ] IDE plugins (VS Code, Cursor, Windsurf)
- [ ] Priority support
- [ ] API access
- [ ] Other: ___________

**Q8. What's your #1 most wanted feature?** (Required, Short Answer)
```
[Text field]
```

**Q9. What's missing or frustrating about the current version?** (Optional, Long Answer)
```
[Text area]
```

---

### Section 4: About You

**Q10. What's your primary IDE?** (Required)
- [ ] Cursor
- [ ] VS Code
- [ ] Windsurf
- [ ] Other: ___________

**Q11. What programming languages do you use most?** (Required, Checkboxes)
- [ ] JavaScript/TypeScript
- [ ] Python
- [ ] Go
- [ ] Rust
- [ ] Java
- [ ] C#
- [ ] Other: ___________

**Q12. Would you recommend ShepWhispr to a friend?** (Required, NPS)
- 0 (Not at all) to 10 (Extremely likely)

---

### Section 5: Stay Connected

**Q13. Want early access to Pro when it launches?** (Optional)
- [ ] Yes, add me to the Pro waitlist!
- [ ] No thanks

**Q14. Email (for Pro waitlist only)** (Optional, Email validation)
```
[Email field]
```

**Q15. Anything else you want to share?** (Optional, Long Answer)
```
[Text area]
```

---

## Form Settings

- **Collect email addresses:** Optional
- **Limit to 1 response:** Yes (by cookies, not login)
- **Edit after submit:** No
- **Confirmation message:** "Thanks for your feedback! 🐑 Your input directly shapes what we build. Keep using ShepWhispr - your AI limit resets at midnight!"

---

## After Creating the Form

1. Get the form URL (e.g., `https://forms.gle/ABC123`)
2. Update the desktop app with the real URL:
   - File: `/desktop/src/main/index.ts`
   - Find: `https://forms.gle/YOUR_GOOGLE_FORM_ID`
   - Replace with your actual form URL

3. Test the flow:
   - Use 30 prompts
   - Hit limit → Dialog appears
   - Click "Give Feedback" → Form opens
   - Submit → Confirmation page

---

## Responses Analysis

After collecting responses:

### Key Metrics to Track

1. **Pricing validation:**
   - % willing to pay
   - Modal price point
   - Annual vs monthly preference

2. **Feature prioritization:**
   - Most requested features
   - #1 feature by frequency
   - Pain points

3. **NPS Score:**
   - Promoters (9-10)
   - Passives (7-8)
   - Detractors (0-6)
   - NPS = % Promoters - % Detractors

4. **Usage patterns:**
   - Avg prompts/day
   - Primary use cases
   - IDE distribution

### Decision Criteria for Beta Launch

**Launch Pro in Beta if:**
- ✅ 60%+ willing to pay (Q4: "Yes" or "Probably yes")
- ✅ 50%+ would pay $10/month or more (Q5)
- ✅ NPS > 30 (Q12)
- ✅ 5+ responses

**Don't launch Pro if:**
- ❌ < 40% willing to pay
- ❌ < 30% at $10+ price point
- ❌ NPS < 20
- ❌ Major UX issues reported (Q9)

---

**Next step:** Create the Google Form at https://forms.google.com
