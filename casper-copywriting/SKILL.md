---
name: carousell-copywriting
description: Write, audit, and generate copy that follows Carousell's style guide. Use this skill whenever someone asks to write product copy, review/audit existing copy against Carousell standards, generate copy ideas with multiple options, or prepare copy for engineering handover. Triggers include "write copy for", "audit this", "review the copy", "handover", "ready for eng", or any request involving Carousell product/marketing/notification messaging. The skill covers all copy types—product UI, notifications, marketing, help text, CTAs—and provides format-appropriate responses: quick 5-rule checklists for handover gates, detailed audits with alternatives for reviews, and 2-3 generation options for brainstorming. Also flags Professional seller terminology rules when relevant.
---

# Carousell Copywriting Skill

## Overview

This skill helps you write, audit, and generate copy that aligns with Carousell's content style guide. It supports three core workflows:

1. **Audit existing copy** — Check copy against Carousell standards, explain issues, suggest alternatives
2. **Generate new copy** — Create 2-3 options with different tones/angles so you can pick the best fit
3. **Handover gate** — Quick 5-rule checklist before copy ships to engineering

---

## Core Rules

The full rule set is the single source of truth in [copy.md](copy.md) — Carousell's complete content style guide. Read it before auditing or generating copy. It covers:

- Grammar & mechanics — sentence case, simple past tense, no periods on CTAs, no Oxford comma, contractions, numbers, currency
- Tone & voice — active voice (with the notification/error passive exception), "please"/"sorry" usage, they/them pronouns, no slang
- Special formatting — quotation marks for exact UI text, "and" not "&", links, slashes, promo codes
- Carousell terminology — Listings, Store, Buyers, Mobile number, Meet-up (noun) vs meet up (verb), Listing form
- Professional Seller capitalization rules
- Directing users without relying on "button" or colour
- Error messages, empty states, notifications, microcopy patterns, tone calibration by context

The quick 5-rule checklist below is the fast gate-check derived from that guide — use it for handover, not as a replacement for the full guide.

---

## Three Workflows

### 1. Audit Existing Copy

**When to use:** Someone asks "review this copy", "audit these messages", "is this on-brand?", or you say "handover"

**Output format depends on context:**

#### Quick Handover Checklist (5 rules)
When the trigger is **"handover", "ready for eng", "before we ship"**, I run a fast gate-check:

1. **Sentence case only** — No Title Case or ALL CAPS
2. **No unnecessary "please"** — Only when Carousell's at fault
3. **Use contractions** — "You're", "don't", "we've" sound friendlier
4. **Active voice** — "We're investigating" not "The issue is being investigated"
5. **Carousell terminology** — "Listings", "store", "buyers", not "items", "shop", "customers"

Each rule shows ✓ or ✗, and if failed, a one-line fix.

---

#### Full Detailed Audit (everything in the guide)
When the trigger is **"audit this copy", "review for quality", "polish this messaging"**, I go comprehensive:

For each issue found:
- **What's wrong** (with example)
- **Why** (reference to the guide + rationale)
- **2-3 alternatives** with tone/style notes (e.g., "Option A sounds friendlier, Option B is more direct")
- **Rationale** for each alternative

Example output structure:
```
Original: "Please adjust the price of your items"

Issues:
❌ Unnecessary "please" — not Carousell's fault, can sound harsh
❌ "Items" is vague — Carousell standard is "listings"

Why?
Per the guide: avoid "please" unless making users fix something because of our fault. 
Here the user is choosing to adjust pricing. Also, "listings" is the standard term.

Suggested alternatives:
A) "Adjust the price of your listings" — Direct, conversational
B) "Update your listing prices" — Slightly more formal, emphasizes ownership
C) "Change your prices" — Most concise, action-focused
```

---

### 2. Generate Copy

**When to use:** "Write copy for...", "Help me come up with...", "What should this button say?"

**Output:** 2-3 solid options, each with a different angle or tone.

For each option:
- The copy itself
- **Tone/angle** (e.g., "Friendly", "Action-driven", "Minimal")
- **Use case note** (when this option works best)
- **Key decisions** (what Carousell rules it follows)

Example:
```
Brief: CTA for daily digest email (bundled notifications)

Option A (Friendly): "View all your messages"
Tone: Conversational, welcoming
Use when: You want users to feel like we're checking in with them
Key points: Contraction implied ("You can view..."), active voice, no "please"

Option B (Action-driven): "Check your new messages"
Tone: Direct, slightly urgent
Use when: You want a sense of timeliness/newness
Key points: "New" adds urgency, "check" is crisp, simple past potential

Option C (Minimal): "Read your messages"
Tone: Clean, no frills
Use when: Space is tight or tone should be neutral
Key points: Shortest option, still active voice, accessible verb
```

---

### 3. Handover Gate (Quick Mode)

**When to use:** You mention "handover", "ready for eng", "shipping this", "QA this copy"

**Output:** A pass/fail checklist on 5 key rules, flagged issues get a one-liner fix.

```
✓ Sentence case
✓ No unnecessary "please"
✗ Contractions — should be "You've reached" not "You have reached"
✓ Active voice
✓ Carousell terminology
```

If all pass: "Ready to ship!"  
If issues: List them with quick fixes.

---

## How to Use This Skill

### Ask the skill to audit copy
```
"Can you audit this copy against Carousell standards?"
[paste copy]

"Is this ready for handover to eng?"
[paste copy]
```

### Ask the skill to generate copy
```
"Write a CTA for a listing detail page that encourages sharing"
"Generate copy for an error state when someone exceeds their upload limit"
"What should this notification say?"
```

### Ask the skill to explain a rule
```
"Why do we use contractions?"
"When is passive voice OK?"
"What's the difference between 'meet-up' and 'meet up'?"
```

---

## Edge Cases & Context

### When Professional Seller rules apply
If copy mentions "Professional account", "Professional seller", "account types", or seller tier switching:
- Flag capitalization (must be "Professional" and "Personal", not lowercase)
- Example: "You've been switched to a Professional account" ✓ vs "You've been switched to a professional account" ✗

Passive-voice exceptions, contraction edge cases, and currency/number formatting (including per-market ranges and time formats) are covered in [copy.md](copy.md) — that's the canonical version if you spot any discrepancy with older notes elsewhere.

---

## What to Reference

This skill's workflows point to [copy.md](copy.md), Carousell's complete content style guide, covering:
- Grammar & mechanics (punctuation, capitalization, tense, numbers, currency)
- Tone & voice (active voice, contractions, emotional language)
- Special cases (links, quotation marks, directing users)
- Carousell terminology (listings, store, buyers, etc.)
- Professional seller rules
- Context-specific guidance (notifications, errors, empty states, serious contexts, tone calibration)

When you ask why a rule exists, I'll explain the rationale from the guide (readability, consistency, friendliness, accessibility, brand coherence).

---

## Tips for Best Results

1. **Paste the full context** — If you're auditing copy for a specific screen or feature, give me the headline + body so I can check consistency
2. **Tell me the context** — Is this a notification? A CTA? Help text? The guide has nuances for each
3. **Tell me your audience** — Carousell users range from teens to elderly, so "no slang" is crucial
4. **For generation**: Tell me the tone you want or the use case — I'll tailor the options
5. **Ask follow-ups** — If you don't like an option, tell me why and I'll riff on it

---

## Known Limitations

- This skill doesn't cover **long-form copy** (blog posts, articles) — it's optimized for short-form (product UI, notifications, CTAs, help text)
- It doesn't do **translation or localization** for other Carousell markets (SG, MY, PH, etc.) — it assumes English
- It doesn't make **strategic brand decisions** (e.g., should we call ourselves "Carousell" or just "we"?) — just enforcement of existing guide rules

