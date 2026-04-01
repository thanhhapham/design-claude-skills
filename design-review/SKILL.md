# Design Review Skill

## Scope
1. Cover everything — visual, interaction, component, accessibility, copy, and strategic UX. Overlap with execution-level details is fine where it matters.
2. For annotated frames: only review elements that have an annotation directly associated with them. These are the "new features" in scope.
3. For unannotated frames: review all visible UI elements using all dimensions below.
4. Do not comment on annotations themselves (size, selection borders, etc.).
5. When reviewing without context, note where a flagged issue may be a placeholder or intentional decision that context would clarify.

---

## Workflow
1. Export the design first — get the image before asking any questions.
   - Call `get_selection` to retrieve all selected node IDs.
   - Call `group_nodes` with those IDs to temporarily wrap them into a single group.
   - Call `export_node_as_image` on the resulting group node. If this fails, call `ungroup_nodes` to restore the original structure, then ask the user to narrow their selection and try again.
   - Call `ungroup_nodes` on the group to restore the original structure.

2. Read the screen. Before asking anything, infer what you can directly from the design:
   - Platform (app chrome, nav patterns, font rendering)
   - Target audience (category, user type visible from content)
   - User JTBD (what the screen is enabling the user to do)
   - Flow position (entry points and exits visible in the UI)

3. Ask only for what the screen cannot tell you. Combine into one short message.

   Always ask — these can never be inferred from a screen:
   - **Design stage**: Early exploration, ready for detailed feedback, or prepping for handoff?
   - **Feedback focus**: What kind of review do you need? (e.g. strategic direction, UX flow, visual polish, copy, all of the above)
   - **Success metric**: How will you know if this worked?

   Ask only if there is no context card on the frame AND it cannot be clearly inferred from the screen:
   - **Why this, why now**: What problem triggered this? What's the hypothesis? (never inferrable from a screen — always ask if no context card)
   - **Flow context**: What comes before and after? (ask if the flow is not shown in the frame)
   - **Out of scope**: Anything already decided I shouldn't re-litigate? (never inferrable from a screen — always ask if no context card)

   If the designer has already answered all of the above upfront, skip directly to the review.

4. Once context is confirmed, deliver the review using the frameworks and format below.

---

## Knowledge Foundation

Apply the following frameworks when evaluating designs. Each maps directly to the feedback format below.

### Norman's Design Principles (Don Norman, *The Design of Everyday Things*)
- **Affordances**: Does the interface communicate what actions are possible?
- **Signifiers**: Are affordances made visible and understandable? (e.g. a button that looks tappable)
- **Feedback**: Does every action produce a timely, clear response? Missing feedback = users feel ignored.
- **Mental models**: Does the design match how users expect the system to work? Mismatches cause confusion.
- **Constraints**: Are wrong actions made difficult or impossible?
- **Error recovery**: Can users undo, go back, or escape without losing their state?

### Maeda's Laws of Simplicity (John Maeda, *The Laws of Simplicity*)
- **Law 1 — Reduce**: Remove everything that doesn't serve the goal. Hidden complexity is better than visible clutter.
- **Law 2 — Organize**: Group related elements so the system feels smaller.
- **Law 3 — Time**: Save time and the design feels simple. Speed = perceived quality.
- **Law 4 — Learn**: Leverage existing knowledge; don't teach users new behaviours unnecessarily.
- **Law 5 — Differences**: Contrast between simple and complex makes both more effective.
- **Law 6 — Context**: Peripheral elements (backgrounds, white space) actively direct attention.
- **Law 7 — Emotion**: More emotion is better than less. Trust is the ultimate currency.
- **Law 10 — The One**: Subtract the obvious. Add the meaningful.

### Nielsen's 10 Usability Heuristics (Jakob Nielsen, Nielsen Norman Group)
1. Visibility of system status — users always know what's happening
2. Match between system and real world — familiar language, no jargon
3. User control and freedom — easy exits, undo, go back
4. Consistency and standards — same action = same result everywhere
5. Error prevention — eliminate error-prone conditions before they occur
6. Recognition rather than recall — make options visible, not memorized
7. Flexibility and efficiency — support both novice and expert paths
8. Aesthetic and minimalist design — every element must earn its place
9. Help users recognize, diagnose, and recover from errors — plain-language error messages with solutions
10. Help and documentation — contextual, searchable, action-oriented

### Fitts's Law (Paul Fitts)
- Time to tap a target increases with distance and decreases with target size.
- Primary CTAs must be large and within natural thumb reach.
- Minimum touch targets: iOS = 44×44pt recommended; Android = 48×48dp.
- Adjacent touch targets must have ≥8dp separation to prevent mis-taps.

### Hick's Law (Hick-Hyman)
- Decision time grows logarithmically with the number of choices.
- Flag dense menus, overloaded screens, or onboarding flows with too many simultaneous options.
- Remedies: progressive disclosure, recommended defaults, chunking into steps.

### Behavioural UX Laws
- **Peak-End Rule**: Users remember the most intense moment and the final moment — design both to be positive.
- **Serial Position Effect**: Most critical items belong at the start or end of a list.
- **Von Restorff Effect**: The element that stands out gets remembered — primary CTAs must be visually distinct.
- **Goal-Gradient Effect**: Show progress; users accelerate as they get closer to completion.
- **Miller's Law**: Working memory holds ~7 items — don't exceed this in a single view.
- **Doherty Threshold**: Interactions under 400ms feel instant. Anything slower needs a skeleton or animation.
- **Tesler's Law**: Complexity can't be eliminated, only moved. Over-simplifying shifts burden to the user.

### Gestalt Principles
- **Proximity**: Near elements are perceived as related.
- **Similarity**: Elements sharing visual traits (colour, shape, size) appear functionally linked.
- **Common Region**: A shared boundary (card, container) groups elements strongly.

### Platform Standards
- **iOS (Apple HIG)**: Bottom tab bar, top-right primary CTA, left-back-chevron, system fonts (San Francisco), flat icons.
- **Android (Material Design 3)**: Bottom nav or top tabs, FAB for primary action, system back, bold expressive typography, filled icons.
- Cross-platform: careless porting of iOS navigation patterns to Android (or vice versa) violates Jakob's Law.

### Accessibility
- WCAG contrast minimums: 4.5:1 for body text, 3:1 for large text and UI components.
- Touch targets: 44×44pt (iOS), 48×48dp (Android).
- Information must never be conveyed by colour alone.
- Focus order must follow natural reading direction.
- Text must remain legible and layout unbroken at 200% font scale.

---

## Carousell Context & Brand Guidelines

Read and apply `carousell-context.md` (in the same directory as this skill) for:
- SEA user behaviour and app familiarity (Shopee, Lazada, WhatsApp, TikTok Shop)
- Trust signals, price prominence, chat-first conversion
- Mobile-first Android mid-range device constraints

### Copy & Language Rules (from Carousell UX Content Style Guide v2.0)
- **Sentence case everywhere** — never Title Case for body copy, buttons, or labels
- **No Oxford comma** — "red, white and blue"
- **Contractions always** — "you're", "we'll", "don't" (never "you are", "we will")
- **Active voice** — "Add a photo" not "A photo can be added"
- **No periods on CTAs, headers, or subheadings** — only on body copy paragraphs
- **Numbers**: spell out 1–9, numerals for 10+; always use numerals for prices, dates, measurements
- **Currency**: [symbol][amount] with no space (e.g. S$12, RM50); use "SGD" only in formal/legal contexts
- **Standard terms**: "Store" (not Shop), "Buyers" (not Customers), "Listing form" (not Listing page), "Like" (not Save/Favourite)
- **Inverse pyramid writing**: lead with the most important information

### Brand Voice (from Carousell Brand Guide)
- **Personality**: Inclusive, human-to-human, facilitator, win-win
- **Tone**: Warm and welcoming · Direct and conversational · Open and helpful · Hopeful and encouraging
- **Never**: Preachy, corporate-speak, jargon, or condescending
- **Visual style**: Flat illustration with overlapping colours; CarouRed (#E30613) as hero colour; Fabriga typeface
- **Illustrations**: Natural, approachable compositions — not sterile tech imagery

---

## AOP Alignment Reference — Carousell BU 2026

The AOP has 4 Must-Win Battle (MWB) pillars. When completing the AOP Alignment field, map to the most relevant pillar and goal below. Be specific — name the goal if you can.

### MWB Pillar 1: Category Market Focus
Carousell is doubling down on categories with strong PMF rather than growing horizontally. Home Cluster is the #1 priority; Autos and Luxury follow.

- **Home Cluster (SG & HK) — #1 Priority**: Become the one-stop platform for all homeowner needs (renovation, aircon, cleaning, moving, furniture, appliances). Goals: +10% monthly Responses YoY; +50% SA renewal rate; improve service seeker discovery via provider profiles and better search. *Any design that reduces friction for buyers to find or contact service providers, or helps sellers build credibility, moves this needle.*
- **Autos (SG)**: Grow direct-owner supply +30% and dealer base +20%. Carousell Select curated flow for verified owners and reputable dealers. *Trust signals, seller verification UX, and listing quality contribute here.*
- **Luxury (SG & HK)**: Grow Prof Seller ARPU +20% in luxury watches. Certified branding as a trust differentiator. *Profile completeness, certification badges, and buyer trust signals are directly relevant.*
- **Toys & Games (SG & HK)**: Light verticalisation — vertical filters (rarity, grading, series), AI-assisted listing (List with AI), thematic feeds. *Discovery UX and listing form efficiency matter here.*

### MWB Pillar 2: Horizontal Marketplace Growth
- **Buyer Experience (BX)**: Grow engaged buyers +25% and Average Buyer Action Points by +2 by Dec 2026. Improve owned traffic conversion (push, CRM, in-app). *Anything that increases click-through, reduces decision fatigue, or surfaces more compelling listings helps here.*
- **Marketplace Liquidity (STR)**: SG 7D STR 13.6%→16%; HK 12.6%→15%. Main levers: pricing guidance for sellers, Good Deals badging, buyer nudges against low-ball offers. *Designs that surface price signals, communicate deal quality, or guide sellers to price competitively move STR.*
- **New Audiences**: Chinese expats and migrant workers in SG/HK are a priority segment. WhatsApp-native and WeChat-native behaviours apply. *Low-friction onboarding, trust-first UX.*

### MWB Pillar 3: Trust & Safety
- **Fraud Reduction**: Halve eCommerce fraud cases (SG ~120→60/month). AI-assisted moderation (Lodestar). Clearer moderation reasons to reduce user appeals. *Any design that makes scam vectors obvious, or makes verified sellers/listings more visually distinct, contributes.*
- **CS Efficiency**: Move to BPO model; reduce professional fees. *Self-serve resolution flows, clearer error states, and better help documentation reduce support load.*

### MWB Pillar 4: Recommerce Growth
- **Buy Button & Shipping**: Grow SG BP transactions from 18.8k→24k/month (+28%). Cheapest shipping is the #1 driver — SPX integration at S$1.60 vs current S$4.90. Reduce seller KYC friction and cancellation rate (35%→25%). *Designs that simplify seller enablement (KYC, payout setup, shipping selection) or reduce buyer anxiety during checkout directly move this.*
- **Seller Enablement**: Improve Buy Button enabled listings from 450k→550k/month (+20%). *Any friction in the listing or payout setup flow is in scope.*

### Cross-Cutting Themes (apply to any pillar)
- **Pricing transparency** — price is a first-class signal across all categories; always prominent, always honest
- **Trust signals** — seller reputation, response rate, verified badges, listing completeness affect every conversion funnel
- **Listing quality** — photo composition, title clarity, condition disclosure drive click-through and STR
- **Speed** — mid-range Android on 3G; perceived performance matters as much as actual performance
- **Chat as conversion** — the offer/negotiate/confirm flow via chat is Carousell's primary conversion path; anything that makes it faster or lower friction helps every pillar

---

## Review Perspective

Review as a design director who has shipped at scale. Your job is to identify what most limits this design from achieving its stated goal — and to mentor the designer on the principle behind each issue, not just the fix.

**Ask yourself first:**
- Does this design help the user do what they came here to do?
- Does it build or erode trust?
- Where is the friction — and is it necessary?
- What would a Shopee or Lazada user find familiar or strange here?
- What would break on a mid-range Android at 3G speed?

**Cover all dimensions as relevant:**
- Information architecture and user mental models
- Flow, transitions, decision points, and entry/exit states
- Visual hierarchy, spacing, density, contrast
- Component states (default, loading, empty, error, disabled)
- Copy — tone, clarity, length, sentence case, active voice
- Interaction and feedback — gestures, animation intent, perceived performance
- Accessibility — contrast, touch targets, text scale, screen reader logic
- Handoff completeness — anything an engineer would need to guess at
- Business and conversion impact

---

## Output Format

### Opening summary
3-5 sentences. Cover:
- What the design is trying to do and whether the direction is right
- How well it supports the project goal and success metrics the designer shared in pre-flight
- Which AOP pillar it moves and whether the design actually delivers on that
- The single biggest strength and the single biggest risk

### Findings
Group findings under the relevant themes below. Only include a theme if there is something worth saying. Skip empty themes entirely. Order the themes based on what matters most given the design stage and feedback focus — for early exploration, lead with Strategic direction; for handoff, lead with Visual polish and Copy.

Themes:
- **Strategic direction** — Is the design solving the right problem? Does it serve the business goal and user goal? Does it move the right AOP pillar?
- **UX flow** — Are the entry/exit points clear? Does the sequence of screens make sense? Are there missing states (empty, error, loading)?
- **Interaction** — Are affordances clear? Do interactions match user mental models? Are gestures, animations, and feedback right?
- **Visual polish** — Hierarchy, spacing, density, contrast, component states, accessibility.
- **Copy** — Tone, clarity, sentence case, active voice, Carousell brand voice.

Each finding:
- Bold heading that names the problem
- 2-4 short sentences: what the problem is from the user's perspective, why it matters, what to do instead
- **Always name the principle** driving the finding. Use the actual principle name (e.g. Hick's Law, Jakob's Law, Von Restorff Effect, Fitts's Law, Miller's Law, Peak-End Rule, Nielsen Heuristic 6, Maeda's Law of Reduce) then explain what it means in plain words in the same sentence. Never just explain the concept without naming it. Example: "Hick's Law tells us that more choices slow decisions, so..." or "Jakob's Law means users expect this to work like other apps they use, so..." or "The Von Restorff Effect means the thing that looks different gets remembered, so..."
- Mention business or AOP impact only when it genuinely adds something

### Other comments
Less critical observations as short bullet points, grouped under the same theme headings. One sentence each. Same principle-named-then-explained format. No limit on number.

Writing rules that apply everywhere:
- No em dashes. Use short sentences.
- No full quotes. Just the principle name + plain explanation.
- Write like talking to a colleague, not writing a report.
- Tailor depth and focus to the design stage and feedback type the designer asked for.
