# LDP/PDP Spacing Guidelines

*Source: LDP/PDP Spacing Adjustment — App/Mweb*

---

## Structure hierarchy

Four levels. Not all levels are required — only add Group/Unit layers when they help organise content.

| Level | What it is | Example |
|-------|-----------|---------|
| **Section** | Largest container. Serves a distinct user purpose. Can be understood independently from others. | Listing details, Delivery & FAQ, Seller & Review |
| **Block** | Functional sub-group inside a Section. Groups content that shares a specific task or topic. | Name & pricing, Listing options, Description |
| **Group** | Collection of related Units inside a Block. Items are related but individually distinct. | Storage selection, Colour selection |
| **Unit** | Components that together express one piece of information. Inseparable. Can be a single component. | Button, Icon, Input field, price + strikethrough price |

**Hierarchy:** Section → Block → Group → Unit

---

## Spacing values

| Value | Rule |
|-------|------|
| **0px** | Within a Unit — elements are inseparable and read as one piece of information |
| **8px** | Between Units within the same Group or Block |
| **16px** | Between Groups within the same Block |
| **24px** | Between Blocks within the same Section |
| **32px** | Between Sections |

**Memory rule:** Closer = more related. 0px (fused) → 8px (units) → 16px (groups) → 24px (blocks) → 32px (sections)

---

## Page top margin rule

The first Section on the page always starts with **16px** from the top of the content area.

---

## How to review spacing

### Default — flag by value, not by hierarchy name
Do not try to identify whether something is a Section, Block, Group, or Unit before checking spacing. Instead:
- Measure the actual gap between elements
- Flag any gap that does not match the defined scale (0 / 8 / 16 / 24 / 32px)
- Flag any inconsistency where visually similar content uses different spacing values

Spacing violations are measurable without knowing the hierarchy level. A gap of 20px is wrong regardless of whether the boundary is a Group or Block.

### When hierarchy is ambiguous — ask the designer
If the content structure is genuinely unclear (e.g. it's hard to tell whether two clusters are separate Blocks or Groups within the same Block), ask one targeted question before concluding on the spacing finding:

> "I can see [N] content clusters in [section name]. Are these separate Blocks or Groups within the same Block? This affects whether the gap between them should be 16px or 24px."

Only ask when the answer would change the finding. Do not ask for every boundary.

---

## Status

- Block vs Group distinction: definition to be finalised
- Edge cases (backgrounds, rounded elements, dividers, full-bleed images): to be defined
- Desktop/web version: to be added in the future
