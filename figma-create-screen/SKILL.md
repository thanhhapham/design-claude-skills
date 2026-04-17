# figma-create-screen

Create app or web screens in Figma using the design system component catalog.

## When to use this skill
- "Build a chat screen", "Create a settings page", "Make a product listing screen"
- Assembling new screens from design system components
- For app→web conversion of existing screens, use `app-to-desktop-conversion` instead

---

## ⛔ Hard rules — read before anything else

- **NEVER substitute a DS component with a custom shape.** If a Carousell DS component exists for the element (button, tag, nav bar, input, etc.), it MUST be placed as a library instance — not a rectangle, ellipse, frame, or text group.
- **Custom shapes are only allowed for:** full-bleed backgrounds, video placeholders, image thumbnails, gradient scrims, and decorative dividers that have no DS equivalent. **Every custom shape with a solid fill MUST use a color token variable** — the only exception is `LinearGradient` fills (which have no token support).
- **If you are using `use_figma` (JS execution), you MUST use `importComponentByKeyAsync` to place every DS component.** Do not fall back to `figma.createRectangle()` or `figma.createFrame()` as a substitute.
- **Verify after placing:** check that each DS element has node type `"INSTANCE"` before moving on. If it is `"RECTANGLE"` or `"FRAME"`, you drew it wrong — delete and re-import.
- **Verify the component is the one you intended (stop-on-wrong-component).** After `importComponentByKeyAsync`, check `comp.name` (and/or `inst.mainComponent.name`) contains the expected name fragment. If it doesn't, the key silently resolved to a different component (e.g. `358519ac...` "Chips" silently fell through to `Tag Generic`). STOP, delete the instance, and fix the key before placing more. See the verification wrapper in Step 4.
- **Library-scope guard (app screens).** Only import keys that exist in `figma-catalog-app.json`. If a search result comes from a different library (web, marketing, ops) it will silently resolve to the wrong component on import. Treat it as "not found" — pick another catalog entry or custom-draw.
- **Catalog-first, search as last resort.** Look up every element in `figma-catalog-app.json` first (Step 0a). Only call `search_design_system` if the catalog has nothing. Search returns cross-library results that silently resolve to wrong components.

### Custom vs component — decision heuristic (for ambiguous cases)

| Element signal | Decision |
|---|---|
| Exact DS visual properties (specific corner radius, pill shape, teal price color, typographic scale) | **Component mandatory** |
| Decorative/positional only (page bg, scrim, image placeholder, gradient overlay) | Custom OK |
| Avatar (no DS avatar component exists) | Custom OK — use ellipse + `background/elevated_low` |
| Unsure | Search first. Custom only if search returns no match and no near-match in catalog |
| Ambiguous (price badge, info pill, "View similar" link) | Pick the component unless the reference shows a style not in the library. Ask if truly 50/50. |

---

## Tool capabilities (cursor-talk-to-figma MCP)

Check these before running. Some operations time out or are silently ignored in the current plugin version.

| Operation | Status | Notes |
|---|---|---|
| `create_frame` | ✅ | `layoutMode` param **silently ignored** — call `set_layout_mode` after |
| `create_text` | ✅ | `fontSize`/`fontWeight`/`fontColor` work; no `textStyleId` binding possible |
| `create_component_instance` | ✅ | Library components land at **canvas level** — `parentId` ignored |
| `move_node` | ✅ | Use absolute canvas coords to position library components |
| `resize_node` | ✅ | |
| `set_fill_color` | ✅ | `a` (alpha) param may be ignored — use solid colors |
| `set_corner_radius` | ✅ | Use `radius` param (not `cornerRadius`) |
| `scan_text_nodes` | ✅ | |
| `set_text_content` | ✅ | |
| `set_multiple_text_contents` | ✅ | |
| `set_layout_mode` | ⚠️ | May time out depending on plugin connection quality |
| `set_axis_align` | ⚠️ | Requires `set_layout_mode` to succeed first |
| `set_item_spacing` | ⚠️ | Requires `set_layout_mode` to succeed first |
| `set_padding` | ⚠️ | Requires `set_layout_mode` to succeed first |
| `set_layout_sizing` | ⚠️ | Requires `set_layout_mode` to succeed first |
| Text style token binding | ❌ | No MCP tool — component instances auto-use Fabriga; raw text nodes need manual style in Figma |
| `rename_node` / layer rename | ❌ | Not in figma-talk — skip if unavailable |
| Dark mode variable mode switching | ✅ | Via `use_figma` JS — `setExplicitVariableModeForCollection`. **REQUIRED for dark screens.** |

---

## Applying color tokens and font styles to custom elements (REQUIRED)

Custom elements (avatar, scrim, video BG, text nodes, layout frames) are the **only** places where you write raw fills and text. But they must still use Carousell tokens — never hardcoded hex or RGB values, never Inter font.

### Color tokens — bind via variable

```js
// Import a semantic color variable from the Tokens file
const tokenFileKey = 'IMyoj8vQ2otIZJxs428f9p';
const variable = await figma.variables.importVariableByKeyAsync('23789cbd842578aa5dd066e3c71653b53874ff7e'); // content/primary

// Apply to a fill
node.fills = [{
  type: 'SOLID',
  color: { r: 0, g: 0, b: 0 }, // fallback value — overridden by the variable at render time
  boundVariables: {
    color: { type: 'VARIABLE_ALIAS', id: variable.id }
  }
}];
```

**Token quick-reference — keys from `tokens-app.json`:**
| Token | Key | Use for |
|---|---|---|
| `content/primary` | `23789cbd842578aa5dd066e3c71653b53874ff7e` | Body text (dark bg → white) |
| `content/secondary` | `061c5d4328b5af9479fe5db1aed72dba91950467` | Secondary / metadata text |
| `content/subdued` | `1eb061f94b840aaf491c609c573091a8e85869f8` | Placeholder, disabled text |
| `content/on_dark` | `f038771a4a0f9f3efc1b23931a135892b20baf1e` | Always-white text on dark BG |
| `content/interactive` | `89419b73422813efa481d5c610cb505bc61798cc` | Teal — prices, links |
| `content/negative` | `c5de6a2169783cb8778f4ee723c685831aa8563b` | Sold, error, negative |
| `core/primary2` | `1b1a483339dfe19f2a2b13b558cf72a06e8dcc40` | Carousell red — LIVE, badges |
| `background/base` | `34134decd8ef8e00d105083edfa6167613a66625` | Page background |
| `background/base_low` | `f24664ff703ac3d78494eee1553b2dbecc7f59c2` | Slightly raised surface |
| `background/elevated_low` | `5273bcd44f4efc2ed42a3549617d571e3875edd6` | Cards, elevated surfaces |
| `background/on_dark` | `16ba93638d74c9e79a6e17cfb02da6ef20ec7a07` | Semi-transparent dark overlay |
| `background/priority` | `e45516e17ab13874c10d93764456368ac1e9be63` | Red fill (LIVE badge bg) |

### Font styles — bind via text style

All custom text nodes must use **Fabriga** via style binding — not Inter, not raw fontName.

```js
// Import Fabriga text style from App-font library
const style = await figma.importStyleByKeyAsync('bf1ecb92438c7e32d615106f6d8698b6ebc9b2ff'); // Small/Regular 13px
textNode.textStyleId = style.id;

// Then set color separately using a token variable (style does not set color)
const colorVar = await figma.variables.importVariableByKeyAsync('23789cbd842578aa5dd066e3c71653b53874ff7e');
textNode.fills = [{
  type: 'SOLID', color: { r: 0, g: 0, b: 0 },
  boundVariables: { color: { type: 'VARIABLE_ALIAS', id: colorVar.id } }
}];
```

**Font style quick-reference — keys from `tokens-app.json`:**
| Style | Key | Size | Use for |
|---|---|---|---|
| `Title3/Bold` | `9f4fbf6a874fb38a52cd165371c69b7e0aa65619` | 20px Bold | Section headers |
| `Large/Bold` | `795dd98d36074069166b073ed0eef21dfe23edc1` | 17px Bold | Primary emphasis |
| `Large/Regular` | `ef5e9e428533175c8ff2ba1386ed080276567e63` | 17px Reg | Body |
| `Middle/Bold` | `2de81a6d3fe9a2afe85d5119b068f79247cae4ae` | 15px Bold | Subheadings |
| `Middle/Regular` | `53654e28b5a7f101079ceb1e2b784538f70a4222` | 15px Reg | UI labels |
| `Small/Bold` | `a1a69b77d15341d21c1571ede3eb47ba405a634b` | 13px Bold | Username, price |
| `Small/Regular` | `bf1ecb92438c7e32d615106f6d8698b6ebc9b2ff` | 13px Reg | Metadata, condition |
| `Tiny/Regular` | `0ad3a2777183025b9327055eaafe4369dae17026` | 11px Reg | Chat messages, captions |

### Helper function — use this in every `use_figma` build

Add this at the top of your JS and call it for every custom text node and filled shape:

```js
// ── Token helpers ──
async function applyColorToken(node, tokenKey, fillIndex = 0) {
  const variable = await figma.variables.importVariableByKeyAsync(tokenKey);
  const fills = JSON.parse(JSON.stringify(node.fills)); // clone
  if (!fills[fillIndex]) fills[fillIndex] = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };
  fills[fillIndex] = {
    ...fills[fillIndex],
    boundVariables: { color: { type: 'VARIABLE_ALIAS', id: variable.id } }
  };
  node.fills = fills;
}

async function applyFontStyle(textNode, styleKey, colorTokenKey) {
  const style = await figma.importStyleByKeyAsync(styleKey);
  textNode.textStyleId = style.id;
  if (colorTokenKey) await applyColorToken(textNode, colorTokenKey);
}

// Usage:
await applyFontStyle(usernameText, 'a1a69b77d15341d21c1571ede3eb47ba405a634b', 'f038771a4a0f9f3efc1b23931a135892b20baf1e');
// → Small/Bold Fabriga + content/on_dark token
```

### What needs tokens vs what doesn't

| Element | Needs color token | Needs font style |
|---|---|---|
| Custom text node (any) | ✅ always | ✅ always (Fabriga) |
| Custom rect/ellipse with **SOLID fill** | ✅ always — bind a semantic token | n/a |
| Custom rect/ellipse with **LINEAR GRADIENT** | ❌ gradients cannot bind tokens — only exception | n/a |
| Avatar circle fill | ✅ use `background/elevated_low` or `background/on_dark` | n/a |
| Video/image placeholder (solid dark) | ✅ use `background/inverse` or gradient (no token needed) | n/a |
| Ticker / label background | ✅ use `background/priority`, `background/on_image`, or `background/elevated_low` | n/a |
| Divider line | ✅ use `stroke/boundary` | n/a |
| DS component instance | ❌ tokens applied automatically | ❌ Fabriga applied automatically |

---

## Placing DS components via `use_figma` (JS execution)

Use `importComponentByKeyAsync` (key from catalog) → `createInstance()` → set `x`/`y` → `frame.appendChild(inst)`. See the `importVerified()` wrapper in Step 4 — use it for every component.

---

## Catalog and token files

**App components** (375px wide phone screens):
- Catalog: `/Users/thanhhapham/Skills/figma-create-screen/figma-catalog-app.json`
- Library file key: `NmeAXg5CGWRbBtIqxVcf96`

**Design tokens** (colors + typography):
- App token reference: `/Users/thanhhapham/Skills/figma-create-screen/tokens-app.json`
- Web token reference: `/Users/thanhhapham/Skills/figma-create-screen/tokens-web.json`
- Color tokens file key (Figma): `IMyoj8vQ2otIZJxs428f9p`
- App font: **Fabriga** — component instances use it automatically; raw `create_text` nodes need Fabriga applied manually in Figma

**Key token quick-reference** (Light mode — dark mode values in tokens-app.json):
| Token | Light hex | Dark hex | Use for |
|---|---|---|---|
| `content/primary` | `#2c2c2d` | `#f8f8f9` | Body text |
| `content/secondary` | `#57585a` | `#c5c5c6` | Secondary text |
| `content/subdued` | `#c5c5c6` | `#57585a` | Placeholder, metadata |
| `content/on_dark` | `#ffffff` | `#ffffff` | Text on dark backgrounds |
| `content/interactive` | `#008f79` | `#00bfa2` | Links, prices, interactive teal |
| `core/primary2` | `#ff2636` | `#ff2636` | Carousell red (LIVE badge, negative) |
| `background/base` | `#ffffff` | `#19191a` | Page background |
| `background/on_image` | `rgba(0,0,0,0.4)` | `rgba(0,0,0,0.4)` | Dark overlay on images |
| `stroke/boundary` | `#f0f1f1` | `#414244` | Dividers, borders |

---

## Workflow

### Step 0 — Resolve components and confirm build plan (MANDATORY)

---

#### Step 0a — Catalog lookup (MANDATORY)

For every UI element in the reference, read `figma-catalog-app.json` and navigate to the matching category. Use the `componentKey` from that entry — never a key from memory or a search result.

**Navigate the catalog:** `appComponents > <CATEGORY> > <ComponentName> > subTypes > <SubType> > sizes or variants > componentKey`

Use the **Component lookup** section at the bottom of this document to find the right category path quickly.

Only call `search_design_system` if the catalog has no match at all. Search returns cross-library results that silently resolve to wrong components.

**Rule:** If the catalog returns a match and you draw a custom shape instead → hard violation. Delete and re-import the real DS component.

---

#### Step 0b — Candidate shortlist (internal reasoning, NOT user-facing)

For each distinct element, think through candidates and pick. This is YOUR reasoning scaffold — it catches Tag-vs-Chip and variant-selection mistakes before they hit the canvas.

**Keep it internal.** Do NOT dump the full list to the user. Component keys, library names, and per-element justifications are not what a designer wants to review — they want to see the visual outcome and the decisions that affect it. The user only sees the short plan in Step 0c; the shortlist stays in your working memory.

**Internal scratch format (one line per element):**
```
<element> → <pick> (not <alternative> because <one-line reason>)
```

**Example — internal only, never emitted to the user:**
```
filter chips → Chips (not Tag Generic — outlined/interactive matches reference; Tag is display-only)
listing card → Product card (not General category — reference shows no title/attributes)
top nav → Shrunk Icons, left icon swapped to back arrow (not Normal — title is a standalone heading below)
```

If you cannot justify a pick against the reference visual, you are not ready to build. Search again, check the full catalog, or surface the ambiguity as one plain-English line in the Step 0c plan.

---

#### Step 0c — Emit a short plan and wait for approval (MANDATORY for first build)

The user is a designer, not a component librarian. The plan they see should be **short, plain English, and focused on decisions they can actually judge** — visual choices, deviations from the reference, deviations from a prior screen. No component keys. No library names. No token IDs.

**Length budget: ≤ 6 bullets in the main body.** If your plan is longer than that, you are dumping your thinking instead of summarizing decisions. Cut it.

**Format:**
```
Plan: <screen name>

• <non-default decision in plain English>
• <visual deviation from reference or prior screen>
• <genuinely ambiguous choice — as a binary question, only if you truly can't pick>

Reply "go" to build, or edit any line.
```

**Good example:**
```
Plan: Modern Living Comfort — Screen 2

• Filter pills use the Chips component (Screen 1 used Tag Generic — wrong)
• Listing cards use the image-only variant (Screen 1 showed title + attributes)
• Title sits below the nav bar; nav has only back + filter icons

Reply "go" to build, or edit any line.
```

**Bad example — too long, dumps internal keys/justifications. Cut it to the ≤6-bullet plain-English format above.**

**Rules for the short plan:**
- **Skip trivial / expected choices.** Don't say "uses Top Nav for the nav" — that's assumed. Surface only what is *non-default* or *different from the reference / a prior screen*.
- **Omit component keys, library names, token IDs.** Describe the visual: "image-only cards", "outlined filter pills".
- **Max 1–2 questions per plan**, each binary or multiple-choice, answerable in one word.
- **If you can pick sensibly yourself, pick.** Don't ask about every tradeoff — only ask when the user's intent is genuinely ambiguous *and* the picks would meaningfully differ.

**Skip the plan entirely if:**
- The user has already specified exact components/variants in their request, OR
- This is a rebuild/duplicate with unchanged picks — say "building <screen> same as <prior screen>" in one line and proceed.

**What this catches:** wrong variant picks, wrong component family, over-componentization. A 5-second user skim here saves a 5-minute rebuild — but a 5-minute plan dump wastes the user's time and defeats the purpose.

---

### Step 1 — Read the catalog for each component

Open `figma-catalog-app.json` and find each component you need. Use the category map in **Component lookup** at the bottom. For multi-variant components (Top Nav, Tag, Listing card), read the `variants` object to find the right `componentKey` for the specific subtype you need.

### Step 2 — Plan the layout
Before placing anything:
1. List the DS components you'll need and check `defaultSize.h` for each
2. Read component `notes` — critical for avoiding invisible errors
3. Determine if this is a **dark screen** (dark/black background, live stream, video player, etc.)
   > **If dark screen → set `DARK_MODE = true`.** This is checked in Step 3.
4. Determine if the screen needs **layers** (see Step 2b)
5. Note the absolute canvas position where the new frame will be placed

#### REQUIRED: Define the frame hierarchy tree

Before calculating any positions, write out the frame tree. The main frame must contain **semantic sub-frames** that group related children. This is NOT optional.

**Rule: Never place more than 3 direct children on the main frame.** All UI elements must be nested inside semantic sub-frames. The only direct children of the main frame are layer frames (if using layers) or a small number of top-level section frames.

Example tree for a live stream screen:
```
Main Frame (375×812, dark fill)
├── Base Layer (375×812, transparent)
│   └── Video BG (gradient rect)
├── Content Layer (375×812, transparent)
│   ├── Header Row (HORIZONTAL auto-layout)
│   │   ├── Avatar (ellipse)
│   │   ├── Info Stack (VERTICAL auto-layout)
│   │   │   ├── Username (text)
│   │   │   └── Viewer count (text)
│   │   ├── Follow Button (DS Rounded button)
│   │   └── Close Icon (DS Icon button)
│   ├── Chat Area (VERTICAL auto-layout)
│   │   ├── Message 1 frame
│   │   ├── Message 2 frame
│   │   └── Message 3 frame
│   └── Action Bar (HORIZONTAL auto-layout)
│       ├── Chat Button (DS Normal Button — NOT Chat Input)
│       ├── Gift Icon (DS Icon button)
│       └── Like Icon (DS Icon button)
└── Overlay Layer (375×812, transparent)
    ├── LIVE Badge (DS Tag Generic High)
    ├── Scrim gradient (rect)
    └── Floating emoji reactions
```

**Write your frame tree BEFORE proceeding to Step 3.** If you cannot define at least 2 sub-frames, your layout understanding is wrong — re-analyze the reference screen.

---

### Step 2b — Define layers (for screens with overlapping content)

If the screen has video/image backgrounds, floating overlays, or overlapping elements — define a layer structure. Each layer is a transparent 375×812 frame (`fills = []`) appended to the main frame in z-order.

| Layer | Purpose | Z-order |
|-------|---------|---------|
| **Base layer** | Full-bleed backgrounds, video, hero images | Bottom |
| **Content layer** | Primary UI: headers, lists, cards, action bars | Middle |
| **Overlay layer** | Floating: LIVE badge, reactions, scrims, toasts | Top |

**When to use:**
| Screen type | Use layers? |
|---|---|
| Live stream, video player, product hero | ✅ YES |
| Standard list / settings / chat screen | ❌ NO — single content flow |

**If NOT using layers:** skip. All sub-frames go directly inside the main frame.

---

### Step 3 — Create the main frame
**App screens**: 375×812px

```js
create_frame({ x: canvasX, y: canvasY, width: 375, height: 812, name: "Screen Name" })
// → returns mainFrameId

// Light screen:
set_fill_color({ nodeId: mainFrameId, r: 1, g: 1, b: 1 })

// Dark screen (live stream, video, onboarding dark):
set_fill_color({ nodeId: mainFrameId, r: 0, g: 0, b: 0 })
```

#### Mandatory: Apply dark mode (if DARK_MODE = true)

Run this **IMMEDIATELY** after creating the frame and setting the dark fill. Do NOT defer to a later step. All DS component instances appended after this call inherit dark mode tokens automatically.

```js
// via use_figma — run right after frame creation
// First import any token to force-load the library variable collection
await figma.variables.importVariableByKeyAsync('23789cbd842578aa5dd066e3c71653b53874ff7e');
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const collection = collections.find(c => c.name.includes('Color') || c.name.includes('Semantic'));
if (collection) {
  const darkMode = collection.modes.find(m => m.name === 'Dark');
  if (darkMode) {
    frame.setExplicitVariableModeForCollection(collection, darkMode.modeId);
  }
}
```

> **Why immediately?** If you defer, DS components render with light tokens (dark text on dark bg = invisible). You will have to delete and re-place them.

#### Create layer frames (if using layers from Step 2b)

If your screen uses the layer model, create the Base / Content / Overlay layer frames now, immediately after the main frame + dark mode. All subsequent component placement in Step 4 targets a layer frame or its sub-frames, never the main frame directly.

---

### Step 3b — Auto-layout for sub-frames

Plain frames nested via `parentId` support auto-layout. Library components do not (`parentId` is ignored — position them with absolute canvas coords instead).

**Apply in order:** `create_frame` → `set_layout_mode` → `set_axis_align` → `set_item_spacing` → `set_padding` → `set_layout_sizing`

> ⚠️ If `set_layout_mode` times out, position children absolutely and note which groups need Shift+A in Figma.

**When to use:** horizontal rows (avatar + name + button), vertical stacks (list items, chat), card content areas. **Not for:** the main 375×812 frame, overlay elements, backgrounds.

**Quick-reference:**
- Horizontal row: `layoutMode=HORIZONTAL`, `counterAxisAlignItems=CENTER`, padding 16px H
- Vertical stack: `layoutMode=VERTICAL`, `itemSpacing=4–8`, `layoutSizingVertical=HUG`
- Space-between: `primaryAxisAlignItems=SPACE_BETWEEN`
- Child sizing: `layoutSizingHorizontal=FILL|HUG|FIXED`, `layoutSizingVertical=FIXED|HUG`

**Standard spacing (4px grid):** Dense rows: 4px gap, 12–16px H padding. Section gaps: 16–24px.

---

### Step 4 — Place components

#### Gate check — STOP if sub-frames missing
Before placing ANY component, verify you created the sub-frames from your Step 2 frame tree. If you're about to `appendChild` directly to the main frame and it's NOT a layer frame → **STOP**. Create the semantic sub-frame first (Header Row, Chat Area, Action Bar, etc.).

#### Component selection — state its FUNCTION first
Before importing any component, write one sentence: **"The user [does X] with this element."** Then pick the component that matches the function, NOT the label text. Use the decision tree below.

**Function-first decision tree:**
| User action | ✅ Use this component | ❌ NOT this |
|---|---|---|
| Taps to trigger an action (send, buy, follow, chat) | Normal Button / Rounded Button / Icon Button | NOT Chat Input |
| Types text into a field (compose message, search) | Chat Input / Input component | NOT Button |
| Navigates between app-level tabs (Home, Sell, Inbox) | Bottom bar **Tab** variant | NOT Bottom bar Button |
| Triggers contextual actions on live/video screen (share, gift, like) | Icon Buttons in row or Bottom bar **Button** variant | NOT Bottom bar Tab |
| Views a status/category label (LIVE, Free Shipping) | Tag Generic (Medium or High) | NOT Rounded Button |
| Dismisses / closes a view | Icon Button (X icon) | NOT Tag, NOT text |

**Anti-patterns — common mistakes to avoid:**
| ❌ Wrong choice | Why it's wrong | ✅ Correct choice |
|---|---|---|
| Chat Input for a button labeled "Chat" | Chat Input is a text-entry field (375×104 with suggestion chips) | Normal Button with label "Chat" |
| Bottom bar Tab on a live stream | Tabs are for app-level navigation, not contextual actions | Bottom bar Button or Icon buttons in a row |
| Tag for a tappable action (Follow, Buy) | Tags are display-only labels, not interactive | Rounded Button or Normal Button |
| Rounded Button for a status label (LIVE) | Buttons imply tappability; status labels are passive | Tag Generic High |

**Bottom bar subtype selection** (look up key in catalog `NAVIGATION > Bottom bar`):
| Subtype | When to use |
|---|---|
| **Tab** | App-level navigation (Home, Sell, Inbox, Me) — persistent |
| **Button** | Contextual icon actions on live/video screens (share, gift, like) |
| **Task** (single) | Single primary CTA (Buy Now, Add to Cart) |
| **Task** (two buttons) | Two CTAs (Make Offer + Buy Now) |
| **Promote** | Boost/promote CTA |

---

Library components via figma-talk always land at **canvas level** (`parentId` is ignored by the plugin). This is expected — use absolute canvas coordinates and then parent them manually.

**Standard placement pattern:**
```
canvasX = mainFrameX + relativeX
canvasY = mainFrameY + relativeY
```

**figma-talk:**
```js
const inst = create_component_instance({ componentKey: defaultKey, x: canvasX, y: canvasY })
move_node({ nodeId: inst.id, x: correctCanvasX, y: correctCanvasY })  // fine-tune if needed
resize_node({ nodeId: inst.id, width: 343, height: 48 })              // full-width CTA
```

**use_figma (JS) — wrap every import with verification:**
```js
// ── Verified-import helper. Use this for EVERY DS component. ──
async function importVerified(key, expectedNameFragment) {
  const comp = await figma.importComponentByKeyAsync(key);
  const name = (comp.name || '') + ' ' + (comp.parent?.name || '');
  if (!name.toLowerCase().includes(expectedNameFragment.toLowerCase())) {
    throw new Error(
      `Wrong component: key ${key} resolved to "${name.trim()}", ` +
      `expected "${expectedNameFragment}". Likely cross-library key — ` +
      `look up the correct key in figma-catalog-app.json.`
    );
  }
  return comp;
}

// Place-one-then-verify pattern:
const comp = await importVerified('b10dc6ca81da9b8276350334f72ffac669764d60', 'Filter Chip');
const inst = comp.createInstance();
inst.x = canvasX; inst.y = canvasY;
frame.appendChild(inst);
inst.resize(86, 32);

if (inst.type !== 'INSTANCE') throw new Error('Not a DS instance — delete and re-import');
```

**Rule: place ONE instance of each new element type first, verify, then batch-place the rest.** If `importVerified` throws, STOP — don't continue placing other components until the key is fixed. This is what prevents a 5-minute wrong-component rebuild.

**Key placement rules:**
- Track `currentY` and advance by actual `instance.height` (not catalog `defaultSize.h`)
- Full-width components: `relativeX = 0`, resize width to 375
- Full-width CTA buttons: resize width to 343 (16px margin each side)
- Bottom bar: `relativeY = 812 - bottomBar.height`
- **Immediately after placing**, go to Step 5 (text override) and Step 5b (rename)
- **After every component placed**, confirm `inst.type === 'INSTANCE'` before continuing

Use **Tag Generic** (not Program Specific) whenever you need to override tag text — Program Specific returns 0 text nodes.

---

### Step 5 — Override component text labels (REQUIRED)

After placing any component instance, **always override its text labels**. Never leave default placeholder text like "Label", "Button", "Tag name".

```js
// 1. Get text node IDs
const nodes = scan_text_nodes({ nodeId: instanceId })
// → [{ id: "I626:xxx;17674:24951", text: "Label", name: "Label" }]

// 2. Override
set_text_content({ nodeId: "I626:xxx;17674:24951", text: "Follow" })

// Or batch for multiple text nodes:
set_multiple_text_contents({
  nodeId: instanceId,
  text: [
    { nodeId: "title_id", text: "Air Jordan 1" },
    { nodeId: "price_id", text: "S$189" },
    { nodeId: "condition_id", text: "Like New" }
  ]
})
```

**Common overrides:**
| Component | Text node name | Override to |
|---|---|---|
| Normal Button | `label` | "Buy Now", "Submit", "Awaiting Next Item" |
| Rounded button | `Label` | "Follow", "Join", "Buy" |
| Text Button | `Label` | "View all", "See more" |
| Top Nav | Title text | Screen name |
| Tag Generic | `text` | "Free Shipping", "LIVE", "Brand New" |
| Snack Bar | Message | Notification content |

---

### Step 5b — Rename layer names (REQUIRED)

After overriding text, rename the Figma layer to a semantic name so the layers panel is readable.

```js
// If the plugin supports rename (e.g. rename_node or set_name):
rename_node({ nodeId: instanceId, name: "Follow Button" })
rename_node({ nodeId: instanceId, name: "Awaiting Next Item CTA" })
rename_node({ nodeId: instanceId, name: "Chat Input — Default" })
rename_node({ nodeId: instanceId, name: "Free Shipping Tag" })
rename_node({ nodeId: instanceId, name: "LIVE Badge" })
```

Naming convention: `"{Semantic role} — {variant/state}"` e.g.:
- `"Back Button"`, `"Follow Button"`, `"Top Nav — Live Stream"`
- `"Streamer row"`, `"Product card row"`, `"Chat stack"`
- `"Product thumbnail"`, `"Avatar — jirehsales"`

> If `rename_node` is not available in the current plugin, skip and note to the user.

---

### Step 5c — Hex audit (REQUIRED — zero tolerance)

After all components are placed and all custom elements styled, run this audit to catch any solid fill that lacks a bound token variable. **Zero-tolerance rule: if any solid fill lacks a bound variable, it is a build error.**

```js
// via use_figma — run after all elements are placed
const frame = figma.currentPage.findOne(n => n.name === "YOUR_FRAME_NAME");
const violations = [];

function auditNode(node) {
  if (node.type === 'INSTANCE') return; // DS instances have tokens already
  if (node.fills && Array.isArray(node.fills)) {
    node.fills.forEach((fill, i) => {
      if (fill.type === 'SOLID' && (!fill.boundVariables || !fill.boundVariables.color)) {
        violations.push({
          name: node.name,
          id: node.id,
          fillIndex: i,
          color: fill.color
        });
      }
    });
  }
  if ('children' in node) node.children.forEach(auditNode);
}

auditNode(frame);
console.log(`Hex audit: ${violations.length} violations`);
violations.forEach(v => console.log(`  ⛔ ${v.name} (${v.id}) — solid fill without token`));
```

**If violations found, fix them using these common mappings:**
| Element | Token to bind |
|---|---|
| Avatar circle fill | `background/elevated_low` (`5273bcd4...`) |
| Video/image dark bg | `background/inverse` or use gradient (no token needed) |
| Ticker / badge bg | `background/priority` (`e45516e1...`) or `background/on_image` |
| Code snippet / quote bg | `background/elevated_low` (`5273bcd4...`) |
| Divider / separator | `stroke/boundary` |
| Text on dark | `content/on_dark` (`f038771a...`) |
| Price text | `content/interactive` (`89419b73...`) |

**Re-run the audit after fixing until violations = 0.**

---

### Step 6 — Dark mode (cross-reference)

Dark mode is applied in **Step 3** immediately after frame creation. If you skipped it, go back to Step 3 and apply `setExplicitVariableModeForCollection` now.

**If dark mode switching is unavailable** (plugin doesn't support `use_figma`):
- Use `content/on_dark` (#ffffff) for all text on dark backgrounds
- Use semi-transparent fills manually for overlays

---

### Step 7 — Key import fallback

If `create_component_instance` fails or returns wrong component:
1. Check full catalog for alternate variant keys under `states` or `sizes`
2. Try the Large/Small size key instead of default Medium

---

## Platform-specific rules

### App screens (375px)
- Frame: 375×812px
- Status bar: do NOT add a separate status bar if using Top Nav (it includes one)
- Top Nav iOS Normal title: h=132px (status bar built in), place at `relativeY=0`
- Top Nav iOS Shrunk title: h=92px
- Bottom bar: `relativeY = 812 - bottomBar.height`

### Ordering components top-to-bottom
```
relativeY=0:   Top Nav (132px iOS)  →  currentY = 132
relativeY=132: Content area
...
relativeY=718: Bottom bar (94px)    →  frame ends at 812
```

---

## Component lookup

**Single source of truth:** `figma-catalog-app.json` — generated from App Components library (`NmeAXg5CGWRbBtIqxVcf96`). Every key in this file is correct. Never use a key from memory.

Navigate with: `appComponents > <CATEGORY> > <ComponentName> > subTypes > <SubType> > sizes or variants > componentKey`

### Category map

| Reference element | Catalog path |
|---|---|
| Filter pill (outlined, tappable) | `FILTER_CHIP > Filter Chip (custom) - app` |
| Selectable chip (form / input) | `INPUT > Chip` |
| Display label (LIVE, Free Shipping, Sold) | `DONUT_DETAIL > Tag > Tag Generic > variants > Emphasis=Low/Medium/High` |
| Listing / product card | `LISTING_PRODUCT_CARDS > Listing card > subTypes > General category / Verticals` |
| Top navigation bar | `NAVIGATION > Top nav > subTypes > Title&Action > variants` |
| Bottom nav tabs | `NAVIGATION > Bottom bar > subTypes > Tab` |
| Bottom single CTA | `NAVIGATION > Bottom bar > subTypes > Task` |
| Primary CTA button | `BUTTONS > Normal Button` |
| Icon action button | `BUTTONS > Icon button` |
| Pill CTA (Follow, Join) | `BUTTONS > Rounded button` |
| Inline link | `BUTTONS > Text Button` |
| Chat text-entry field | `SNAPSELL > Chat input` — text entry only, NOT a button |
| Avatar | No catalog entry — custom ellipse |
| Image / video placeholder | No catalog entry — custom rectangle |

### Listing card decision

Does the reference show title + price + attributes below the image?
- **Yes** → `General category` variant. Do NOT resize to hide text — pick the right variant.
- **No** (image-only) → no catalog variant; **custom-draw** the image frame.

### Top Nav — pick variant from the catalog

Open `figma-catalog-app.json` at `NAVIGATION > Top nav > subTypes > Title&Action > variants`. Pick by: `Platform` (iOS/Android) × `Title type` (Normal/Shrunk) × `Action types` (Icons/TextButton/None) × `Scrolled` (Yes/No).

**Left-icon swap:** after placing, the default may show X instead of a back arrow. The left icon is a swappable component property — use `inst.setProperties({…})` or swap the nested instance. Don't pick a different variant just to change the left icon.

---

## Post-build checklist for user

Always output this at the end of every screen build:

```
✅ Screen built. Automated checks passed:

[x] Dark mode applied in Step 3 (if dark screen) — components render correct tokens
[x] Hex audit passed — all solid fills are token-bound (Step 5c)
[x] All DS elements verified as INSTANCE type
[x] Component selection validated by function (Step 4 decision tree)

Manual steps needed in Figma:

□ Auto-layout — select each group below and press Shift+A:
  · [List specific groups, e.g. "Streamer row (avatar + name + follow)"]
  · [e.g. "Product card row (thumbnail + info stack)"]
  · [e.g. "Chat message stack"]

□ Layer nesting — if any components landed at canvas level,
  Cmd+X → click inside frame → Cmd+Shift+V to paste in place

□ Text styles — select raw text nodes and apply Fabriga style:
  · [List which text nodes, e.g. "Streamer name → Small/Bold"]
  · [e.g. "Chat messages → Tiny/Regular"]
```

---

## Catalog refresh

When the design system has been updated, regenerate `figma-catalog-app.json` by re-extracting the App Components library from Figma via `use_figma`.
