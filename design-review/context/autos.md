# Carousell Autos — Design Context

*Source: Carousell AOP 2026, product knowledge*

---

## Category Overview

Autos is one of Carousell's three priority categories under MWB Pillar 1 (Category Market Focus). The category covers:
- Cars (primary, SG + MY)
- Motorcycles
- Car Rental
- Accessories & Workshops

The fundamental challenge: Carousell Autos has **significantly fewer listings than competitors** (especially SgCarMart in Singapore). This is not a discovery UX problem — it is a supply problem. Design must work harder with fewer listings to still surface relevant results and maintain buyer confidence.

---

## AOP 2026 Targets (SG)

| Metric | Current | Target |
|--------|---------|--------|
| Direct-owner listings (weekly effective) | 153 | 170 (+11%) by Jun 2026 |
| Dealer listings in Carousell Select | — | 1,000 by Mar 2026 |
| MY live listings (via Mudah cross-listing) | 23k | 118k (+513%) |
| Motorcycle/Car Rental/Accessories ARPU | baseline | +7–26% |

---

## Competitive Landscape

### SgCarMart (primary competitor, SG)
- Dominant supply advantage: far more listings than Carousell Autos
- Buyers with intent often check SgCarMart first because inventory breadth is higher
- Strong dealer relationships — most dealers list on SgCarMart as primary
- Design implication: when Carousell shows fewer results, it must feel curated, not depleted. "We found the best matches" is better than "14 results found"

### OneShift (SG)
- Motorcycle specialist. Strong community. Niche but loyal user base.
- Less relevant to cars; relevant if the review covers motorcycles.

### Mudah (MY)
- Carousell's cross-listed supply partner. Cross-listing API in development.
- MY market will grow from 23k to 118k listings via this integration.

### Goofish / Xianyu (HK)
- Growing in HK. Chinese-language platform targeting Chinese-speaking users.
- Trust model differs: strong community-verified approach.

---

## Carousell Select

The flagship trust/curation product for Autos. Key facts:

- **What it is:** A curated tier within Autos containing only verified direct owners and reputable dealers
- **Who's in it:** Verified direct owners + approved dealers (not all dealers qualify)
- **Why it matters:** Trust is the #1 barrier to car purchases. Buyers fear misrepresented condition, hidden accidents, odometer fraud. Select addresses this.
- **Design goal:** Select listings must feel clearly differentiated from standard listings. Not just a badge — a visual tier that communicates "we've checked this".

**Design implications for Carousell Select:**
- Verified badge must be visually prominent, not just a small icon
- Select listing cards should have distinct visual treatment (not just a small badge on a standard card)
- The Select value proposition must be communicated on the SERP, not just the LDP
- Trust signals unique to Autos: mileage, COE expiry, condition, accident history, ownership count
- Dealer verification process must have a visible output (user-facing credential, not just internal flag)

---

## Buyer Journey in Autos

Unlike C2C for items (browse → tap → chat → buy), auto purchases involve:

1. **Intent search**: Specific make, model, year, price range
2. **Shortlisting**: Compare 3–5 options across SERP
3. **Deep research**: LDP — photos, specs, seller details, price history
4. **Contact**: Chat to arrange physical inspection
5. **Offline transaction**: The actual purchase happens in person (not on platform)
6. **Post-sale**: Transfer, insurance, COE considerations

Design implications:
- SERP must support comparison (key specs visible without opening listing)
- LDP must load fast and show all relevant trust signals above fold
- Chat initiation is the conversion goal — the platform's job ends there
- Offline transaction means the platform cannot capture payment data — trust must be established before the user leaves the platform

---

## Supply Constraint Design Strategies

When supply is limited (fewer results than competitors), the design must compensate:

### 1. Show value of what exists
- Surface the right 14 results confidently, not apologetically
- Use "Best matches" framing, not "X results found" (avoids exposing low count)
- Price-per-listing quality signals become more important when quantity is low

### 2. Reduce filter friction
- Hard filters (exact make + model + year + price) on low supply = zero results = user leaves
- **Smart refinement / natural search**: allow semantic queries ("SUV under 80k with low mileage") that match flexibly
- Progressive filter application: show results as filters are applied, don't gate behind an "Apply" button
- When results narrow to <5, proactively suggest related alternatives

### 3. Cross-listing (MY)
- Mudah supply integration: 23k → 118k listings
- Design must handle cross-listed supply gracefully — source attribution, cross-border considerations

---

## Trust Signals Unique to Autos

Unlike fashion or electronics, auto listings need specific trust signals:

| Signal | Why it matters |
|--------|----------------|
| Mileage | Primary condition proxy for cars |
| COE expiry (SG) | Critical cost factor — affects total ownership cost |
| Accident history | Biggest fear for secondhand car buyers |
| Number of previous owners | More owners = more doubt |
| Last serviced date | Maintenance signals |
| Inspection report | Strongest trust signal — third-party verified |
| Dealer verification | Reputable vs. unknown dealer |
| Direct owner vs. dealer | Buyers often prefer direct owner for price |
| Carousell Select badge | Platform-level curation and verification |

All trust signals should be visible on the SERP card (at least primary ones) and fully expanded on the LDP. Hiding them "to reduce clutter" reduces conversion.

---

## Interaction Patterns to Preserve

- **Photo-forward listing cards**: Car photos are the first hook. Multiple photos per listing expected.
- **Spec chips on SERP**: Mileage, year, transmission — the shorthand buyers use to triage
- **Price negotiation signal**: "Negotiable" or "Fixed price" label matters; buyers will open chat if negotiable
- **Map / area indicator**: Buyers care about location for inspection logistics
- **Chat CTA prominence**: Should be the primary CTA on the LDP; call-to-action hierarchy must be clear

---

## Copy Considerations for Autos

- COE expiry should show date and remaining years: "COE expiry: Mar 2028 (2 years left)"
- Mileage: always with unit ("98,000 km" not just "98,000")
- Prices: S$ format, no decimal needed for round amounts
- "Negotiable" — use this exact word, not "Neg" (abbreviation is ambiguous)
- Carousell Select: always use full name, never abbreviate to "Select" alone in body copy (contextual after first use is fine)

---

## AOP Impact Scoring Reference

| Pillar | Goal | Metric | Design lever |
|--------|------|--------|--------------|
| Pillar 1 | Goal 2: Autos SG Supply | Direct-owner weekly listings 153→170 | Listing flow friction reduction, seller trust in platform |
| Pillar 1 | Goal 2: Autos SG Supply | Dealer listings in Select → 1,000 by Mar 2026 | Select differentiation design, dealer onboarding |
| Pillar 2 | Goal 6: STR | SG 7D STR 13.6%→16% | Price guidance, Good Deals badging, seller nudges |
| Pillar 2 | Goal 5: BX | Engaged buyers +25% | Discovery, search relevance, click-through |
