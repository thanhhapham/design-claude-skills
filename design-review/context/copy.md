# Carousell Copy & Language Guidelines

*Source: Carousell UX Content Style Guide v2.0 + Copywriting Guide*

---

## Core Writing Principles

### 1. Inverse pyramid
Lead with the most important information. Users scan, not read. The first line is the only line many users will see. Put the action or key message first, supporting context second.

### 2. Active voice, always
Write what the user or system does, not what is being done to them.

- **Correct:** "Add a photo"
- **Wrong:** "A photo can be added"
- **Correct:** "We couldn't verify your account"
- **Wrong:** "Your account could not be verified"

### 3. Contractions, always
"you're", "we'll", "don't", "it's", "they're". Contractions make copy feel human and conversational. The only exception is formal/legal contexts.

- **Correct:** "You're all set"
- **Wrong:** "You are all set"

### 4. Plain language, always
No jargon, no internal product naming that leaks into user-facing copy, no legalese. If a word needs explanation, replace it.

---

## Capitalisation Rules

### Sentence case everywhere
Apply to: CTAs, labels, headers, subheadings, tab names, button text, onboarding copy, error messages, empty state copy, notification titles.

- **Correct:** "Complete your profile"
- **Wrong:** "Complete Your Profile"
- **Wrong:** "COMPLETE YOUR PROFILE"

### Title Case exceptions (very limited)
Title Case is only acceptable for: formal product names ("Carousell Select", "Certified Watches"), category names when used as a proper noun ("Luxury Watches" as a branded section), and legal/contractual headings.

---

## Punctuation Rules

### No Oxford comma
"red, white and blue" — not "red, white, and blue"

### No periods on CTAs, headers, or subheadings
Periods only appear in full paragraphs of body copy.

- **Correct CTA:** "Get started"
- **Wrong CTA:** "Get started."
- **Correct header:** "Sell faster with better photos"
- **Wrong header:** "Sell faster with better photos."

### Question marks and exclamation marks
Use sparingly. Exclamation marks only for genuine celebration moments ("Your item sold!"). Never use them for routine states. Never use multiple ("!!!" is never acceptable).

---

## Numbers

### Spell out 1–9; numerals for 10+
- "three photos", "nine listings", "10 results", "42 buyers"
- Exception: always use numerals for prices, dates, measurements, and percentages

### Prices
- Always numerals: "S$12", "RM50", "PHP 300"
- Currency symbol directly precedes the number, no space: "S$12" not "S$ 12"
- Never: "SGD 12" in user-facing copy (use "S$" instead; "SGD" is formal/legal only)

---

## Currency Formatting

| Market | Symbol | Format | Example |
|--------|--------|--------|---------|
| Singapore | S$ | S$[amount] | S$12, S$1,200 |
| Malaysia | RM | RM[amount] | RM50, RM1,200 |
| Philippines | PHP | PHP [amount] | PHP 300, PHP 1,200 |
| Hong Kong | HK$ | HK$[amount] | HK$80, HK$1,200 |
| Taiwan | NT$ | NT$[amount] | NT$350 |
| Indonesia | Rp | Rp[amount] | Rp50,000 |

- Thousands separator: comma (1,200 not 1200)
- Decimals: only when necessary for pricing precision (S$12.50 acceptable; S$12.00 → just S$12)

---

## Standard Vocabulary (Non-Negotiable Terms)

Always use these terms, never substitutes:

| Use this | Not this |
|----------|----------|
| Store | Shop |
| Buyers | Customers / Users (in buyer-facing copy) |
| Listing form | Listing page / Post a listing page |
| Like | Save / Favourite / Wishlist (as a verb) |
| Offer | Bid (unless in auction context) |
| Seller | Merchant (unless in formal/legal) |
| Chat | Message / DM / Contact |
| Coins | Credits (Carousell's in-app currency) |

---

## "Please" and "Sorry"

### Please
Use "please" sparingly. Overuse makes copy feel mealy-mouthed or passive.

- **Use:** When asking users to do something that benefits us but inconveniences them ("Please verify your phone number before listing")
- **Don't use:** For actions the user wants to take ("Please add your listing photos" — just say "Add your listing photos")

### Sorry
Use only when Carousell is genuinely at fault for the problem.

- **Use:** "Sorry, we're having trouble loading this right now" (system error)
- **Don't use:** "Sorry, this item has been sold" (not our fault; just state the fact)

---

## Error Messages

Good error messages:
1. Say what happened in plain language
2. Explain why (if it helps the user)
3. Tell the user what to do next
4. Match Nielsen Heuristic 9 — help users recognize, diagnose, and recover from errors

**Structure:** [What happened] + [Why, if helpful] + [What to do]

- **Correct:** "We couldn't upload your photo. Check your connection and try again."
- **Wrong:** "Upload failed. Error code: 403"
- **Wrong:** "Something went wrong."

Never:
- Use technical error codes in user-facing messages
- Blame the user ("You entered an invalid phone number" → "That phone number doesn't look right — double-check and try again")
- Use all-caps for errors
- End error messages with a period if they're short fragments

---

## Empty States

Every empty state needs:
1. A clear statement of what's empty (what the user expects but isn't here)
2. A reason (if not obvious)
3. A clear action (what to do next)
4. Ideally: a brand illustration to add warmth

- **Correct:** "No listings yet. Start selling by adding your first item." + [Add listing CTA]
- **Wrong:** "Nothing here yet."
- **Wrong:** "No data found."

---

## Notifications and Push Copy

- Lead with the benefit or action, not the sender name
- Under 60 characters for title, under 100 for body where possible
- Personalise where data allows ("Sarah liked your listing" not "Your listing was liked")
- Never use all-caps for emphasis
- Sentence case for title, sentence case for body

---

## Microcopy Patterns

### CTAs
- Action verb first: "List item", "Make offer", "Start chat", "Complete profile"
- No "Click here" or "Tap to..."
- One CTA per primary action; don't stack competing CTAs at the same hierarchy level

### Labels and placeholders
- Labels describe the field, not the action: "Item name" not "Enter item name"
- Placeholder text shows an example, not the label: `e.g. iPhone 14 Pro Max, 256GB`
- Never use placeholder text as a substitute for a label (it disappears on focus)

### Tooltips and helper text
- Sentence case, no period
- One sentence maximum
- Explain the why, not the what: "Your response rate helps buyers decide to message you" not "This is your response rate"

---

## Tone Calibration by Context

| Context | Tone | Example |
|---------|------|---------|
| Success / celebration | Warm, enthusiastic (one !) | "Your item sold! Time to arrange the handover." |
| Error / system problem | Calm, helpful, apologetic | "We couldn't load this. Try again in a moment." |
| Empty state | Encouraging, action-oriented | "No offers yet. Bump your listing to get more eyes on it." |
| Onboarding | Welcoming, low-pressure | "Take a quick photo to get started. You can add more later." |
| Trust/safety | Clear, direct, non-alarmist | "We noticed unusual activity on your account. Let's secure it." |
| Transactional (receipts, confirmations) | Neutral, precise, no personality | "Order #123456 confirmed. S$45.00 charged to your card." |
