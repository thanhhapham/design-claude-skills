# figma-annotate

Place numbered annotation callouts directly on a Figma frame — for design review findings or engineering specs. Markers appear ON the design elements they reference; a legend panel appears immediately to the right.

---

## Scope

**Use this skill when:**
- Annotating design review findings from the `design-review` skill onto a Figma frame
- Adding engineering spec notes (spacing, typography, interaction, component details) to a frame
- The user says "annotate this frame", "add review notes on Figma", "mark up this design", or runs `/figma-annotate`

**Two modes:**
- **Design Review** — priority-based callouts: HIGH (red), MEDIUM (orange), LOW (gray)
- **Eng Spec** — numbered callouts with blue markers, no priority

**Limitations:**
- Requires the Figma Plugin MCP (`use_figma`) to be available
- Only works on Figma design files (not FigJam boards)

---

## Critical Rules — Follow These in Every `use_figma` Call

Violating these rules causes annotations to appear in wrong places or time out.

### Rule 1 — Legend panel always goes as a sibling of the target frame
```js
// CORRECT — works regardless of nesting depth
target.parent.appendChild(panel);        // same parent = same coordinate space
panel.x = target.x + target.width + 48; // relative to shared parent
panel.y = target.y;

// WRONG — causes misplacement when frame is nested
page.appendChild(panel);
panel.x = target.absoluteTransform[0][2] + target.width + 48; // DON'T DO THIS
```

### Rule 2 — Markers always go inside the target frame via an overlay
```js
// CORRECT — overlay sits on top of design; coordinates are relative to target top-left
const overlay = figma.createFrame();
overlay.name = "📍 Annotation Markers";
overlay.fills = [];
overlay.clipsContent = false;
overlay.resize(target.width, target.height);
overlay.x = 0; overlay.y = 0;
target.appendChild(overlay);

// WRONG — sibling markers don't show in target frame screenshot
page.appendChild(markerFrame); // DON'T DO THIS
```

### Rule 3 — Keep nodes under 40 per `use_figma` call
- ~20 nodes for 10 markers (1 ellipse + 1 text each)
- ~8 nodes for legend panel (1 frame + 1 text node)
- **Always split into two calls:** Call A = markers, Call B = legend panel
- Use a **single multiline text node** for the legend body — NOT individual card frames per finding

### Rule 4 — Max 2 font loads per call
```js
await figma.loadFontAsync({ family: "Inter", style: "Bold" });
await figma.loadFontAsync({ family: "Inter", style: "Regular" });
// Do NOT load more than 2 fonts per call
```

### Rule 5 — Always find the correct page before writing
```js
let targetPage = null, target = null;
for (const pg of figma.root.children) {
  const f = pg.findOne(n => n.id === "NODE_ID");
  if (f) { targetPage = pg; target = f; break; }
}
if (!targetPage) { figma.closePlugin("Node not found"); return; }
await figma.setCurrentPageAsync(targetPage);
```

### Rule 6 — Always clean up before placing new annotations (idempotent)
```js
// Remove overlay from inside target
for (let i = target.children.length - 1; i >= 0; i--) {
  const c = target.children[i];
  if (c.name === "📍 Annotation Markers") c.remove();
}
// Remove legend panel from target's parent
const oldPanel = Array.from(target.parent.children).find(n => n.name === "🔍 Annotation Legend");
if (oldPanel) oldPanel.remove();
```

### Rule 7 — Marker size must be proportional to frame size
Screenshot thumbnails make all frames look similar, but frame pixel dimensions vary enormously. A D=26 dot is invisible on a 5000px-wide frame.

| Frame width | D (circle diameter) | strokeWeight | fontSize |
|-------------|---------------------|--------------|----------|
| < 800px     | 26                  | 2            | 12       |
| 800–2000px  | 48                  | 3            | 20       |
| > 2000px    | 80                  | 4            | 34       |

Always read `target.width` from the coordinate-read call (Step 2) and choose D before placing markers.

### Rule 8 — Never place markers at a fixed X column
Each marker must be centered on the element it references. Do NOT use a shared `cx = target.width - D - 8` column — that stacks all dots at the right edge and makes the annotations useless.

```js
// CORRECT — each marker is centered on its element
dot.x = rx - D / 2;  // rx from real node position
dot.y = ry - D / 2;

// WRONG — all markers share the same X column
const cx = target.width - D - 8;
dot.x = cx; // DON'T DO THIS
```

---

## Workflow

### Step 1 — Parse input

- Extract `fileKey` from the Figma URL: segment between `/design/` and the next `/`
- Extract `nodeId`: the `node-id` query param, replacing `-` with `:` if needed
- Identify mode: Design Review (findings have priority) or Eng Spec (no priority)
- If no findings provided, ask the user or suggest running `design-review` first

---

### Step 2 — Read real node coordinates (ALWAYS do this first)

**Never estimate positions from a screenshot.** Screenshots are scaled down (a 5400px frame renders as ~800px in the thumbnail — a 6.75× error). Always call `use_figma` to read actual node positions first.

```js
// Coordinate-read call — returns frame dimensions + child positions
let targetPage = null, target = null;
for (const pg of figma.root.children) {
  const f = pg.findOne(n => n.id === "NODE_ID");
  if (f) { targetPage = pg; target = f; break; }
}
if (!target) { figma.closePlugin("not found"); return; }
await figma.setCurrentPageAsync(targetPage);

const absX = target.absoluteTransform[0][2];
const absY = target.absoluteTransform[1][2];
const lines = [`frame w=${target.width} h=${target.height} absX=${absX} absY=${absY}`];

for (const child of target.children) {
  const cx = child.absoluteTransform[0][2];
  const cy = child.absoluteTransform[1][2];
  lines.push(`${child.name}: x=${child.x} y=${child.y} w=${child.width} h=${child.height} absX=${cx} absY=${cy}`);
  if ("children" in child) {
    for (const gc of child.children) {
      const gx = gc.absoluteTransform[0][2];
      const gy = gc.absoluteTransform[1][2];
      lines.push(`  └─ ${gc.name}: x=${gc.x} y=${gc.y} w=${gc.width} h=${gc.height} absX=${gx} absY=${gy}`);
    }
  }
}
figma.closePlugin(lines.join("\n"));
```

**From the output, map each finding to a specific child node:**
- Direct children: use `child.x` and `child.y` directly — they're already relative to the target frame
- Nested grandchildren: compute `frame_relative_x = grandchild_absX - target_absX`, same for Y
- Center the marker on the element: `rx = child.x + child.width / 2`, `ry = child.y + child.height / 2`
- If a sub-area within a child is relevant (e.g. "bottom bar" inside a phone screen), drill down another level

**If the node tree is too deep to enumerate in one call**, run a second targeted call on the specific child node id to get its grandchildren.

**Screenshot is a secondary aid** — use `get_screenshot` only to visually confirm which child node corresponds to which finding, not to derive pixel positions.

---

### Step 3 — Choose marker size

Read `target.width` from the Step 2 output and set D:
- `target.width < 800` → `D = 26, strokeWeight = 2, fontSize = 12`
- `target.width 800–2000` → `D = 48, strokeWeight = 3, fontSize = 20`
- `target.width > 2000` → `D = 80, strokeWeight = 4, fontSize = 34`

---

### Step 4 — Build the items array

Compile the final list using real coordinates from Step 2:

```
// Design Review mode: [num, priorityKey, rx, ry, principle]
// "H" = HIGH, "M" = MEDIUM, "L" = LOW, "E" = Eng Spec
// principle = short name of the design/UX principle the finding comes from
const items = [
  [1, "H", 1430, 1450, "Fitts's Law"],
  [2, "H", 3275, 2010, "Nielsen H4: Consistency & Standards"],
  ...
];
```

If two findings land within `D` pixels of each other, stagger one by `D * 1.2` in x or y to avoid overlap.

---

### Step 5 — Place markers (Call A, ~20 nodes)

```js
await figma.loadFontAsync({ family: "Inter", style: "Bold" });

let targetPage = null, target = null;
for (const pg of figma.root.children) {
  const f = pg.findOne(n => n.id === "NODE_ID");
  if (f) { targetPage = pg; target = f; break; }
}
if (!target) { figma.closePlugin("not found"); return; }
await figma.setCurrentPageAsync(targetPage);

// Clean up existing markers
for (let i = target.children.length - 1; i >= 0; i--) {
  if (target.children[i].name === "📍 Annotation Markers") target.children[i].remove();
}

const COL = {
  H: { r:0.91, g:0.18, b:0.18 },  // HIGH red
  M: { r:0.96, g:0.54, b:0.12 },  // MEDIUM orange
  L: { r:0.40, g:0.40, b:0.50 },  // LOW gray
  E: { r:0.12, g:0.44, b:0.85 },  // Eng Spec blue
};

// [num, priorityKey, rx, ry, principle] — rx/ry are frame-relative pixel positions from Step 2
const items = [
  // REPLACE WITH ACTUAL VALUES
];

// REPLACE D, SW, FS based on target.width (see Step 3)
const D = 80, SW = 4, FS = 34;

const overlay = figma.createFrame();
overlay.name = "📍 Annotation Markers";
overlay.fills = [];
overlay.clipsContent = false;
overlay.resize(target.width, target.height);
overlay.x = 0; overlay.y = 0;
target.appendChild(overlay);

for (const [n, p, rx, ry] of items) {
  const c = COL[p];

  const dot = figma.createEllipse();
  dot.name = `● ${n}`;
  dot.resize(D, D);
  dot.x = rx - D / 2;
  dot.y = ry - D / 2;
  dot.fills = [{ type: "SOLID", color: c }];
  dot.strokes = [{ type: "SOLID", color: { r:1, g:1, b:1 } }];
  dot.strokeWeight = SW;
  overlay.appendChild(dot);

  const t = figma.createText();
  t.name = `# ${n}`;
  t.characters = String(n);
  t.fontSize = FS;
  t.fontName = { family: "Inter", style: "Bold" };
  t.fills = [{ type: "SOLID", color: { r:1, g:1, b:1 } }];
  t.textAlignHorizontal = "CENTER";
  t.textAlignVertical = "CENTER";
  t.resize(D, D);
  t.x = rx - D / 2;
  t.y = ry - D / 2;
  overlay.appendChild(t);
}

figma.closePlugin("Markers placed");
```

---

### Step 6 — Create legend panel (Call B, ~8 nodes)

Legend width scales with the frame: use `PW = Math.max(480, Math.round(target.width * 0.17))` — for a 5400px frame that's ~900px.

```js
await figma.loadFontAsync({ family: "Inter", style: "Bold" });
await figma.loadFontAsync({ family: "Inter", style: "Regular" });

let targetPage = null, target = null;
for (const pg of figma.root.children) {
  const f = pg.findOne(n => n.id === "NODE_ID");
  if (f) { targetPage = pg; target = f; break; }
}
if (!target) { figma.closePlugin("not found"); return; }
await figma.setCurrentPageAsync(targetPage);

// Clean up old panel
const oldPanel = Array.from(target.parent.children).find(n => n.name === "🔍 Annotation Legend");
if (oldPanel) oldPanel.remove();

// Single multiline text block — NOT individual card frames per finding
// Build content with position tracking for styled ranges
let content = "";
let titleEnd = 0;
const sectionRanges = [];   // [start, end] for HIGH / MEDIUM / LOW headers
const principleRanges = []; // [start, end] for "   → Principle" lines

function ap(str) { content += str; }
function aSection(str) {
  const s = content.length; content += str;
  sectionRanges.push([s, content.length]);
}
function aPrinciple(str) {
  const s = content.length; content += str;
  principleRanges.push([s, content.length]);
}

const title = "REPLACE WITH TITLE";   // e.g. "Design Review - Seller Search"
ap(title + "\n");
titleEnd = title.length;
ap("REPLACE WITH SUBTITLE\n\n");       // e.g. "10 findings - 3 HIGH - 4 MEDIUM - 3 LOW"

// HIGH section — replace with actual findings
aSection("HIGH\n");
ap("1  Finding label - detail text.\n");
aPrinciple("   \u2192 Principle Name\n");  // e.g. "   → Fitts's Law"
ap("\n");

// MEDIUM section
aSection("MEDIUM\n");
ap("3  Finding label - detail text.\n");
aPrinciple("   \u2192 Principle Name\n");
ap("\n");

// LOW section
aSection("LOW\n");
ap("8  Finding label - detail text.\n");
aPrinciple("   \u2192 Principle Name\n");

// Scale panel width proportionally to frame width
const PW = Math.max(480, Math.round(target.width * 0.17));

const panel = figma.createFrame();
panel.name = "🔍 Annotation Legend";
panel.fills = [{ type: "SOLID", color: { r:0.07, g:0.07, b:0.12 } }];
panel.cornerRadius = 12;
panel.strokes = [{ type: "SOLID", color: { r:0.2, g:0.2, b:0.3 } }];
panel.strokeWeight = 1.5;
panel.resize(PW, 400);

// Rule 1: add as sibling, position relative to shared parent
target.parent.appendChild(panel);
panel.x = target.x + target.width + 48;
panel.y = target.y;

const t = figma.createText();
t.characters = content;
t.fontSize = 18;
t.fontName = { family: "Inter", style: "Regular" };
t.fills = [{ type: "SOLID", color: { r:0.85, g:0.85, b:0.95 } }];
t.x = 32; t.y = 32;
t.resize(PW - 64, 300);
t.textAutoResize = "HEIGHT";
panel.appendChild(t);

// Title — bold white
t.setRangeFontName(0, titleEnd, { family: "Inter", style: "Bold" });
t.setRangeFills(0, titleEnd, [{ type: "SOLID", color: { r:1, g:1, b:1 } }]);

// Section headers — bold white
for (const [s, e] of sectionRanges) {
  t.setRangeFontName(s, e, { family: "Inter", style: "Bold" });
  t.setRangeFills(s, e, [{ type: "SOLID", color: { r:1, g:1, b:1 } }]);
}

// Principle lines — muted blue, visually subordinate
const muteColor = [{ type: "SOLID", color: { r:0.45, g:0.62, b:0.88 } }];
for (const [s, e] of principleRanges) {
  t.setRangeFills(s, e, muteColor);
}

panel.resize(PW, t.height + 64);
figma.closePlugin("Legend panel placed");
```

---

### Step 7 — Verify

- Call `get_screenshot` on the target frame node
- Confirm numbered circles are **ON the design elements** they reference, not stacked at the right edge
- Confirm circles are large enough to be visible (if they look tiny, D was too small — re-run with larger D)
- Legend panel is to the right of the frame (won't appear in the node screenshot — that's expected)
- If markers are missing: check that `overlay` was appended via `target.appendChild()`, not `page.appendChild()`
- If legend is in wrong place: verify `target.parent.appendChild(panel)` was used, not `page.appendChild(panel)`
- Report result to user with screenshot

---

## Colour Reference

| Priority  | Hex       | RGB (0–1)                      |
|-----------|-----------|-------------------------------|
| HIGH      | `#E82E2E` | `{r:0.91, g:0.18, b:0.18}`   |
| MEDIUM    | `#F58B20` | `{r:0.96, g:0.54, b:0.12}`   |
| LOW       | `#666677` | `{r:0.40, g:0.40, b:0.50}`   |
| Eng Spec  | `#1E70D9` | `{r:0.12, g:0.44, b:0.85}`   |
| Legend BG | `#111118` | `{r:0.07, g:0.07, b:0.12}`   |
| Principle | `#739FE0` | `{r:0.45, g:0.62, b:0.88}`   |

---

## Layer Naming Convention

Always use these names exactly (enables idempotent cleanup):
- Marker overlay (inside target): `📍 Annotation Markers`
- Legend panel (sibling of target): `🔍 Annotation Legend`

---

## What Went Wrong Before (lessons encoded in this skill)

| Mistake | Effect | Fix |
|---------|--------|-----|
| Estimating positions from screenshot pixels | Off by 6–7× because screenshot is scaled | Always read real coords via `use_figma` first |
| All markers at `cx = target.width - D - 8` | All dots stacked at right edge, not on elements | Use per-marker `rx, ry` from real node positions |
| D=26 on a 5000px-wide frame | Dots invisible at frame scale | Scale D to frame width (see Rule 7) |
| `page.appendChild(panel)` + absoluteTransform for legend | Panel appears far from frame when nested | Use `target.parent.appendChild(panel)` + `target.x + target.width + 48` |
| 50–100 nodes in one `use_figma` call | Stream timeout before completion | Split: Call A = markers (~20 nodes), Call B = legend (~8 nodes) |
| One text node per finding in legend | 30–50 extra nodes → timeout | Single multiline text block for entire legend |
