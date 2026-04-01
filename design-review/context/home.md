# Carousell Home Cluster — Design Context

*Source: Carousell AOP 2026*

---

## Category Overview

Home Cluster is **Carousell's #1 priority** in AOP 2026 under MWB Pillar 1. The vision: become the one-stop platform for all homeowner needs.

Two distinct sub-categories with different UX models:

1. **Home Goods** (Furniture, Appliances, Electronics for home) — standard C2C listing/search model
2. **Home Services** (Renovation, Aircon, Moving, Cleaning) — **provider-oriented model**, fundamentally different from listing search

Home Services is the higher-growth, higher-complexity design space. Most of the unique design challenges in this section relate to Home Services.

---

## AOP 2026 Targets

| Metric | Current | Target |
|--------|---------|--------|
| SG monthly Responses | 482k | 531k (+10% YoY) by Jun 2026 |
| HK monthly Responses | 215k | 235k (+10%) |
| SA (Service Ad) renewal rate | 50% | 75% (+50%) by Jun 2026 |
| SA dollar renewal | — | 100% by Jun 2026 |
| Home Services monthly avg responses | 66.8k | 80k (+20%) by Jun 2026 |
| Home Services respondents | 32k | 38.5k |
| MAU to Search Conversion | baseline | +20% YoY |
| Furniture SEO sessions | 14K/month | 43K/month |
| Home Services SEO sessions | 3.5K/month | 10.5K/month |

---

## What's Being Built

- **"Home+" tab**: One-stop homeowner hub on home and category screens (Renovation, Aircon, Cleaning, Moving, Furniture, Appliances)
- **Provider-oriented search**: Buyers search for *service providers*, not individual listings
- **Service Provider Profiles / Business pages**: Richer profile with portfolio, response rate, reviews, coverage area
- **MyHome improvements**: Reno/repair price estimation, better service request submission
- **Lead recycling and cross-category nudges**: Service request in Renovation → also surface Cleaning and Moving
- **ROAS model evolution**: Moving toward Pay-per-view / auction model for service ads
- **SEO/AEO growth**: Organic traffic targets above

---

## The Core Design Problem: Provider-Oriented vs Listing-Oriented

This is the most important concept to understand for Home Services design.

**Standard Carousell model (C2C goods):**
- Buyer searches for an *item* ("iPhone 14", "blue sofa")
- SERP shows listings (individual items for sale)
- Each result is one item at one price
- Buyer evaluates the item, then the seller

**Home Services model (what's needed):**
- Buyer searches for a *service provider* ("aircon servicing", "one-room renovation contractor")
- SERP should show *providers*, not individual service listings
- Each result is a business/individual with a track record, portfolio, and availability
- Buyer evaluates the provider first, then the service details

**Design implication:** Any design that presents Home Services like a standard listing grid is wrong for this model. The mental model is closer to searching for a plumber on Google Maps than searching for shoes on Shopee.

---

## Service Seeker Experience Principles

### The seeker wants confidence, not choice overload
Service purchases are high-stakes (renovation = tens of thousands of dollars). Buyers spend weeks deciding. Design must build confidence, not overwhelm with options.

Trust signals for service providers (in priority order):
1. Response rate and response time ("Responds within 2 hours")
2. Number of completed jobs and reviews ("42 jobs · 4.8 stars")
3. Portfolio photos (quality of past work)
4. Coverage area (serves your neighbourhood?)
5. Verification status (licensed contractor, KYC verified)
6. SA tier / featured status (paid placement = skin in the game)

### Provider profile completeness = conversion
The more complete a provider's profile, the higher their conversion rate. Design must incentivise completeness — both in onboarding and in ongoing SA renewal flow.

Profile completeness indicators:
- Business name and bio
- Response rate badge
- Portfolio photos uploaded
- Service coverage area defined
- Certifications / licenses noted
- Reviews count

### Lead recycling matters
A buyer submitting a renovation enquiry is also a potential cleaning, moving, and aircon customer. Cross-category nudges at the right moment (post-enquiry, not mid-flow) move multiple response metrics simultaneously.

---

## Service Provider Experience Principles

Providers on Carousell are small-business owners and tradespeople, not tech-native marketers. Design must:

- Make profile setup fast and low-friction (photo upload from phone, simple text fields)
- Show clear feedback on what profile completeness earns ("Complete your profile to appear in more searches")
- Make the SA renewal process simple — 50%→75% renewal rate depends on providers understanding the value they're getting
- Show lead volume, response rate, and profile views as actionable data (not just vanity metrics)
- Make it easy to respond to enquiries from the app — providers work on-site, not at desks

---

## ROAS Model and Paid Placement

Home Services monetises through Service Ads (SA) — paid placements that boost provider visibility. Moving toward a Pay-per-view / auction model.

Design implications:
- Higher paid tiers must get visibly better placement — providers need to see the ROI of upgrading
- "Featured" or "Verified" label must be prominent enough that providers believe it affects buyer choice
- The ROAS model only works if buyers actually click on paid placements — placement and label design must drive genuine interest, not banner blindness

---

## Home Goods (Furniture, Appliances)

More standard C2C model, but with some unique considerations:

### High-consideration, high-value purchases
A sofa or refrigerator is a bigger decision than a phone case. Buyers want:
- Multiple photos from different angles
- Dimensions (critical for furniture — does it fit my space?)
- Condition description with specifics ("minor scratch on left side")
- Location (collection logistics matter for large items)

### Trust signals for Home Goods
- Listing completeness (dimensions, condition photos)
- Seller response rate
- "Able to self-collect" vs "delivery available"
- Price vs brand-new comparison (Good Deals badge opportunity)

### SEO opportunity
Furniture SEO target: 14K → 43K sessions/month. Listing quality and category page structure must support organic discoverability.

---

## "Home+" Tab — Design Considerations

The "Home+" tab is a new surface bringing together the full home cluster. Key design questions:

1. **How do goods and services coexist?** The UX model is fundamentally different. A tab that tries to do both equally may do neither well. Progressive disclosure: surface goods first (more familiar model), services as a distinct section.

2. **Entry point clarity**: What does a user come to this tab *to do*? "Find a contractor" and "buy a sofa" are very different intents with different information needs.

3. **Homeowner journey framing**: A user who just moved = renovation first, then cleaning, then furniture. Design that surfaces the right sub-category at the right time (based on signals) is more valuable than a static grid.

4. **Trust signals at tab level**: If service providers are shown in a grid alongside goods, the card design must convey the provider-oriented model (review count, response rate) vs the goods model (item photo, price).

---

## AOP Impact Scoring Reference

| Pillar | Goal | Metric | Design lever |
|--------|------|--------|--------------|
| Pillar 1 | Goal 1: Home Cluster | Monthly responses SG 482k→531k | Provider discovery friction, search relevance |
| Pillar 1 | Goal 1: Home Cluster | SA renewal 50%→75% | Provider dashboard value clarity, profile completeness nudges |
| Pillar 1 | Goal 1: Home Cluster | Home Services respondents 32k→38.5k | Provider profile trust signals, lead quality |
| Pillar 2 | Goal 5: BX | MAU to Search Conversion +20% | Discovery surface design, Home+ tab |
