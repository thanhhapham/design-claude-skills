# Methodology Selection Matrix

Pick the method by triangulating three axes: research type, what's being measured, and product lifecycle phase.

## Axis 1 — User Research vs Market Research

| Goal | Type | Default methods |
|---|---|---|
| Why does X behaviour happen? | User research | 1:1 interview, contextual inquiry |
| Can users complete X task? | User research | Moderated usability test |
| What mental model do users hold for X? | User research | Card sort / tree test, 1:1 interview |
| **Which of N pre-defined design options is most understandable / least confusing?** | **User research (evaluative)** | **Comprehension survey with forced-choice right/wrong items, optionally + unmoderated think-aloud diagnostic** |
| How big is the market for X? | Market research | Sizing survey, secondary data |
| Which value props matter most? | Market research | MaxDiff, conjoint (suggest, don't plan in detail) |
| What price will the market bear? | Market research | Van Westendorp PSM, conjoint |
| What's our brand vs competitors? | Market research | Brand tracker survey, awareness funnel |
| Are users converting on flow X? | Mixed | Funnel analysis + targeted UT |
| Do users prefer A or B at scale? | Mixed | A/B test (suggest only — out of scope to plan) |

## Discovery vs Evaluative — Pick The Right Default

Before recommending a method, classify the study:

- **Discovery research** — problem still being scoped, no design exists yet. Goal: understand current behaviour, surface unmet needs, build mental model. **Default: 1:1 interviews, contextual inquiry.** Mom Test rules apply hard.
- **Evaluative research** — design options already exist, decision is choosing between them. Goal: measure comprehension, fairness, perceived clarity per option. **Default: comprehension survey (forced-choice with correct answers), optionally with unmoderated think-aloud for diagnosis.** Mom Test rules soften — a "based on this screen, how many coins do you pay?" question is a knowledge check, not a hypothetical.

The two studies have opposite biases. Discovery defaults qual / depth / small N. Evaluative defaults quant / breadth / larger N. The skill must not auto-route evaluative work into a discovery interview just because the verb "understand" appears in the brief.

## Comprehension Testing (First-Class Method)

Distinct from generic in-app surveys. Defining feature: every key item has an objectively correct answer, scored binary.

- **Use when:** comparing finished design options on clarity / understanding / fairness; checking whether copy or pricing maths is read correctly.
- **Sample size:** 30–50 for directional read between options; 200+ for stat sig sub-group cuts (consult Data Science).
- **Instrument:** mock image + 2–4 forced-choice items per option (one correct answer each) + 1 fairness MCQ + 1 short-answer "what does this mean for what you'd pay?"
- **Pair with:** 4–6 unmoderated think-aloud sessions if you need to diagnose *why* a wrong answer happens.
- **Don't confuse with:** preference testing (which option do you like?) — preference is hospitality-bias bait. Comprehension is harder to fake.

## Axis 2 — Attitudinal vs Behavioural × Qualitative vs Quantitative

```
                     QUALITATIVE                      QUANTITATIVE
                  ──────────────────              ──────────────────
ATTITUDINAL   │   1:1 interview                  │   In-app survey, brand
              │   Focus group (rarely)           │   tracker, MaxDiff,
              │   Diary study                    │   conjoint, NPS, CSAT
              │                                   │
BEHAVIOURAL   │   Moderated usability test       │   A/B test (suggest only)
              │   Contextual inquiry             │   Funnel analytics
              │   Card sort / tree test          │   Search-log analysis
```

**Rule of thumb:**
- "Why" questions → qualitative
- "How many / how much" questions → quantitative
- "What do users think" → attitudinal (be suspicious — verify with behavioural where possible)
- "What do users do" → behavioural (preferred for predicting future behaviour)

## Axis 3 — Product Lifecycle Phase

| Phase | Goal | Recommended methods (in priority order this skill supports) |
|---|---|---|
| **Discover** | Eliminate unknowns, validate problem exists | 1:1 interviews, contextual inquiry |
| **Define** | Architect the solution, map mental models | Card sort / tree test, 1:1 interviews |
| **Develop** | Evaluate friction, validate prototypes | Moderated usability test |
| **Deliver** | Measure at scale, monitor in the wild | In-app survey (Google Forms), suggest A/B tests |

## Sample Size Defaults

| Method | Per segment | Notes |
|---|---|---|
| 1:1 interview | 5–8 | Saturation usually hits at 5–6 for a single segment |
| Moderated UT | 5–8 | Nielsen's 5-user rule; add 5 more per distinct segment |
| Card sort / tree test | 15–30 (unmoderated) | More for statistical confidence on tree paths |
| In-app survey (qualitative) | 50–100 responses | For open-ended themes |
| Quant survey | 200+ | 400+ if cutting by sub-group; consult data science for stat sig |

## What This Skill Will NOT Plan In Detail
- A/B tests (suggest as follow-up; recommend partnering with data science / analytics)
- Diary studies (suggest as follow-up; flag if scope warrants)
- Conjoint / MaxDiff (suggest as follow-up; flag market-research partner)
- Brand trackers (suggest as follow-up)

When one of these is the right method, the skill will say so plainly, recommend the partner team, and stop — not pretend to draft a plan.
