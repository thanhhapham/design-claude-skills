# figma-create-screen

Create app or web screens in Figma using the design system component catalog.

## When to use this skill
- "Build a chat screen", "Create a settings page", "Make a product listing screen"
- Assembling new screens from design system components
- For app→web conversion of existing screens, use `app-to-desktop-conversion` instead

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
| Dark mode variable mode switching | ❌ | Requires Figma plugin JS — see Step 7 below |

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
1. List the components you'll need and check `defaultSize.h` for each
2. Read component `notes` — critical for avoiding invisible errors
3. Determine if this is a **dark screen** (dark/black background, live stream, video player, etc.)
4. Calculate `currentY` increments top-to-bottom
5. Plan which groups need auto-layout sub-frames (streamer row, card content, chat stack, etc.)
6. Note the absolute canvas position where the new frame will be placed

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

Library components always land at **canvas level** (parentId ignored). Use absolute canvas coordinates:

```
canvasX = mainFrameX + relativeX
canvasY = mainFrameY + relativeY
```

```js
const inst = create_component_instance({ componentKey: defaultKey, x: canvasX, y: canvasY })
// Correct position if needed:
move_node({ nodeId: inst.id, x: correctCanvasX, y: correctCanvasY })
// Resize full-width button:
resize_node({ nodeId: inst.id, width: 343, height: 40 })
```

**Key placement rules:**
- Track `currentY` and advance by actual `instance.height` (not catalog `defaultSize.h`)
- Full-width components: `relativeX = 0`, resize width to 375
- Full-width CTA buttons: resize width to 343 (16px margin each side)
- Bottom bar: `relativeY = 812 - bottomBar.height`
- **Immediately after placing**, go to Step 5 (text override) and Step 5b (rename)

**Always use the design system:**
| Element type | Use |
|---|---|
| Navigation bar / back button | Top Nav or Icon button |
| CTA / action button | Normal Button, Rounded Button, or Icon Button |
| Text input / chat input | Chat Input (pick correct state variant) |
| Product card or listing | Listing Card |
| Form input | Input component |
| Bottom navigation | Bottom Bar |

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

### Step 6 — Dark mode variable switching

**Detect dark screen**: if the main frame fill is very dark (r < 0.15, g < 0.15, b < 0.15) OR the screen type is a live stream / video player / dark onboarding — apply dark mode variables to the frame.

Dark mode switching requires Figma plugin JS (not available in all MCP plugins). Run this in the plugin's code execution context if supported:

```js
// Switch the main frame to dark mode (all components inside inherit dark tokens)
const tokenFileKey = 'IMyoj8vQ2otIZJxs428f9p'; // Semantic tokens file

// Get the variable collection for the tokens
const collections = await figma.variables.getLocalVariableCollectionsAsync();
// Or import from library:
// const collection = await figma.variables.importVariableByKeyAsync('...');

// Find the dark mode variant
const collection = collections.find(c => c.name === 'Color');  // adjust to actual collection name
const darkMode = collection.modes.find(m => m.name === 'Dark');

if (darkMode) {
  frame.setExplicitVariableModeForCollection(collection, darkMode.modeId);
}
```

**Why this matters**: Without this, components placed on a dark screen still render with light mode token values (e.g., `content/primary` = #2c2c2d dark text on dark bg — invisible). Applying dark mode makes `content/primary` → `#f8f8f9` (near white), `background/base` → `#19191a`, etc.

**If dark mode switching is unavailable** (plugin doesn't support it):
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

## Common component cheat sheet

| Component | Key | Default size | Notes |
|-----------|-----|-------------|-------|
| Top Nav (iOS Normal) | `608167843374d523d3070dea05964ba5a5a2a129` | 375×132 | Includes status bar |
| Top Nav (iOS Shrunk) | — | 375×92 | |
| Bottom bar | `aa34133e85746732f44a341fa82540e099833cb9` | 375×94 | Includes home indicator |
| Chat input (Default) | `fdee8f42b4f5f79f93b0f81d21ec1e54a3ebd65b` | 375×104 | |
| Normal Button (Medium) | `da7d8e4307f4be9b7358340e98f04fc584fbd6b9` | 86×40 | Resize w=343 for full-width |
| Normal Button (Large) | `0f46fd8e0015b3531e4365b89b5ddb440f3d8814` | 86×48 | |
| Rounded button | `34f5479f37a5fdaf878440d50c5c92bb0c87d06e` | 63×32 | |
| Icon button | `bef3e5e19d544a0d89dbef31404254ccc9e78dd6` | 40×40 | |
| Tag Generic (Medium) | `b242b07ecae797b412d3c8aaa9643b9f8c341520` | 84×20 | Use instead of Program Specific |
| Tag Generic (High) | `12668f84cd0f9a4d45edf4a4d42706c70c63a04f` | 84×20 | Red/high emphasis |
| Listing card | `88dafae2c8e99b08f21f744dac898a06e08ef9e7` | 164×316 | |

---

## Post-build checklist for user

Always output this at the end of every screen build:

```
✅ Screen built. A few manual steps needed in Figma:

□ Auto-layout — select each group below and press Shift+A:
  · [List specific groups, e.g. "Streamer row (avatar + name + follow)"]
  · [e.g. "Product card row (thumbnail + info stack)"]
  · [e.g. "Chat message stack"]

□ Layer nesting — select all floating components on canvas,
  Cmd+X → click inside frame → Cmd+Shift+V to paste in place

□ Text styles — select raw text nodes and apply Fabriga style:
  · [List which text nodes, e.g. "Streamer name → Small/Bold"]
  · [e.g. "Chat messages → Tiny/Regular"]

□ Dark mode — if viewing in light mode, select the frame
  and switch variable mode to Dark in the right panel
```

---

## Catalog refresh

When the design system has been updated:
1. Re-extract pages using the extraction scripts (run in use_figma)
2. Run: `/usr/local/bin/node /Users/thanhhapham/Skills/app-to-desktop-conversion/generate-catalog.js`
3. Both full catalog and index are regenerated
