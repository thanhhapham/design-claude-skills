# Carousell Core Platform Context

## What Carousell Is

A C2C (consumer-to-consumer) marketplace for buying and selling secondhand and new items. Operates across Southeast Asia and East Asia — primarily Singapore, Malaysia, Philippines, Indonesia, Hong Kong, and Taiwan. Core model: sellers list items, buyers discover and initiate contact via chat, negotiate, and transact.

---

## Users

### Seller archetypes
- **Casual seller**: Decluttering personal items. Low frequency. Friction-sensitive — a hard listing form means they don't list at all. Value speed and simplicity above all.
- **Professional reseller**: Regular volume. Cares about ARPU, renewals, visibility. Treats Carousell as a business channel. Wants tools: bulk listing, analytics, promoted listings.
- **Service provider (Home cluster)**: Renovation, aircon, cleaning, moving. Needs a profile, not just listings. Success = inbound leads, not item sales. Response rate and reviews are their currency.
- **Dealer (Autos, Luxury)**: Business with a inventory. Needs dealer-specific tools. Carousell Select / Certified programs target this segment.

### Buyer archetypes
- **Intent buyer**: Has a specific item in mind. Goes directly to search. Wants filters to narrow fast. Price, condition, and seller trust are the main decision inputs.
- **Discovery browser**: No specific intent. Scrolls Explore/Home. Category-led. Impulse purchase is real — "Good Deal" badging works on this segment.
- **Offer negotiator**: Core SEA behavior. Starts a chat to negotiate price. Never pays listed price without trying. Chat is not just messaging — it is the transaction pathway.

### Device and connectivity reality
- Majority of active users are on **Android mid-range devices** (not flagships).
- Connectivity: 3G to 4G. Not always on wifi.
- Implications: heavy image carousels, complex animations, or multi-step flows cause real drop-off. Perceived performance is as important as actual performance.
- Skeletons, optimistic UI, and image lazy-loading are not optional niceties — they are conversion-critical.

---

## Daily App Reference (Mental Models to Design Against)

When evaluating designs, ask: "What would a user of these apps expect here?"

| App | What pattern it installs |
|-----|--------------------------|
| **Shopee / Lazada** | Primary e-commerce reference. Fast image grids, bottom tab nav, prominent price display, seller ratings, badge-heavy UI, chat-based support. Users read this visual grammar fluently. |
| **TikTok Shop** | Video-forward discovery. Content-commerce hybrid. Users are comfortable with browse-without-intent + spontaneous purchase trigger. |
| **Facebook Marketplace** | Casual C2C. DM-to-negotiate flow. Users expect low friction to reach the seller. |
| **WhatsApp** | Chat is the primary communication tool. Messaging must feel instant and lightweight. Long loading times in chat kill trust. |
| **Grab / Gojek** | Map-based UI, ratings, tipping/confirmation flows. Users understand driver-rating analogues — applies to seller review patterns. |
| **Instagram** | Visual grid browsing, explore surface, story-format content. Sets expectations for image quality and layout aesthetics. |

---

## Design Principles (Apply Every Review)

### Trust signals matter
Seller reputation, verified badges, response rates, and listing completeness affect conversion at every step. Missing trust signals equal lower conversion — always. This is not optional polish; it is functional infrastructure.

Key trust signals on Carousell:
- Seller response rate and response time
- Verified badge (ID, phone, email)
- Number of reviews and star rating
- Listing completeness (photos, description, condition)
- Transaction count ("sold X items")
- Carousell Select / Certified badges (Autos, Luxury)
- KYC completion for Buy Button / payout

### Chat is core conversion
The offer/negotiation/confirmation flow via chat is Carousell's primary conversion path. Not the Buy Button — chat. Design must support quick, low-friction chat initiation. Chat-to-Buy-Button transition requires a designed pathway; it does not happen naturally without explicit prompting.

### Price is first-class
Price, discount, and negotiability must always be prominent and clear. Never bury price below fold or in secondary weight. Pricing UX is a conversion driver, not cosmetic.

Key pricing patterns:
- Good Deals badging (≥40% savings vs brand new) — must be visually salient
- Historical price guidance ("priced to sell", "priced normally", "priced above market")
- Seller nudges to reprice — timing is critical (in listing form, post-list, during chat)
- Fast/normal/slow sale price bands — a data layer informing design copy

### Listings are image-driven
Photo quality and composition are the primary click-through driver. UI must support images, not compete with them. Dark overlays, heavy chrome, or cluttered cards reduce the visual impact of the listing photo — which is the listing's core conversion asset.

### Low-literacy and multi-language users
Avoid jargon. Labels, CTAs, and error messages must be plain and direct. Some users read in Bahasa, Filipino, or Chinese. Active voice, short sentences, no idiom-dependent copy.

### Speed over elegance
Users on lower-end devices expect snappy interactions. Heavy animations, complex layouts, and multi-layer scroll effects hurt perceived performance. Doherty Threshold: interactions under 400ms feel instant. Anything slower needs a skeleton or animation.

---

## Common User Goals

### Seller goals
1. List quickly — minimal required fields, AI-assisted (List with AI)
2. Get offers — notifications, response to chat enquiries
3. Close fast — confirm sale, arrange handoff or shipping
4. Get paid — payout without friction (KYC, bank account setup, PayNow)

### Buyer goals
1. Find it — search with the right terms, filter to narrow
2. Verify it's legit — trust signals, seller reputation, listing quality
3. Negotiate — chat initiation is the conversion moment
4. Pay — Buy Button or arrange meetup/transfer

### Browse goals
1. Discover deals — Explore tab, thematic feeds, Good Deals
2. Save for later — Like / wishlist
3. Follow sellers — especially for resellers with regular new stock

---

## Premium App References: Apply With Trade-Off Lens

Premium and top-tier app design (Apple, Airbnb, Linear) is a valid reference for quality bars — interaction polish, typography, spacing, visual hierarchy. Reference these when relevant.

Apply the trade-off lens: Carousell users' daily experience is shaped by Shopee, Lazada, WhatsApp, and TikTok Shop. A pattern that feels intuitive on a premium Western app may feel unfamiliar or friction-heavy to Carousell users. When suggesting something that deviates from SEA app norms, acknowledge that gap and reason through whether the quality gain is worth the familiarity cost.

---

## Platform-Specific Constraints

### Android (primary platform)
- Material Design 3: bottom nav or top tabs, FAB for primary action, system back, bold expressive typography, filled icons
- Back gesture is system-level — do not design custom back affordances
- Text scaling: ensure layouts remain functional at 130% font scale (Android accessibility setting)

### iOS (secondary platform)
- Apple HIG: bottom tab bar, top-right primary CTA, left-back-chevron, system fonts (San Francisco), flat icons
- Careless porting of iOS patterns to Android (or vice versa) violates Jakob's Law — users expect each platform to behave like other apps on that platform

---

## Accessibility Baseline

- WCAG contrast: 4.5:1 for body text, 3:1 for large text and UI components
- Touch targets: 44×44pt (iOS), 48×48dp (Android)
- Information must never be conveyed by colour alone (use icon + colour, not colour alone)
- Focus order must follow natural reading direction (left to right, top to bottom)
- Layout must not break at 200% font scale
