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
- **Do NOT default to the cheat sheet.** The `Common component cheat sheet` is a starting point, not an answer. For every element, run `search_design_system` (Step 0a), write a candidate shortlist (Step 0b), and pick by visual match against the reference. Past failures caused by skipping this: `Tag Generic` used where `Chips` was needed; default `Top Nav` variant (X + ⋯) used where back arrow + filter was needed.

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

When `use_figma` is your active tool (instead of figma-talk), **always import library components with `importComponentByKeyAsync`**. This is the only correct way to place a real DS instance — not `createRectangle`, not `createFrame`.

```js
// Standard pattern — use this for EVERY DS component
const comp = await figma.importComponentByKeyAsync('da7d8e4307f4be9b7358340e98f04fc584fbd6b9');
const inst = comp.createInstance();
inst.x = canvasX;   // absolute canvas X = frameX + relativeX
inst.y = canvasY;   // absolute canvas Y = frameY + relativeY
frame.appendChild(inst);

// Resize if needed (e.g. full-width button)
inst.resize(343, 48);

// Verify it's a real instance before moving on
console.log(inst.type); // must be "INSTANCE"
```

**After appending to frame, override text labels:**
```js
// Scan and override — never leave default placeholder text
const textNodes = inst.findAll(n => n.type === 'TEXT');
// or use scan_text_nodes if on figma-talk
```

**Do NOT do this:**
```js
// ❌ Wrong — this is a custom shape, not a DS component
const btn = figma.createRectangle();
btn.resize(343, 48);
btn.cornerRadius = 8;
```

---

## Catalog and token files

**App components** (375px wide phone screens):
- Index: `/Users/thanhhapham/Skills/figma-create-screen/figma-catalog-app-index.json`
- Full catalog: `/Users/thanhhapham/Skills/figma-create-screen/figma-catalog-app.json`
- Component notes: `/Users/thanhhapham/Skills/figma-create-screen/component-notes.json`
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

### Step 0 — Search DS, build candidate shortlist, confirm build plan (MANDATORY)

This step exists to prevent these historical failures:
- Used `Tag Generic` for filter chips when `Chips` existed in the same search
- Used the default Top Nav variant (X + ⋯) when the reference showed back arrow + filter icon
- Used the full Listing Card (with title/attributes) when the reference showed an image-only variant

Root cause in all three: jumping from the reference to the cheat sheet without comparing candidates. Fix: force the comparison, then get the user's sign-off before building.

---

#### Step 0a — Search (MANDATORY)

For every distinct UI element in the reference, run `search_design_system` with a **descriptive** query. Capture **all** results — the right match is sometimes #2 or #3, not the first hit.

**Example queries to run:**
```
search_design_system("chip filter pill outlined")      // distinguishes Chips vs Tag
search_design_system("top nav back arrow filter icon") // picks the right variant
search_design_system("listing card product image")     // returns multiple card variants
search_design_system("button primary CTA")
search_design_system("bottom nav bar tab")
```

**Rule:** If `search_design_system` returns a match and you draw a custom shape instead → hard violation. Delete and re-import the real DS component.

---

#### Step 0b — Candidate shortlist (MANDATORY, output explicitly)

For each distinct element in the reference, write this block in your response so the user can audit your picks before you build. Do NOT skip — this is the step that catches Tag-vs-Chip and variant-selection mistakes.

```
Element: <visual description + user function>
Candidates:
  - <Name> (<key>) — <library>
  - <Name> (<key>) — <library>
Pick: <key> — <why this matches the reference over the alternatives>
```

**Worked example:**
```
Element: "outlined pill with label text, tappable, filter context (ikea, sofa bed)"
Candidates:
  - Chips (358519ac1939157f909e8047f47f7ac9f225d79e) — Components
  - Tag Generic Medium (b242b07ecae797b412d3c8aaa9643b9f8c341520) — App Components (cheat sheet default)
Pick: Chips — outlined/tappable style matches reference; Tag Generic is filled/display-only
```

**If you cannot justify the pick against the reference visual, you are not ready to build.** Search again, check the full catalog, or ask the user.

---

#### Step 0c — Emit build plan and wait for approval (MANDATORY for first build)

Before writing a single line of build code, output a plan in this format and STOP:

```
## Build plan: <screen name>

**DS components:**
- <Role>: <Component name> (<key>) — <size/variant note>
- <Role>: <Component name> (<key>) ×<count>
- ...

**Custom elements (no DS match):**
- <element> — <why custom per the heuristic above>
- ...

**Open questions / assumptions:**
- <anything unclear>

Reply "go" to build, or correct any picks.
```

**Skip this step only if:**
- The user has already specified exact components/variants in their request, OR
- This is a rebuild after a correction and the candidate set is unchanged

**What this catches:** wrong variant picks, wrong component family, over-componentization of decorative elements, and "I picked the cheat sheet default without thinking" failures. A 10-second user review here saves a 5-minute rebuild.

---

### Step 1 — Load the index
Read the index file first. It contains one entry per component with:
- `defaultKey` — component key to import
- `defaultSize` — `{w, h}` dimensions
- `subTypes` — list of available sub-variants
- `availableSizes` — list of size options (if applicable)
- `notes` — composition gotchas (READ THESE before placing)

Only open the full catalog when you need a specific non-default variant.

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

If the screen has ANY of these: video/image background, floating overlays, scrim gradients, elements that overlap other elements — you MUST define a layer structure.

**Layer model** (Figma z-order = child order — later children render on top):

| Layer | Purpose | Z-order |
|-------|---------|---------|
| **Base layer** | Full-bleed backgrounds, video, hero images | Bottom (first child, rendered behind everything) |
| **Content layer** | Primary UI: headers, lists, cards, action bars | Middle |
| **Overlay layer** | Floating elements: LIVE badge, emoji reactions, scrim gradients, toasts | Top (last child, rendered in front) |

Each layer = a transparent frame (375×812, `fills = []`) as a direct child of the main frame.

```js
// use_figma pattern:
const baseLayer = figma.createFrame();
baseLayer.name = "Base Layer"; baseLayer.resize(375, 812); baseLayer.fills = [];
mainFrame.appendChild(baseLayer);

const contentLayer = figma.createFrame();
contentLayer.name = "Content Layer"; contentLayer.resize(375, 812); contentLayer.fills = [];
mainFrame.appendChild(contentLayer);

const overlayLayer = figma.createFrame();
overlayLayer.name = "Overlay Layer"; overlayLayer.resize(375, 812); overlayLayer.fills = [];
mainFrame.appendChild(overlayLayer);
```

**When to use layers vs single-layer:**
| Screen type | Use layers? |
|-------------|-------------|
| Live stream, video player | ✅ YES — video bg + chat overlay + floating badges |
| Product detail with hero image | ✅ YES — image bg + scrollable content + sticky CTA |
| Standard list / settings / chat screen | ❌ NO — single content flow, no overlaps |
| Dark onboarding with illustration | Maybe — if illustration is behind text |

**If NOT using layers:** Skip this step. All sub-frames from Step 2 go directly inside the main frame.

**If using layers:** Your Step 2 frame tree must show which layer each sub-frame belongs to. The main frame's only direct children are the layer frames (2-3 max).

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

Create auto-layout sub-frames **inside** the main frame using `parentId`. These are plain frames (not library components), so `parentId` IS respected and they nest correctly.

**Apply auto-layout in this order:**
1. `create_frame(...)` with `parentId` — frame is created and nested
2. `set_layout_mode({ nodeId, layoutMode })` — enables auto-layout
3. `set_axis_align({ nodeId, primaryAxisAlignItems, counterAxisAlignItems })` — sets alignment
4. `set_item_spacing({ nodeId, itemSpacing })` — sets gap between children
5. `set_padding({ nodeId, paddingLeft, paddingRight, paddingTop, paddingBottom })`
6. `set_layout_sizing({ nodeId, layoutSizingHorizontal, layoutSizingVertical })`

> ⚠️ If `set_layout_mode` times out, skip all auto-layout steps for that frame and position children absolutely instead. Document affected groups for the user to apply Shift+A manually.

#### When to use auto-layout

| Use it for | Don't use it for |
|---|---|
| Horizontal rows (avatar + name + button) | The main 375×812 screen frame |
| Vertical stacks (settings list, chat messages) | Absolute overlay elements (scrims, LIVE badges) |
| Card content areas (title + condition + price) | Elements that need to overlap |
| Action icon + label pairs | Full-bleed backgrounds |
| Any repeated-item list | |

#### Quick-reference patterns

**Horizontal row** (e.g. streamer header):
```js
const row = create_frame({ name: "Streamer row", x: 0, y: 44, width: 375, height: 56, parentId: mainFrameId })
set_layout_mode({ nodeId: row.id, layoutMode: "HORIZONTAL" })
set_axis_align({ nodeId: row.id, primaryAxisAlignItems: "SPACE_BETWEEN", counterAxisAlignItems: "CENTER" })
set_padding({ nodeId: row.id, paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8 })
set_fill_color({ nodeId: row.id, r: 0, g: 0, b: 0 })  // transparent on dark screens
```

**Vertical stack** (e.g. product info: title + condition + price):
```js
const stack = create_frame({ name: "Product info", x: 0, y: 0, width: 200, height: 60, parentId: cardRowId })
set_layout_mode({ nodeId: stack.id, layoutMode: "VERTICAL" })
set_axis_align({ nodeId: stack.id, primaryAxisAlignItems: "MIN", counterAxisAlignItems: "MIN" })
set_item_spacing({ nodeId: stack.id, itemSpacing: 4 })
set_layout_sizing({ nodeId: stack.id, layoutSizingHorizontal: "FIXED", layoutSizingVertical: "HUG" })
```

**Space-between row** (e.g. left price + right button):
```js
set_layout_mode({ nodeId, layoutMode: "HORIZONTAL" })
set_axis_align({ nodeId, primaryAxisAlignItems: "SPACE_BETWEEN", counterAxisAlignItems: "CENTER" })
```

**Vertical list** (e.g. settings rows, chat messages):
```js
set_layout_mode({ nodeId, layoutMode: "VERTICAL" })
set_item_spacing({ nodeId, itemSpacing: 0 })
set_layout_sizing({ nodeId, layoutSizingHorizontal: "FIXED", layoutSizingVertical: "HUG" })
```

#### Sizing children inside auto-layout frames
```js
// After appending a child, set its sizing relative to the parent:
set_layout_sizing({ nodeId: childId, layoutSizingHorizontal: "FILL", layoutSizingVertical: "FIXED" })
// FILL = stretch to fill parent width
// HUG = wrap tightly around content
// FIXED = fixed pixel size
```

#### Standard spacing values (4px grid)
| Context | Gap | Padding |
|---|---|---|
| Dense list rows | 4px | 12–16px H, 8px V |
| Card content | 4–8px | 0 (card bg handles padding) |
| Horizontal action rows | 8–12px | 16px H |
| Section gaps | 16–24px | — |

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

**Bottom bar subtype selection:**
| Subtype | When to use | Key |
|---|---|---|
| **Tab** | App-level navigation (Home, Sell, Inbox, Me) — persistent across screens | `3b9328a181650df77a2be30b4416245a083b389a` (iOS) |
| **Button** | Contextual icon actions on live/video screens (share, gift, like, camera) | Find in full catalog under Bottom bar → Button |
| **Task** (single) | Single primary CTA at bottom (Buy Now, Add to Cart, Checkout) | `aa34133e85746732f44a341fa82540e099833cb9` (default) |
| **Task** (two buttons) | Two CTAs (Make Offer + Buy Now) | Find in full catalog under Bottom bar → Task/two buttons |
| **Promote** | Boost/promote CTA | Find in full catalog under Bottom bar → Promote |

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

**use_figma (JS):**
```js
const comp = await figma.importComponentByKeyAsync(defaultKey);
const inst = comp.createInstance();
inst.x = canvasX;
inst.y = canvasY;
frame.appendChild(inst);   // parentId works correctly here — appendChild nests it
inst.resize(343, 48);

// ✅ Verify — must log "INSTANCE"
if (inst.type !== 'INSTANCE') throw new Error('Not a DS instance — delete and re-import');
```

**Key placement rules:**
- Track `currentY` and advance by actual `instance.height` (not catalog `defaultSize.h`)
- Full-width components: `relativeX = 0`, resize width to 375
- Full-width CTA buttons: resize width to 343 (16px margin each side)
- Bottom bar: `relativeY = 812 - bottomBar.height`
- **Immediately after placing**, go to Step 5 (text override) and Step 5b (rename)
- **After every component placed**, confirm `inst.type === 'INSTANCE'` before continuing

**Always use the design system — no exceptions:**
| Element type | ✅ Use DS component | ❌ Never substitute with |
|---|---|---|
| Navigation bar / back button | Top Nav or Icon button | custom rectangle + text |
| CTA / action button | Normal Button, Rounded Button, Icon Button | rounded rect + text |
| Text input / chat input | Chat Input (pick correct state variant) | pill rect + placeholder text |
| Product card or listing | Listing Card | custom frame |
| Form input | Input component | rect + border |
| Bottom navigation | Bottom Bar | custom icon row |
| Status bar | Status Bar component | custom rect with text |
| Tags / badges | Tag Generic (Medium or High) | colored rect + text |
| Avatar | custom ellipse is acceptable — no DS avatar component | — |
| Video/image placeholder | custom rectangle is acceptable | — |
| Gradient scrim | custom rectangle with gradient fill is acceptable | — |

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

## Common component cheat sheet — ⚠️ starting points, not answers

> **Warning:** The keys below are *defaults for common cases*. They are NOT authoritative. Most components have 5–30 variants. Using the default without checking the reference visual is how the Tag/Chip mistake and the Top Nav variant mistake happen.
>
> Rules when using this table:
> 1. The cheat sheet key is only valid if it matches the reference variant. Otherwise find the correct variant in the full catalog.
> 2. For multi-variant components (Top Nav, Listing card, Button), see the disambiguation tables below.
> 3. If a `search_design_system` result returned something NOT in this cheat sheet, the search result wins — the library may have newer components this table doesn't know about.

### Top Nav — 16+ variants, pick by title size + action type

Full map in `figma-catalog-app.json` under `Top Nav > Title&Action > variants`. Quick map:

| Title size | Right action | Platform | Scrolled | Key | Size |
|---|---|---|---|---|---|
| Normal | Icons | iOS | No | `9d40ca717f7299286dbc1f209d6c61a31f32461b` | 375×132 |
| Shrunk | Icons | iOS | No | `608167843374d523d3070dea05964ba5a5a2a129` | 375×92 |
| Normal | TextButton | iOS | No | `f7dee42b2d7e0ba0b9d456fcdf919dff90ebf132` | 375×132 |
| Normal | Icons | iOS | Yes (scrolled state) | `df012adda5995187c4909ade76200da3ce09b9d3` | 375×132 |
| Normal | Icons | Android | No | `4624b655d6b05e30f8bb95eefded73bee5da261e` | 360×112 |

**Left-icon swap:** after placing, the default may show an X (close) when the reference shows a back arrow, or vice versa. The left icon is usually a swappable nested instance/component property, not a separate top-level variant. Check the instance properties panel and swap via Plugin API (`inst.setProperties({...})` or nested instance `swapComponent`). Don't pick a different Top Nav variant just to get a different left icon.

### Listing card — pick by what content the reference shows below the image

| Variant | Key | Shows |
|---|---|---|
| Product card (image + overlays) | `4e77b7e3e7473acc42597ca162f1f3d189527a7b` | Image-dominant, price pill overlay, heart — matches search/collection screens |
| General category (set — full detail) | `0338c46696e2deeb590bfe0ba4e798f286dffc34` | Image + title + price + attributes + actions — matches browse/feed screens |
| Verticals (set — category-tuned) | `7dab8bfd0e3e833566f9a63eb8ef494eea0e1040` | Category-specific rendering |
| Image Overlay (micro, set) | `cf665a46aab51fa30e105f24387a531260ec5bf7` | Just the image + overlays — for custom compositions |

**Decision rule:** Does the reference show title/attribute text below the image?
- **No** (image-dominant with only a price badge overlay) → **Product card**
- **Yes** (title, price, condition, attributes) → **General category**

Do NOT resize `General category` to try to hide its text — the internal layout doesn't clip cleanly, you'll end up with overlapping/cut-off text. Pick the right variant instead.

### Button (Donut 2.0) — 3 sizes × subtypes, pick by function

| Use case | Component | Default key | Sizes |
|---|---|---|---|
| Primary CTA, full label | Normal Button | `da7d8e4307f4be9b7358340e98f04fc584fbd6b9` | Small / **Medium** / Large |
| Normal Button (Large) — 48px tall | — | `0f46fd8e0015b3531e4365b89b5ddb440f3d8814` | Large |
| Normal Button (Large Secondary-dark) | — | `df6d3da8af62e0bf2945ebea85902c531b5725ec` | Dark-bg secondary |
| Icon-only action | Icon button | `bef3e5e19d544a0d89dbef31404254ccc9e78dd6` | Small / **Medium** / Large |
| Rounded / pill CTA (Follow, Join) | Rounded button | `34f5479f37a5fdaf878440d50c5c92bb0c87d06e` | Small / **Medium** |
| Inline link-style | Text Button | `d34527d057d71566106f4380c346939c65281aac` | Small / **Medium** / Large |

Full-width CTA → resize width to 343 (16px margin each side).

### Common one-offs — read carefully, naming is the trap

| Component | Key | Default size | Notes |
|-----------|-----|-------------|-------|
| **Chips** (filter pill, outlined, interactive) | `358519ac1939157f909e8047f47f7ac9f225d79e` (set) | varies | **Use for filter chips, NOT Tag Generic.** Chips = interactive/filterable/outlined. Tag = display-only label. |
| **Tag Generic (Medium)** — display label | `b242b07ecae797b412d3c8aaa9643b9f8c341520` | 84×20 | LIVE, Free Shipping, Brand New — NEVER for filter chips or tappable elements |
| **Tag Generic (High)** — red emphasis | `12668f84cd0f9a4d45edf4a4d42706c70c63a04f` | 84×20 | LIVE badge, Sold |
| **Bottom bar — Tab** (iOS) | `3b9328a181650df77a2be30b4416245a083b389a` | 375×90 | App-level nav (Home, Sell, Inbox) |
| **Bottom bar — Task** (single) | `aa34133e85746732f44a341fa82540e099833cb9` | 375×94 | Single primary CTA (Buy Now) |
| **Bottom bar — Button** | — (full catalog) | 375×~90 | Contextual icon actions (share, gift, like) |
| **Bottom bar — Promote** | — (full catalog) | 375×~94 | Boost/promote CTA |
| **Chat input (Default)** | `fdee8f42b4f5f79f93b0f81d21ec1e54a3ebd65b` | 375×104 | **Text entry only** — NEVER for action buttons labeled "Chat" |
| **Chat input (Typing)** | — (full catalog) | 375×104 | Active typing state with send button |

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

When the design system has been updated:
1. Re-extract pages using the extraction scripts (run in use_figma)
2. Run: `/usr/local/bin/node /Users/thanhhapham/Skills/app-to-desktop-conversion/generate-catalog.js`
3. Both full catalog and index are regenerated
