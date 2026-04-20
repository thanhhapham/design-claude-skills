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

## Core Rules (Quick Reference)

### Grammar & Mechanics
- **Sentence case** always (e.g., "View your listings", not "View Your Listings")
- **Simple past tense** over present perfect (e.g., "You reached your limit", not "You've reached your limit") — unless the time factor matters
- **No periods** in headers, buttons, or CTAs — only use if multiple sentences
- **No Oxford comma** (e.g., "A, B and C", not "A, B, and C")
- **Contractions encouraged** (e.g., "you're", "don't", "we're") — they sound friendlier
- **Numbers**: use digits (3 days, not three days); spell out zero unless it's money ($0, not zero)

### Tone & Voice
- **Active voice** by default (e.g., "We're investigating the issue") — passive only for notifications/errors where the action matters more than the actor
- **Avoid "please"** unless it's Carousell's fault (e.g., "Please re-enter your details" after a crash, not "Please adjust your price")
- **Avoid "sorry"** unless it's Carousell's fault; say "We're sorry this happened" not "We're sorry for this incident"
- **Use "they/them"** for gender-neutral pronouns, not "he/she" or "him/her"
- **Use "and"** not "&" (except in brand names like "Health & Beauty")
- **No slang** — keep it accessible (users range from teens to elderly)

### Special Formatting
- **Quotation marks** signal exact product text (e.g., "Tap 'List' to view your drafts" — quote the actual button/label)
- **Single quotes by default** ('like this') unless quoting within a quote ("he said 'like this'")
- **Links**: embed in verb+noun phrase, never show raw URLs (e.g., "Share your thoughts with us" not "Share your thoughts at https://...")
- **Slashes with no spaces**: "Bump/Spotlight", not "Bump / Spotlight"
- **Promo codes in angle brackets & CAPS**: Use promo code <SHIPTOME> for $5 off
- **No exclamation marks** in serious contexts (suspensions, scams, COVID-19 messaging); max 1 per screen elsewhere

### Carousell Terminology
Use these exact terms:
- ✅ "Listings" (not items, products)
- ✅ "Store" (not shop, stall)
- ✅ "Buyers" (not customers)
- ✅ "Mobile number" (not handphone, phone number)
- ✅ "Like the listing" (not favourite)
- ✅ "Meet-up" (noun, deal method) vs "meet up" (verb, action)
- ✅ "Listing form" (not sell form)

### Professional Seller Rules (when applicable)
When copy mentions "Professional seller" or account types:
- **Always capitalize "Professional" and "Personal"** — they're proper nouns (e.g., "You're on a Professional account", "Professional seller badge")
- Never say "professional account seller" — use either "Professional account" or "Professional seller", never both
- Never say "Professional badge" — the badge says "Professional seller", so quote it as such

### Directing Users
- Don't call it a **button** — just say "Tap 'Set up contract'" (obvious enough it's clickable)
- **Don't use colour** to direct (some users are colourblind) — say "Tap 'Request for contract' in Chat", not "Tap the green button"
- Use quotation marks for exact UI text (menu items, button labels, tabs)

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

### When passive voice is OK
Notifications and error messages where the action matters more than the actor:
- ✅ "Your card won't be charged now" (passive, user-focused)
- ✅ "Account suspended" (passive, highlights outcome)
- ✅ "Promo code applied" (passive)

### When to avoid contractions
- Don't contract the main verb (✗ "Contact us if you've any questions")
- Don't contract a noun + verb (✗ "The item'll be delivered")
- When you really need to stress "not": "Do not leave the page" (stronger than "Don't leave")

### Numbers & formatting
- **Prices**: Singapore S$30.50, Malaysia RM30, Philippines PHP1,000 (no space after currency)
- **Ranges**: S$30.50–39 (use en dash, no space, drop currency on second number)
- **Time**: 6PM–9PM, May–September (en dash for ranges)
- **Commas**: 1,000 | 100,000 (not 1000 or 100000)

---

## What to Reference

This skill embeds Carousell's complete content style guide, covering:
- Grammar & mechanics (punctuation, capitalization, tense, numbers)
- Tone & voice (active voice, contractions, emotional language)
- Special cases (links, quotation marks, directing users)
- Carousell terminology (listings, store, buyers, etc.)
- Professional seller rules
- Context-specific guidance (notifications, errors, serious contexts)

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

