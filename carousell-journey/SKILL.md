---
name: carousell-journey
description: >
  Fetches the canonical Carousell user journey and touchpoint system from the live Figma
  source-of-truth board. Returns structured buyer/seller journey data, shared touchpoint
  details, JTBD, design tensions, and constraints. Use this skill whenever the user asks
  about Carousell's user journey, buyer flow, seller flow, journey stages, touchpoints,
  shared pages, design tensions, cross-user JTBD, user emotions, pain points, or wants to
  reference or build on the canonical journey map. Also trigger when the user wants to
  design a new screen, write a research brief, or plan a feature and needs context about
  where it fits in the Carousell journey or how it affects shared touchpoints. If the
  request involves Carousell users in any end-to-end flow sense — trigger this skill first.
---

# Carousell Product System — Source of Truth

The canonical product documentation lives in a Figma file at:
**https://www.figma.com/design/JgHPAxQFk37bUZZeFGyzoQ/Agent-knowledge-base?node-id=1-2**

Three frames make up the system:
- `1:2` — **Journey Map**: 7-stage buyer + seller journey with emotions and pain points
- `8:2` — **Touchpoint Map**: Product ecosystem showing all pages color-coded by user type (visual reference only — skip for machine reading)
- `8:3` — **Touchpoint Cards**: Structured cards for every shared page (JTBD, tensions, constraints)

## How to fetch the data

### Step 1 — Check DATA_VERSION (token-efficient)

Before doing a full scan, read the single version node in Frame 3:
```
get_node_info(nodeId: "14:202")
```
This returns a text node: `DATA_VERSION: YYYY-MM-DD`

- If the date **matches** the snapshot below → skip the live scan, use the embedded snapshot
- If the date is **newer** → do a full live scan (Steps 2–3 below) and update the snapshot

### Step 2 — Read the Touchpoint Cards (if rescan needed)

```
scan_text_nodes(nodeId: "8:3")
```

Each card now uses **combined `LABEL: value` nodes** — a single text node per field where the ALL-CAPS prefix is the field name and everything after `": "` is the value. Parse by splitting on `": "` after matching the label:

| Field prefix | Meaning |
|---|---|
| `TOUCHPOINT:` | Page name |
| `STAGE:` | Journey stage(s) |
| `USERS:` | Who accesses this page |
| `BUYER JTBD:` | What the buyer is trying to accomplish |
| `SELLER JTBD:` | What the seller is trying to accomplish |
| `SHARED SIGNAL:` | How one side's action affects the other |
| `DESIGN TENSION:` | The core conflict to resolve |
| `CONSTRAINTS:` | Technical/product constraints to respect |
| `KNOWN CONTEXT:` | Data points and known truths |

### Step 3 — Read the Journey Map (if rescan needed)

```
scan_text_nodes(nodeId: "1:2")
```

Parse text nodes using these markers:
- `"BUYER · 0X"` / `"SELLER · 0X"` → step label (lane + stage number)
- Nodes starting with `"ACTIONS:"` → primary actions (split remainder by `\n`)
- Lines starting with `📱` or `📦` → Carousell touchpoint
- Lines starting with an emotion emoji → emotional state
- Text after `—` on the emotion line → pain point

> Frame `8:2` (Touchpoint Map) is visual-only — skip it for machine reading.

---

## Known structure

### Journey Map — 7 Stages

| # | Stage | Pill colour |
|---|-------|-------------|
| 01 | Awareness | Deep indigo #5E35B1 |
| 02 | Registration | Royal blue #1565C0 |
| 03 | Discovery | Dark teal #00695C |
| 04 | Engagement | Forest green #2E7D32 |
| 05 | Transaction | Burnt amber #C45A00 |
| 06 | Fulfillment | Crimson #B71C1C |
| 07 | Post-Sale | Deep magenta #880E4F |

**Buyer lane** — terracotta header bar (#C4511A)
**Seller lane** — deep teal header bar (#0A8A7A)

### Touchpoint Map — Page Ecosystem (node 8:2, visual only)

| Lane | Pages |
|------|-------|
| 🟠 Buyer Only | Home/Feed, Search, SRP, Buyer Offers, My Purchases |
| 🟣 Shared | LDP, Chat, Me Page |
| 🩵 Seller Only | Create Listing, Manage Listings, Boost/Seller Tools, My Orders |

> My Purchases and My Orders are cross-interacting: they share the same order state model. Changes to one surface in the other.

### Touchpoint Cards — All Pages (node 8:3)

Seven cards in two rows:
- **Row 1 (shared pages):** Chat, LDP, Search, SRP, Me Page — deep violet headers (#4527A0)
- **Row 2 (cross-interacting):** My Purchases (terracotta #C4511A), My Orders (deep teal #0A8A7A)

Each card has 9 combined fields: `TOUCHPOINT` / `STAGE` / `USERS` / `BUYER JTBD` / `SELLER JTBD` / `SHARED SIGNAL` / `DESIGN TENSION` / `CONSTRAINTS` / `KNOWN CONTEXT`

---

## Output format

### When asked about the journey

Present parsed data as a structured reference:

---

## 🛍 Buyer Journey

| Stage | Actions | Touchpoint | Emotion | Pain Point |
|-------|---------|------------|---------|------------|
| 01 · Awareness | ... | ... | ... | ... |
| 02 · Registration | ... | ... | ... | ... |
| 03 · Discovery | ... | ... | ... | ... |
| 04 · Engagement | ... | ... | ... | ... |
| 05 · Transaction | ... | ... | ... | ... |
| 06 · Fulfillment | ... | ... | ... | ... |
| 07 · Post-Sale | ... | ... | ... | ... |

## 🏷 Seller Journey

| Stage | Actions | Touchpoint | Emotion | Pain Point |
|-------|---------|------------|---------|------------|
| 01 · Awareness | ... | ... | ... | ... |
| ...  | ... | ... | ... | ... |

---

### When asked about a specific touchpoint or feature design

Present the relevant touchpoint card(s) as a structured summary:

---

## 🟣 [Touchpoint Name] — Shared Page

| Field | Detail |
|-------|--------|
| **Stage** | ... |
| **Users** | ... |
| **Buyer JTBD** | ... |
| **Seller JTBD** | ... |
| **Shared Signal** | ... |
| **Design Tension** | ... |
| **Constraints** | ... |
| **Known Context** | ... |

---

## Fallback: if Figma is unreachable

If MCP tools fail, use this embedded snapshot and note it may be outdated.

### Journey Map Snapshot (synced: 2026-03-07)

**Buyer Journey:**
1. **Awareness** — ACTIONS: Sees ad or referral · Searches in App Store · Finds a Carousell listing | 📱 App Store · Organic search | 😐 Curious | Needs social proof
2. **Registration** — ACTIONS: Downloads the app · Creates buyer account · Sets up profile | 📱 App sign-up · Onboarding | 🙂 Hopeful | Sign-up friction
3. **Discovery** — ACTIONS: Searches by keyword · Browses categories · Filters by price & location | 📱 Search bar · Categories | 😊 Excited | Too many results
4. **Engagement** — ACTIONS: Views listing photos · Reads seller reviews · Chats with seller | 📱 Listing page · Chat | 🤔 Evaluating | Fear of scams
5. **Transaction** — ACTIONS: Makes an offer · Taps Buy Now · Negotiates final price | 📱 Make Offer · Buy Now | 😬 Anxious | Price uncertainty
6. **Fulfillment** — ACTIONS: Pays via PayNow or card · Chooses meetup or delivery · Confirms transaction | 📱 CarouPay · Chat | 😮 Anticipating | Safety concern
7. **Post-Sale** — ACTIONS: Receives the item · Verifies condition · Leaves rating & review | 📱 Ratings · Reviews | 😄 Satisfied | Quality as described?

**Seller Journey:**
1. **Awareness** — ACTIONS: Has items to declutter · Hears about Carousell · Searches in App Store | 📦 Word of mouth · Referral | 😊 Motivated | Getting started
2. **Registration** — ACTIONS: Downloads the app · Creates seller account · Completes profile setup | 📦 App Store · Sign-up flow | 🙂 Optimistic | Listing setup friction
3. **Discovery** — ACTIONS: Takes item photos · Writes description & tags · Sets price & category | 📦 Listing form · Camera | 🤔 Careful | Pricing it right
4. **Engagement** — ACTIONS: Bumps listing for views · Monitors enquiries · Responds to messages | 📦 Bump · Promoted listings | 😓 Patient | Waiting for buyers
5. **Transaction** — ACTIONS: Reviews incoming offers · Negotiates with buyer · Confirms the deal | 📦 Make Offer · Chat | 😊 Engaged | Active negotiation
6. **Fulfillment** — ACTIONS: Arranges meetup time · Ships the item · Shares tracking number | 📦 Chat · Meetup · Shipping | 😅 Hopeful | Smooth delivery
7. **Post-Sale** — ACTIONS: Receives payment · Gets reviewed by buyer · Relists or buys items | 📦 CarouPay · Review system | 😄 Accomplished | Deal closed

### Touchpoint Cards Snapshot (synced: 2026-03-07)

**Chat:** TOUCHPOINT: Chat | STAGE: Engagement → Transaction | USERS: 🟠 Buyer + 🩵 Seller | BUYER JTBD: Negotiate price, feel safe before committing | SELLER JTBD: Qualify buyers, close deals fast | SHARED SIGNAL: Offer sent → seller notified; marked sold → buyer updated | DESIGN TENSION: Buyer needs time to decide; seller wants fast responses | CONSTRAINTS: Offer UI changes affect both send and receive views | KNOWN CONTEXT: 60% of deals close via chat; sellers disengage if no reply within 2h

**LDP:** TOUCHPOINT: LDP (Listing Detail Page) | STAGE: Discovery → Engagement | USERS: 🟠 Buyer + 🩵 Seller | BUYER JTBD: Evaluate item and seller before deciding to contact | SELLER JTBD: Monitor listing performance, manage interest | SHARED SIGNAL: Seller edits price → buyer sees update; marked sold → page shows sold | DESIGN TENSION: Buyer needs full info upfront; seller wants to control what's shown | CONSTRAINTS: Same page renders for owner vs buyer — different actions shown | KNOWN CONTEXT: Primary entry from SRP; most offers are initiated here

**Search:** TOUCHPOINT: Search Page | STAGE: Discovery | USERS: 🟠 Buyer (primary) + 🩵 Seller (secondary) | BUYER JTBD: Find relevant items fast using keywords | SELLER JTBD: Research competitor pricing, test listing visibility | SHARED SIGNAL: Seller's listing title/keywords directly surface in buyer's results | DESIGN TENSION: Buyer wants relevance; seller wants visibility | CONSTRAINTS: Algorithm changes affect both sides simultaneously | KNOWN CONTEXT: Entry point for 70% of buyer sessions; sellers test visibility via incognito

**SRP:** TOUCHPOINT: SRP (Search Results Page) | STAGE: Discovery | USERS: 🟠 Buyer (primary) + 🩵 Seller (secondary) | BUYER JTBD: Scan and compare listings before clicking through | SELLER JTBD: Check how their listing appears vs competitors | SHARED SIGNAL: Seller's thumbnail and price drive buyer's click decision | DESIGN TENSION: Buyer wants consistent card info; seller wants to stand out | CONSTRAINTS: Card layout changes affect how listings display for all sellers | KNOWN CONTEXT: Price and hero image are primary click-through factors for buyers

**Me Page:** TOUCHPOINT: Me Page | STAGE: Post-Sale / Account | USERS: 🟠 Buyer + 🩵 Seller | BUYER JTBD: Track purchases, manage offers and wishlist | SELLER JTBD: Manage listings, track sales and payouts | SHARED SIGNAL: Completed transaction updates both buyer and seller Me Page states | DESIGN TENSION: Buyer wants purchase history; seller wants sales analytics — same space | CONSTRAINTS: One unified profile serves two very different use cases | KNOWN CONTEXT: High-frequency for power sellers; buyers mainly access post-purchase

**My Purchases (cross-interacting — buyer page):** TOUCHPOINT: My Purchases | STAGE: Transaction → Fulfillment → Post-Sale | USERS: 🟠 Buyer (owns this view) — seller actions drive the state shown here | BUYER JTBD: Track order status, know when item arrives, and confirm receipt to complete the transaction | SELLER JTBD: N/A (seller does not access this page) — but seller marking shipped / updating tracking directly changes what buyer sees here | SHARED SIGNAL: Seller marks shipped → buyer sees tracking update; buyer confirms receipt → order completes on both sides; seller disputes → buyer notified | DESIGN TENSION: Buyer wants real-time status clarity; the accuracy of what they see depends entirely on seller's actions in My Orders | CONSTRAINTS: Order created via Buy Now — changes to Buy Now flow directly affect what appears here; shares order state with My Orders | KNOWN CONTEXT: Buyer's primary reference post-purchase; connects to refund/return flows; any design change here must be validated against My Orders

**My Orders (cross-interacting — seller page):** TOUCHPOINT: My Orders | STAGE: Transaction → Fulfillment → Post-Sale | USERS: 🩵 Seller (owns this view) — buyer actions (payment, receipt confirmation) drive the order state | BUYER JTBD: N/A (buyer does not access this page) — but buyer paying creates the order and buyer confirming receipt closes it | SELLER JTBD: Fulfill orders efficiently — update shipping info, manage disputes, and ensure smooth handover to buyer | SHARED SIGNAL: Buyer pays → order appears in My Orders; seller marks shipped → My Purchases updates; buyer confirms receipt → order closed on both sides; cancellation by either party voids both views | DESIGN TENSION: Seller needs operational efficiency across multiple orders; any friction in their flow delays state updates that buyers are waiting on | CONSTRAINTS: Shares the same order state model as My Purchases — any change to order status logic surfaces simultaneously in both views | KNOWN CONTEXT: High-frequency for active sellers; dispute/refund flows originate from here; order cancellation by either party ripples to both views

---

**Source:** [Agent Knowledge Base — Carousell Product System](https://www.figma.com/design/JgHPAxQFk37bUZZeFGyzoQ/Agent-knowledge-base?node-id=1-2)
**Note:** This journey is non-linear. Buyers can become sellers and vice versa. Users may re-enter at any stage.
