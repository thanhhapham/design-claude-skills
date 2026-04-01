# UX Design Principles — Knowledge Architecture

*Source: Comprehensive Knowledge Architecture for Automated AI UX Design Review*

---

## Norman's Design Framework (*The Design of Everyday Things*)

### Core concepts

**Affordances** — the complete set of possible actions a person can perform with a product or interface. Affordances alone are insufficient if invisible or incomprehensible to the user.

**Signifiers** — explicit communication mechanisms that make affordances visible and understandable. A button that looks tappable is a signifier. Evaluate whether signifiers accurately, prominently, and unambiguously communicate the underlying affordances.

**Mappings** — the relationship between a control and its result. The best mappings rely on physical analogies, cultural standards, or natural spatial arrangements, allowing users to predict outcomes without conscious effort. Poor mappings require explicit design cues.

**Knowledge in the world vs. knowledge in the head**
- Knowledge in the world = perceivable signifiers (labels, icons, visible affordances)
- Knowledge in the head = cultural, semantic, and logical constraints users bring from past experience

**Constraints** — physical, logical, semantic, or cultural limitations that restrict possible actions. Act as a primary defence against error by making incorrect actions impossible or highly difficult.

**Feedback** — communicates the result of an action, closing the interaction loop. When a system delays or omits feedback, users misinterpret system state, believe their input was ignored, and repeat actions out of frustration.

### Execution and evaluation cycle
1. User forms a goal
2. Translates goal into intention
3. Sequences commands to act
4. Executes action
5. Evaluates feedback to determine if goal was met

An interface fails when it breaks this loop — either by obscuring the means of execution or by failing to provide evaluative feedback. Error design requires: anticipating failures, minimising causes of errors, implementing sensibility checks, and providing robust undo/recovery mechanisms.

---

## Mental Models and Information Architecture

**Mental model** — what a user believes to be true about a system, not the technical reality. Constructed from prior experiences. Highly individual but converge around industry conventions.

**Jakob's Law** — users spend most of their time on interfaces other than the one being evaluated. They transfer expectations from familiar environments to new ones, demanding that novel systems behave in accordance with their pre-existing mental models. Deviations dramatically increase cognitive load and learning friction.

When a mismatch occurs between the user's mental model and the designer's conceptual model, usability failures follow (classic example: a door with a pull handle that requires a push).

### IA strategies for fixing mental model mismatches

| Strategy | Mechanism | Outcome |
|----------|-----------|---------|
| **Merge Sections** | Combine two frequently confused categories into one | Prevents selection errors; may increase scanning time on overview page |
| **Rename Existing Sections** | Replace internal jargon with terminology with strong "information scent" | Clarifies distinction using familiar words |
| **Explain Choices** | Provide descriptive text or visual examples next to navigation labels | Assists differentiation when single-word labels are insufficient; used on homepages |
| **Restructure the Site** | Completely reorganise taxonomy to match user workflows | Addresses widespread navigation errors by aligning the whole system to the dominant user mental model |
| **Move Information** | Relocate data to where users consistently (but erroneously) search for it | Prioritises user intuition over strict logical hierarchy |
| **Add Cross-Reference Links** | Insert links in incorrect sections to redirect users | Safety net for users navigating from flawed mental models |

### Skeuomorphism
The practice of incorporating physical-world analogies into digital interfaces (digital bookshelves, realistic folder icons). Bridges the gap between novice understanding and abstract digital actions. Modern flat design has stripped hyper-realistic textures, but the underlying metaphorical logic remains essential for establishing comprehensible mental models.

---

## Maeda's Laws of Simplicity

Ten laws + three keys for managing complexity in digital systems.

### The 10 Laws

| Law | Statement |
|-----|-----------|
| **1. Reduce** | The simplest way to achieve simplicity is through thoughtful reduction. Strip until further removal causes system breakdown. |
| **2. Organize** | Structuring disparate elements makes a system appear to consist of fewer, more manageable components. |
| **3. Time** | Saving user time creates a perception of simplicity. Delays are perceived as complex friction. |
| **4. Learn** | Knowledge makes everything simpler. Leverage existing user knowledge to avoid teaching new behaviours. |
| **5. Differences** | Simplicity and complexity require each other for contrast. Preserve white space to enhance attention on what remains. |
| **6. Context** | What lies in the periphery is never truly peripheral. Background elements and negative space actively direct primary attention. |
| **7. Emotion** | More emotion is superior to less. |
| **8. Trust** | Trust is the ultimate currency of simplicity. |
| **9. Failure** | Some complex operations, close relationships, and artistic expressions cannot be simplified. Attempting to do so results in failure. |
| **10. The One** | Simplicity is solely about subtracting the obvious and adding the meaningful. |

### The 3 Keys

| Key | Meaning |
|-----|---------|
| **Away** | Move complexity far away (e.g., into settings, behind progressive disclosure) to make more appear like less |
| **Open** | Openness and community collaboration simplify complexity |
| **Power** | Use fewer resources to gain greater leverage |

---

## Fitts's Law

**Formula:** `ID = log₂(2A/W)` where A = distance to target, W = width of target along axis of motion.

Movement time: `T = a + b × ID`

**Core rule:** Time to acquire a target increases with distance and decreases with target size. Primary CTAs must be large and positioned close to the user's anticipated starting point.

Fast, ballistic movements toward small targets produce high error rates (speed-accuracy trade-off). The pointer must slow in the final phase to avoid overshooting — which is why large primary action buttons exist on mobile.

### Magic edges and corners (desktop only)
The cursor cannot move past the screen boundary, giving screen edges effectively infinite width (W = ∞). A target placed flush against the screen edge has the lowest possible acquisition time. Critical menus and primary actions should leverage these infinite boundaries.

On touch devices: edges offer no tactile boundary. Target size and zero-point (pixel directly under finger) are the primary friction-reduction mechanisms.

### Touch target minimums

| Platform | Recommended | Absolute Minimum |
|----------|-------------|-----------------|
| Apple iOS / iPadOS | 44×44 pt | 28×28 pt |
| Apple macOS | 28×28 pt | 20×20 pt |
| Apple visionOS | 60×60 pt | 28×28 pt |
| Apple watchOS | 44×44 pt | 28×28 pt |
| Apple tvOS | 66×66 pt | 56×56 pt |
| Google Android (M3) | 48×48 dp (~9mm) | 48×48 dp |
| Pointer/Mouse | 44×44 dp | — |

Android M3 also requires: adjacent touch targets must be separated by a minimum of **8dp** to prevent accidental misclicks. The visual bounds of an icon (e.g. 24×24dp glyph) do not dictate the touch target — transparent padding must extend the actionable area to 48×48dp minimum.

---

## Hick's Law

**Formula:** `T = b × log₂(n + 1)` where T = reaction time, n = number of equally probable choices, b = processing difficulty constant.

When options have unequal probabilities: `T = b × H` where H = Shannon entropy of the choice set.

Decision time grows logarithmically with number and complexity of choices. Dense menus and complex onboarding paralyse decision-making and suppress conversion.

### Mitigation strategies
- **Progressive disclosure** — reveal features only when contextually relevant (Slack onboarding: hides all features except core messaging until user is ready)
- **Recommended/default options** — reduce choice equality, streamlining the decision matrix
- **Chunking** — break complex tasks into smaller, sequential steps

---

## Behavioural UX Laws

### Memory and perception

**Peak-End Rule** — users judge an experience based on how they felt at its peak (most intense point) and at its end, not an average of every moment. Design critical workflows to culminate in positive, reassuring feedback (rewarding success screen after a complex process).

**Serial Position Effect** — users recall the first (primacy) and last (recency) items in a sequence most reliably. Position the most critical navigation options and onboarding choices at the beginning and end of lists.

**Von Restorff Effect (Isolation Effect)** — when presented with multiple similar elements, the one that differs is most likely to be remembered. Primary CTAs must be visually distinctive from surrounding elements. Avoid situations where too many salient items compete — they cancel each other out.

**Zeigarnik Effect** — people remember uncompleted or interrupted tasks better than completed ones because the brain seeks closure. Use progress trackers, visual checklists, and notification badges to nudge users to finish incomplete tasks.

**Chunking** — break large sets of information into smaller, digestible groups that function as a meaningful whole. Addresses the limits of human working memory (Miller's Law: ~7 items).

### Motivation and decision-making

**Goal-Gradient Effect** — motivation to reach a goal increases as users get closer to it. Visualise progress (dynamic completion bar, stepped checkout showing "almost done") to encourage task completion.

**Parkinson's Law** — any task will inflate to fill all available time. UI workflows should establish clear boundaries and time estimates to give users a sense of urgency and control. If a form appears to have 20 fields, users assume it will take 20 minutes.

### System performance and complexity

**Doherty Threshold** — interactions under 400ms feel instant; anything slower needs perceived performance enhancement (skeleton screens, immediate visual feedback, animations to mask latency).

**Tesler's Law (Conservation of Complexity)** — every system has a baseline complexity that cannot be removed. Over-simplifying an interface shifts the cognitive burden from the system back onto the user. Flag over-abstracted interfaces.

**Postel's Law (Robustness Principle)** — "Be conservative in what you do, be liberal in what you accept." Forms should flexibly accept varied input formats (phone numbers with/without dashes, email with varied capitalisation) and handle formatting silently rather than generating rigid error messages.

---

## Gestalt Principles

**Proximity** — objects near each other are perceived as related groups.

**Similarity** — items sharing visual characteristics (colour, shape, size) are perceived as having related functions.

**Common Region and Uniform Connectedness** — elements strongly perceived as grouped if they share a clearly defined boundary (card border) OR are visually connected by lines.

**Closure** — users complete familiar patterns even when elements are partially hidden.

**Continuity** — eyes follow paths, lines, and curves. Alignment guides the eye.

---

## Nielsen's 10 Usability Heuristics

### 1. Visibility of system status
Continuously inform users of system state via timely feedback. Progress indicators for actions taking longer than 10 seconds. Avoid infinite-loop animations that convey no real data. In e-commerce: showing low inventory levels communicates status while leveraging scarcity.

### 2. Match between system and real world
Use the user's familiar language and metaphors, not internal jargon or database terminology. Information must follow logical, real-world order. Skeuomorphic analogies (digital stovetop controls matching physical burner layout) reduce cognitive load.

### 3. User control and freedom
Provide clearly marked emergency exits. Ubiquitous back buttons, cancel links, undo/redo. Multi-step forms must allow backward navigation without losing previously entered data or triggering timeout errors.

### 4. Consistency and standards
Maintain internal consistency (uniformity within a product suite) AND external consistency (alignment with industry standards). Users must never wonder if different words, icons, or actions imply the same meaning. A magnifying glass must universally mean search. Primary CTAs must maintain consistent spatial placement across all screens.

### 5. Error prevention
Eliminate error-prone conditions before they occur. Differentiate between:
- **Slips** — unconscious errors made on autopilot (prevent with forgiving formatting, e.g. auto-formatting phone numbers)
- **Mistakes** — conscious errors from mental model mismatches (prevent with constraints, e.g. blocking return date earlier than departure date)

Use intelligent defaults and rigid constraints where possible.

### 6. Recognition rather than recall
Minimise memory load by making elements, actions, and options continuously visible or easily retrievable. Avoid requiring users to recall information across screens. Use predictive search suggestions, contextual controls that appear only when relevant.

### 7. Flexibility and efficiency of use
Support both novice and expert users. Novices need guided wizards and explicit menus. Experts need accelerators — hidden shortcuts, keyboard commands, macros, custom gesture mappings — that speed up repetitive interactions without cluttering the interface for beginners.

### 8. Aesthetic and minimalist design
Every extraneous unit of information competes for user attention and cognitive processing. Visual minimalism is not required, but purposeful utility is mandatory. Decorative elements not supporting the user's immediate goal must be stripped away. Use progressive disclosure to hide advanced settings.

### 9. Help users recognise, diagnose, and recover from errors
Error messages must be:
- Plain, human-readable language (no error codes or developer jargon)
- Visually highlighted with high contrast and proximity to the error source
- Explaining the precise nature of the failure with a positive tone
- Offering a constructive, immediate solution or alternative path
- Preserving the user's input so they do not have to start over

### 10. Help and documentation
Proactive help: contextual, pull-triggered (hover tooltips) — not disruptive push (mandatory unskippable overlays). Reactive documentation: highly searchable, scannable, concisely written, categorised by user level, focused on concrete actionable steps.

---

## Cognitive Walkthrough Methodology

Evaluates the precise learnability of a system from the perspective of a brand-new user encountering the workflow for the first time. Highly structured, task-based. Best used during early prototype phases to catch architectural flaws before engineering begins.

Anchored by specific user personas — evaluate through the lens of target users, not technical expertise.

### The 4 criteria (apply to every step in a flow)

| Criteria | Evaluative Focus | Failure Mode |
|----------|-----------------|--------------|
| **1. Will users try to achieve the right result?** | Goal alignment | User's mental model doesn't match system requirements; user doesn't realise the step is necessary to proceed |
| **2. Will users notice that the correct action is available?** | Visibility (Fitts's Law) | Interactive element lacks visual salience, contrast, or proximity; doesn't appear clickable or tappable |
| **3. Will users associate the correct action with the result?** | Signifiers (Hick's Law) | Labels confusing, jargon-laden, or presented among too many similar choices — causes decision paralysis |
| **4. Will users see that progress is made toward the goal?** | System feedback | System fails to provide immediate, perceptible visual or textual confirmation the action was successful |

If an interface fails on **any single criterion** at any step, the entire step is recorded as a failure. This strict boolean logic indicates a severe bottleneck in learnability requiring structural redesign, not aesthetic tweaking.

---

## Platform Standards: iOS (Apple HIG)

Apple's HIG covers iOS, iPadOS, macOS, tvOS, and visionOS. Built on four foundational principles:

**Clarity** — interfaces must remain uncluttered and precise. Text legible at all sizes. Icons instantly recognisable. Aesthetic adornments must not overshadow content.

**Deference** — the UI should recede to elevate primary content. UI elements must never compete with or distract from the media, text, or information the user is consuming.

**Depth** — iOS uses z-axis spatial organisation (visual layers, drop shadows, motion) to establish clear structural hierarchy. Helps users understand relationships between overlapping contexts.

**Translucency and Material** — modern iOS uses translucent, rounded elements mimicking glass, with dynamic refraction and background blurring. These materials must react fluidly to motion, scrolling content, and user inputs.

**App Store review categories:** Safety, Performance, Business, Design, Legal. Apps must not drain battery life or risk hardware damage. iPhone apps are mandated to run on iPad hardware.

---

## Platform Standards: Android (Google Material Design 3)

Open-source design system focused on adaptability, personal expression, and token-based theming.

**Expressive Design** — a paradigm shift from rigid, data-driven aesthetics toward emotion-driven, personalised experiences. Dynamic colour theming extracts a dominant colour from the user's wallpaper and algorithmically generates a complete accessible tonal palette propagated via design tokens.

**Layout anatomy** — three primary structural regions: App Bars, Navigation, and Body. Must use canonical layouts scaling fluidly across foldables, tablets, and compact mobile screens.

**Primary action:** Floating Action Button (FAB) in bottom right. Navigation: drawers and bottom application bars.

---

## Comparative Navigation: iOS vs Android

Cross-platform apps that ignore OS-specific navigation conventions cause immense usability friction. A critical failure is porting an Android hamburger menu to iOS, or inserting an iOS back-navigation chevron into an Android app.

| Element | iOS (HIG) | Android (Material Design 3) |
|---------|-----------|----------------------------|
| Primary navigation | Bottom tab bar (strictly at the bottom) | Tabs at top OR bottom navigation |
| Secondary navigation | "More" tab in bottom nav or on-page UI | Hamburger menu (side drawer) or bottom nav |
| Primary CTA | Top navigation bar, typically right side | FAB in bottom right |
| Back navigation | Back button top left OR left-to-right edge swipe | Dedicated back button + system-level back hardware/gesture |
| Typography | Strict standardised system fonts (San Francisco) | Flexible, wider font choices; bold fonts actively encouraged |
| Iconography | Simple, flat, wireframe-style, minimal strokes | Varied shapes, expressive colours, filled stylistic variations |

---

## Accessibility Standards

### Dynamic text scaling
Both systems require seamless handling of dynamic text resizing. Apple mandates layout must remain unbroken and text legible at:
- Up to **200%** font scale on iOS/iPadOS
- Up to **140%** on watchOS

Simulate these scaled states in reviews to identify: text truncation, overlapping UI elements, unresponsive bounding boxes.

### Colour and contrast
- Information must never be conveyed by colour alone (accounts for colour blindness)
- Use SAPC-APCA (S-LUV Advanced Perceptual Contrast Algorithm) for perceptual contrast evaluation
- Dark mode must dynamically invert contrast ratios without violating WCAG minimums or muddying visual hierarchy
- Verify compliance against: "Increase Contrast", "Differentiate Without Color", Red/Green and Blue/Yellow colour filters

WCAG minimums: 4.5:1 for body text, 3:1 for large text and UI components.

### Semantic structure and assistive technologies
For users relying on screen readers (VoiceOver on iOS, TalkBack on Android), the visual layout is entirely superseded by the linear, hierarchical structure of the underlying code.

Heading levels (H1–H6):
- Must never skip a level to achieve a visual style
- Must sequentialise content based on true information hierarchy

Web landmarks and structural roles (navigation, main, footer) must be clearly delineated to allow screen-reader users to jump between content blocks.

**Focus order** — for keyboard traversal or switch controls, tab order must:
- Follow the natural reading direction
- Prioritise primary use cases over secondary navigation

**Custom gestures** — if an interface relies on complex multi-finger swipes or prolonged holds, alternative single-tap equivalents must be provided for users with limited motor control or using Voice Control.
