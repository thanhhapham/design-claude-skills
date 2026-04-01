# Carousell Luxury — Design Context

*Source: Carousell AOP 2026*

---

## Category Overview

Luxury is Carousell's third priority category under MWB Pillar 1. The primary focus is **luxury watches** in Singapore and Hong Kong, with secondary relevance to luxury handbags, jewellery, and accessories.

The core business model for luxury: professional sellers (dealers, resellers) pay for premium visibility. The platform's job is to deliver qualified leads. Transactions happen **offline** — the platform enables discovery and contact initiation, not checkout.

---

## AOP 2026 Targets

| Metric | Current | Target |
|--------|---------|--------|
| SG Prof Seller ARPU | S$120/month | S$145 (+20%) by Dec 2026 |
| HK Prof Seller ARPU | HK$230/month | HK$275 (+20%) |
| SG Lux watches responses | 38.5k/month | 46.5k (+20%) by Jun 2026 |
| HK Lux watches responses | 20.3k/month | 22.3k (+10%) |
| Price per monthly utilised coin | 0.6¢ | 0.85¢ (+45%) |
| SEO sessions | 12.6K/month | 38K/month |

---

## What's Being Built

- **Certified Watches program**: Authenticated and inspected watches get a "Certified" badge — visible in SERP as a certified tab/tag, on LDP as a value prop
- **Supply tools**: Outreach and bidding tools for professional sellers (CPA/CPL models)
- **Cross-border demand**: SG/HK supply opened to other Carousell markets
- **Dealer Auction**: Structured auction format similar to Autos experience
- **Seller Profile / Business pages**: Prof sellers need a full profile page, not just listings

---

## User Archetypes

### Professional seller (dealer / reseller)
- Runs a physical store or online dealership
- Lists 10–100+ watches at a time
- Primary goal: qualified leads (serious buyers), not casual enquiries
- Pays for SA/featured placement — expects visible ROI
- Success metric: response rate from buyers with genuine intent

### Casual seller
- Selling one or two personal pieces
- Usually one-time or infrequent
- Does not need pro tools; needs simplicity and trust in the platform

### Buyer (collector / enthusiast)
- High-consideration purchase. May research for weeks.
- Needs: authentication confidence, price transparency, seller credibility
- Reference sites: Chrono24, WatchBox, StockX (for price transparency)
- Will not make a S$5,000+ purchase without significant trust signals
- Transaction happens offline — usually meets seller or ships after platform contact

---

## Certified Watches Program

This is the primary trust differentiator for luxury. Key design requirements:

### What "Certified" means to the buyer
A watch listed as Certified has been:
1. Inspected by an authorised assessor
2. Authenticated (not counterfeit)
3. Condition-graded to a standard
4. Listed with accurate specifications

### Badge design principles
- The Certified badge is the primary conversion driver for high-value items
- Must be immediately recognisable and clearly differentiated from standard verified badges
- Should not look generic — must communicate "this has been through a rigorous process"
- Placement: SERP card (prominent, above fold within the card), LDP (above the fold, near price and title)
- The badge alone is not enough — a brief explanation of what Certified means should be accessible (tooltip or linked explanation)

### Certified tab/filter in SERP
- A dedicated "Certified" tab or filter in the Luxury SERP to surface only Certified listings
- This is a conversion tool: buyers who filter to Certified are ready to buy, not just browsing
- Empty state of the Certified tab must not disappoint — ensure enough supply before launching

---

## Prof Seller Differentiation

Professional sellers must stand out visually from casual/unverified sellers on SERP. This is an ARPU driver — if prof sellers don't see their visibility advantage, they won't renew.

### Visual differentiation signals (in priority order)
1. Certified badge (strongest signal for authenticated stock)
2. "Professional Seller" or "Verified Dealer" label
3. Business name (not just username)
4. Response rate badge ("Responds within 1 hour")
5. Review count and star rating
6. Listing count ("Currently 34 listings")

### What prof sellers want to see
- Their profile performing: lead volume, profile views, response rate
- Evidence that their paid tier is delivering visibility
- Tools to manage high listing volume efficiently

---

## Trust Signals Unique to Luxury

Unlike standard C2C, luxury purchases require very specific trust signals:

| Signal | Why it matters |
|--------|----------------|
| Authentication certificate | Primary fear: counterfeit. Third-party auth solves this. |
| Condition grade | Standardised grading (Mint, Excellent, Good) reduces ambiguity |
| Box & papers | Completeness significantly affects resale value and buyer confidence |
| Serial number presence | Verifies authenticity; buyers cross-check with manufacturer |
| Service history | When was it last serviced? Affects functionality and value. |
| Certified badge (Carousell) | Platform-level endorsement — the highest trust signal on-platform |
| Prof seller verification | Established business vs. unknown individual |
| Price vs. market value | Price transparency (Chrono24 comps) — is this a fair price? |

---

## Pricing and Price Transparency

Luxury watch prices fluctuate based on model, condition, box/papers, market demand. Buyers cross-check against:
- Chrono24 (global marketplace with price history)
- WatchBox (authenticated reseller with fixed prices)
- Recent sales data

Design implications:
- Price transparency is a conversion driver: show price context ("Below market average" or Chrono24 comparison)
- Prof sellers price based on market data — any tools that surface market pricing within the listing form help both supply quality and buyer confidence
- Good Deals badging applies where relevant (watches listed below market average for their condition)

---

## The Offline Transaction Reality

All high-value luxury transactions close offline. The platform's job:

1. **Discovery**: Buyer finds the watch
2. **Qualification**: Buyer evaluates trust signals (Certified, seller reputation, photos, price)
3. **Contact**: Buyer initiates chat
4. **Inspection arrangement**: Chat to agree on inspection logistics (in-store, third-party assessor, courier with authentication)
5. **Transaction**: Offline (bank transfer, cash, etc.)

Implications for design:
- Chat initiation is the primary conversion goal
- LDP must answer all pre-purchase questions before the buyer needs to chat (reduces enquiry-to-sale friction for the seller)
- Transaction tracking on-platform is not possible (unlike Buy Button categories)
- Post-sale: review prompt after a period (proxy for closed transaction)

---

## Competitive Context

### Chrono24
- Global marketplace. The reference for watch buyers internationally.
- Strong price transparency features: price history, market average, dealer ratings
- Carousell cannot compete on global supply — must compete on local trust, faster response, and Certified program

### WatchBox / Watchfinder
- Authenticated resellers. Buy and sell themselves.
- Trust model: platform guarantees authenticity. Carousell must approximate this via Certified.

### Facebook / Telegram groups
- Local watch communities where buyers and sellers connect directly
- Low friction, high trust within community, but no platform-level safety
- Carousell can win by offering community-like connection + platform-level protection

---

## AOP Impact Scoring Reference

| Pillar | Goal | Metric | Design lever |
|--------|------|--------|--------------|
| Pillar 1 | Goal 3: Luxury | SG Prof ARPU 120→145 | Prof seller visibility, profile completeness, Certified badge |
| Pillar 1 | Goal 3: Luxury | SG Lux watches responses 38.5k→46.5k | Trust signals, Certified discovery, search |
| Pillar 2 | Goal 6: STR | Price transparency | Chrono24 comps, market pricing signals |
| Pillar 3 | Goal 7: Fraud | Counterfeits | Certified program reduces authentication fraud |
