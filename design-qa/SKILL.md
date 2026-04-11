# design-qa

Compare a Figma design against a live URL. Produce a tiered QA report with pixel-precise findings and an annotated screenshot showing numbered markers on the implementation.

---

## Scope

**Use this skill when:**
- Comparing a live page implementation against a Figma design
- The user says "design QA", "QA this", "check implementation against design", or runs `/design-qa`

**Arguments:** `--figma <figma-url> --live <live-url> [--viewport desktop|mobile] [--platform ios|android|web] [--focus <component-name>]`

**Examples:**
```
/design-qa --figma https://www.figma.com/design/abc123/App?node-id=1-2 --live https://example.com/page
/design-qa --figma https://www.figma.com/design/abc123/App?node-id=1-2 --live https://example.com/page --viewport mobile --platform ios
/design-qa --figma https://www.figma.com/design/abc123/App?node-id=1-2 --live https://example.com/page --focus "ListingCard"
```

**Limitations:**
- Requires Playwright (`npm install -g playwright && npx playwright install chromium`)
- Requires the Figma MCP to be available
- Only works on Figma design files (not FigJam)

---

## Finding Tiers

All findings are bucketed into three tiers. This structure is mandatory — never mix tiers or use a different categorisation.

### Tier 1 — Structural (blocks sign-off)

Things obviously wrong at a glance. Anyone — PM, engineer, non-designer — would notice these.

| Category | What to look for |
|----------|-----------------|
| Missing sections | Entire section present in design but absent from implementation |
| Missing elements | Badge, icon, button, image, banner not rendered |
| Extra elements | Elements in implementation that are not in the design (injected ads, promos, debug elements) |
| Wrong copy | Different text content, wrong labels, placeholder text left in |
| Wrong layout | Column vs row, wrong grid column count, wrong content order, wrong stacking |
| Broken rendering | Truncated text that shouldn't be, overlapping elements, clipped content, layout overflow |
| Wrong assets | Different icon, placeholder image, wrong illustration |

### Tier 2 — Precision (degrades quality)

Requires comparing against the design spec to notice. **Every Tier 2 finding MUST include exact Expected and Actual values.** Vague descriptions like "spacing is off" or "color doesn't match" are forbidden.

| Category | Finding format |
|----------|---------------|
| Spacing | "Gap between X and Y: **16px** → should be **12px**" |
| Sizing | "Button height: **40px** → should be **48px**" |
| Typography | "Title font: **14px/400** → should be **16px/600**" |
| Colors | "Button bg: **#E63939** → should be **#FF2E2E**" |
| Border radius | "Card radius: **8px** → should be **12px**" |
| Padding | "Card padding: **12px all** → should be **16px top/bottom, 12px left/right**" |
| Opacity | "Overlay opacity: **0.3** → should be **0.5**" |
| Line height | "Body line-height: **18px** → should be **24px**" |

### Tier 3 — Polish & Platform (nice to fix)

Lower-priority refinements that affect perceived quality but are not blockers.

| Category | What to look for |
|----------|-----------------|
| Shadows/elevation | Missing or different drop shadow vs design spec |
| Hover/active states | Missing interaction feedback states |
| Accessibility | Contrast ratio below 4.5:1, touch target below 44×44px |
| Alignment | Elements off by 1-2px from shared baseline or vertical lane |
| Platform-specific | Mobile touch targets too small, web hover states missing |
| Animation/transition | Missing or different transition timing |

---

## Comparison Tolerance Thresholds

Do NOT flag differences below these thresholds — they are normal rendering variance:

| Property | Threshold |
|----------|-----------|
| Color | Delta > 5 per RGB channel (0-255 scale) |
| Font size | Any difference (even 1px matters) |
| Spacing / Gap | Delta > 2px |
| Border radius | Delta > 1px |
| Dimensions (width/height) | Delta > 4px |
| Opacity | Delta > 0.05 |
| Shadow blur/spread | Delta > 2px |

---

## Workflow

### Step 1 — Parse Arguments

Extract from arguments:
- `figmaUrl` — full Figma URL (required)
- `liveUrl` — live URL to compare (required)
- `viewport` — `desktop` (1440×900) or `mobile` (375×812), default: `desktop`
- `platform` — `ios`, `android`, or `web`, default: infer from viewport (mobile → ios, desktop → web)
- `focus` — optional component/section name to narrow analysis

Parse the Figma URL:
- `fileKey` — segment between `/design/` (or `/file/`) and the next `/`
- `nodeId` — from query param `node-id`, replacing `-` with `:`

If `figmaUrl` or `liveUrl` is missing, stop and ask.

---

### Step 2 — Fetch Figma Design Data

#### 2.1 Get design context
Call `get_design_context` with `fileKey` and `nodeId`.

Extract and record:
- Frame/component name and dimensions (width × height)
- Background color
- Layout: direction, gap, alignment, padding
- For each child element: name, type, fill color, font size, font weight, font family, line height, border radius

#### 2.2 Get visual screenshot
Call `get_screenshot` with `fileKey` and `nodeId`.

This is the **design ground truth** — the reference for visual comparison.

#### 2.3 Build design spec

Produce a structured summary:
```
Frame:      [name]
Dimensions: [w]x[h]px
Background: [hex]
Layout:     [direction], gap: [px], padding: [t] [r] [b] [l]
Children:
  [name] ([type])
    color:  [hex]
    font:   [family] [size]px [weight]
    bg:     [hex]
    radius: [px]
  ...
```

---

### Step 3 — Capture the Live Site

Write the capture script to `/tmp/design-qa-capture.mjs`, then run it.

The script runs with `headless: false` — the browser is always visible for CAPTCHA solving and login.

```javascript
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import * as readline from 'readline';

const LIVE_URL = process.argv[2];
const VIEWPORT = process.argv[3] === 'mobile'
  ? { width: 375, height: 812 }
  : { width: 1440, height: 900 };

// --- CAPTCHA detection ---
const CAPTCHA_SIGNALS = [
  /captcha/i, /recaptcha/i, /hcaptcha/i,
  /cf-challenge/i, /challenge-running/i,
  /access denied/i, /verify you are human/i,
  /prove you.*human/i, /bot.*detected/i,
  /security check/i, /ddos.*protection/i,
];

// --- Login detection ---
const LOGIN_SIGNALS = [
  /sign\s*in/i, /log\s*in/i, /login/i, /authenticate/i,
  /enter your password/i, /unauthorized/i, /401/, /403/,
];

async function isCaptchaPage(page) {
  const title = await page.title();
  const bodyText = await page.evaluate(() => document.body?.innerText || '').catch(() => '');
  for (const s of CAPTCHA_SIGNALS) {
    if (s.test(title) || s.test(bodyText.substring(0, 1000))) return true;
  }
  for (const sel of [
    'iframe[src*="recaptcha"]', 'iframe[src*="hcaptcha"]',
    '.cf-browser-verification', '#challenge-form',
    '#cf-challenge-running', '[data-sitekey]',
  ]) {
    if (await page.$(sel).catch(() => null)) return true;
  }
  return false;
}

async function isLoginPage(page, targetUrl) {
  const title = await page.title();
  const bodyText = await page.evaluate(() => document.body?.innerText || '').catch(() => '');
  const hasLoginForm = await page.evaluate(() => {
    const pw = document.querySelector('input[type="password"]');
    const em = document.querySelector('input[type="email"], input[name*="email"], input[name*="user"]');
    return !!(pw || (em && document.querySelector('form')));
  }).catch(() => false);
  const textMatch = LOGIN_SIGNALS.some(s => s.test(title) || s.test(bodyText.substring(0, 500)));
  return hasLoginForm || (textMatch && page.url() !== targetUrl);
}

async function waitForInput(prompt) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(r => rl.question(prompt, a => { rl.close(); r(a.trim()); }));
}

async function settle(page) {
  try { await page.waitForLoadState('networkidle', { timeout: 15000 }); } catch {}
}

// --- Launch ---
const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();
await page.setViewportSize(VIEWPORT);

await page.goto(LIVE_URL, { waitUntil: 'load', timeout: 60000 });
await settle(page);

// --- CAPTCHA check ---
if (await isCaptchaPage(page)) {
  console.error('CAPTCHA_DETECTED — browser window is open, please solve it.');
  const ans = await waitForInput('Press Enter when done, or type "abort": ');
  if (ans.toLowerCase() === 'abort') { await browser.close(); process.exit(1); }
  if (await isCaptchaPage(page)) { await browser.close(); console.error('CAPTCHA still present.'); process.exit(2); }
  await settle(page);
}

// --- Login check ---
if (await isLoginPage(page, LIVE_URL)) {
  console.error('LOGIN_REQUIRED — browser window is open, please log in.');
  const ans = await waitForInput('Press Enter when logged in, or type "abort": ');
  if (ans.toLowerCase() === 'abort') { await browser.close(); process.exit(1); }
  if (page.url() !== LIVE_URL) await page.goto(LIVE_URL, { waitUntil: 'load', timeout: 60000 });
  await settle(page);
  if (await isLoginPage(page, LIVE_URL)) { await browser.close(); console.error('Still on login page.'); process.exit(2); }
}

// --- Wait for content ---
await page.waitForTimeout(3000);
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1500);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1000);

// --- Clean screenshot (no markers) ---
await page.screenshot({ path: '/tmp/design-qa-live-clean.png', fullPage: true });

// --- Extract computed styles ---
const styles = await page.evaluate(() => {
  const results = [], seen = new Set();
  const elements = document.querySelectorAll(
    'h1,h2,h3,h4,h5,h6,p,span,button,a,img,input,textarea,select,label,nav,header,footer,main,section,article,[class]:not(script):not(style):not(link)'
  );
  Array.from(elements).slice(0, 80).forEach(el => {
    const key = el.tagName + '.' + el.className;
    if (seen.has(key)) return;
    seen.add(key);
    const cs = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    results.push({
      tag: el.tagName.toLowerCase(),
      classes: el.className?.toString() || '',
      text: el.innerText?.trim().substring(0, 80) || '',
      rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
      styles: {
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontFamily: cs.fontFamily.split(',')[0].trim().replace(/"/g, ''),
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        textTransform: cs.textTransform,
        padding: cs.padding,
        margin: cs.margin,
        borderRadius: cs.borderRadius,
        borderColor: cs.borderColor,
        borderWidth: cs.borderWidth,
        boxShadow: cs.boxShadow,
        opacity: cs.opacity,
        display: cs.display,
        flexDirection: cs.flexDirection,
        gap: cs.gap,
      },
      // For images: compare natural vs rendered size
      ...(el.tagName === 'IMG' ? {
        naturalWidth: el.naturalWidth,
        naturalHeight: el.naturalHeight,
      } : {}),
    });
  });
  return results;
});
writeFileSync('/tmp/design-qa-styles.json', JSON.stringify(styles, null, 2));

// --- Page metadata ---
const meta = await page.evaluate(() => ({
  title: document.title,
  viewport: window.innerWidth + 'x' + window.innerHeight,
  url: location.href,
}));
writeFileSync('/tmp/design-qa-meta.json', JSON.stringify(meta, null, 2));

await browser.close();
console.log('Capture complete');
```

Run:
```bash
node /tmp/design-qa-capture.mjs "<liveUrl>" "<viewport>"
```

### CAPTCHA and Login Handling

The script runs `headless: false` — the browser window is always visible.

**CAPTCHA detected** (`CAPTCHA_DETECTED` in stderr):
1. Tell the user: "A CAPTCHA was detected. The browser window is open — solve it, then press Enter."
2. If they type `abort` → exit code 1
3. If CAPTCHA still present → exit code 2

**Login required** (`LOGIN_REQUIRED` in stderr):
1. Tell the user: "Login required. The browser window is open — log in, then press Enter."
2. After login, script auto-navigates back to the target URL if needed
3. If they type `abort` → exit code 1
4. If still on login page → exit code 2

If Playwright is not installed:
> Install with: `npm install -g playwright && npx playwright install chromium`

Read the output files:
- `/tmp/design-qa-live-clean.png` — clean screenshot (no markers)
- `/tmp/design-qa-styles.json` — computed CSS per element
- `/tmp/design-qa-meta.json` — page metadata

---

### Step 4 — Compare Design vs Live

You now have four inputs:
1. **Figma screenshot** — design intent (Step 2.2)
2. **Live screenshot** — rendered reality (`/tmp/design-qa-live-clean.png`)
3. **Figma design spec** — exact design values (Step 2.3)
4. **Live computed styles** — rendered CSS values (`/tmp/design-qa-styles.json`)

#### 4.1 Build the element map

Before comparing, explicitly map each Figma child node to a DOM element. Use name heuristics and text content matching:

```
Figma "Header Bar" (1440×48)             ↔  DOM header (1440×113)
Figma "global search" (1312×48)           ↔  DOM form.search (1312×48)
Figma "dweb product listing card" (241×423) ↔  DOM div.listing-card (...)
Figma "sell btn" (64×32)                  ↔  DOM a.sell-btn (60×32)
```

If `--focus <component>` was provided, prioritise mapping that component and its children. Skip elements outside the focus area for Tier 2/3 (still report Tier 1 structural issues for the whole page).

#### 4.2 Visual comparison (screenshots)

Look at both images and note:
- Overall layout match (structure, hierarchy, content order)
- Color differences (backgrounds, text, buttons, borders)
- Spacing differences (too tight/loose between sections)
- Typography differences (size, weight, truncation)
- Missing elements (in Figma but not live)
- Extra elements (in live but not in Figma)

#### 4.3 Semantic comparison (values)

For each matched element pair, compare property by property:

| Property | Figma value | CSS equivalent |
|---|---|---|
| Fill color | `{r,g,b}` floats → `rgb(R,G,B)` | `color` or `backgroundColor` |
| Font size | `16` (px) | `fontSize: "16px"` |
| Font weight | `600` | `fontWeight: "600"` |
| Font family | `"Inter"` | `fontFamily` first value |
| Padding | `16` per side | `padding` shorthand |
| Gap | `12` (px) | `gap` |
| Border radius | `8` (px) | `borderRadius` |
| Shadow | Figma shadow values | `boxShadow` |
| Opacity | `0.5` | `opacity` |

Convert Figma float colors: `{ r: 1, g: 0.18, b: 0.18 }` → `rgb(255, 46, 46)` → `#FF2E2E`

Apply the tolerance thresholds defined above. Only report differences that exceed the threshold.

#### 4.4 Categorise findings into tiers

Assign each finding to Tier 1, 2, or 3 per the definitions above. Number all findings sequentially (❶❷❸…) across tiers — these numbers will be used on the annotated screenshot.

For each finding, also record the **bounding rect** of the DOM element it refers to (from `styles.json`). This is needed for placing markers in Step 5.

---

### Step 5 — Output Report and Annotated Screenshot

#### 5.1 Generate the annotated screenshot

Write a second script `/tmp/design-qa-annotate.mjs` that composites numbered circle markers onto the clean screenshot:

```javascript
import { readFileSync, writeFileSync } from 'fs';

// Read markers JSON from stdin or file argument
const markers = JSON.parse(readFileSync(process.argv[2], 'utf8'));
// markers = [{ num: 1, tier: 1, x: 594, y: 281 }, { num: 2, tier: 2, x: 1316, y: 8 }, ...]

const COLORS = { 1: '#E82E2E', 2: '#F58B20', 3: '#6B7280' };

// Use Playwright to re-open the clean screenshot and draw markers
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// Load the clean screenshot as a page
const screenshotPath = process.argv[3] || '/tmp/design-qa-live-clean.png';
const imageBuffer = readFileSync(screenshotPath);
const base64 = imageBuffer.toString('base64');
const dataUrl = `data:image/png;base64,${base64}`;

await page.setContent(`
  <html>
  <body style="margin:0;padding:0;">
    <div style="position:relative;display:inline-block;">
      <img src="${dataUrl}" style="display:block;" />
      <div id="overlay" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></div>
    </div>
  </body>
  </html>
`);

// Wait for image to load
await page.waitForSelector('img');
await page.waitForTimeout(500);

// Get image dimensions
const imgDims = await page.evaluate(() => {
  const img = document.querySelector('img');
  return { w: img.naturalWidth, h: img.naturalHeight };
});
await page.setViewportSize({ width: imgDims.w, height: imgDims.h });

// Inject markers
await page.evaluate((markers, COLORS) => {
  const overlay = document.getElementById('overlay');
  for (const m of markers) {
    const D = 32;
    const dot = document.createElement('div');
    dot.textContent = m.num;
    dot.style.cssText = `
      position:absolute;
      left:${m.x - D/2}px;
      top:${m.y - D/2}px;
      width:${D}px;
      height:${D}px;
      border-radius:50%;
      background:${COLORS[m.tier]};
      color:#fff;
      font:bold 16px Inter, -apple-system, sans-serif;
      display:flex;
      align-items:center;
      justify-content:center;
      border:2.5px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,0.4);
      z-index:10;
    `;
    overlay.appendChild(dot);
  }
}, markers, COLORS);

await page.waitForTimeout(300);

// Screenshot the annotated result
const container = await page.$('div');
await container.screenshot({ path: '/tmp/design-qa-live-annotated.png' });

await browser.close();
console.log('Annotated screenshot saved');
```

**How to run it:**

1. After Step 4, write the markers JSON to `/tmp/design-qa-markers.json`:
```json
[
  { "num": 1, "tier": 1, "x": 594, "y": 281 },
  { "num": 2, "tier": 1, "x": 700, "y": 400 },
  { "num": 3, "tier": 2, "x": 1316, "y": 8 }
]
```
Where `x` and `y` are the **center point** of the DOM element's bounding rect (from styles.json: `rect.x + rect.w/2`, `rect.y + rect.h/2`).

2. Run:
```bash
node /tmp/design-qa-annotate.mjs /tmp/design-qa-markers.json /tmp/design-qa-live-clean.png
```

3. Show the user `/tmp/design-qa-live-annotated.png` inline in the conversation.

#### 5.2 Deliver the report

Present the annotated screenshot first, then the structured text report:

```
## Design QA Report
━━━━━━━━━━━━━━━━━━
Design   : [Figma frame name]
Live URL : [url]
Viewport : [desktop|mobile] ([width]×[height])
Platform : [web | ios | android]

### Summary
[2-3 sentences: overall fidelity, biggest gaps, whether it's close to sign-off or needs work]

---

### Tier 1 — Structural Issues
[Things obviously wrong at a glance — blocks sign-off if any]

❶ **[Element] — [What's wrong]**
   [One sentence with specifics]

❷ **[Element] — [What's wrong]**
   [One sentence with specifics]

> If none: "No structural issues found ✅"

---

### Tier 2 — Precision Issues
[Spacing, sizing, color, typography — requires design spec to notice]

❸ **[Element] — [Property]**
   Expected: [exact value from Figma]
   Actual:   [exact value from implementation]

❹ **[Element] — [Property]**
   Expected: [exact value]
   Actual:   [exact value]

> If none: "All values within tolerance ✅"

---

### Tier 3 — Polish & Platform
[Lower priority refinements]

❼ **[Element] — [Issue]**
   [One sentence]

> If none: "No polish issues found ✅"

---

### Scorecard

| Tier | Count | Status |
|------|-------|--------|
| Tier 1 — Structural | n | ✅ PASS / ❌ FAIL |
| Tier 2 — Precision  | n | ✅ PASS / ⚠️ NEEDS WORK |
| Tier 3 — Polish     | n | ✅ PASS / 💡 MINOR |

**Verdict**: ✅ APPROVED / ⚠️ APPROVED WITH NOTES / ❌ NEEDS REVISION
```

**Rules for the report:**
- Finding numbers are sequential across ALL tiers (❶❷❸…❾⑩⑪…) — they match the numbered markers on the annotated screenshot 1:1
- Every Tier 2 finding has an `Expected:` / `Actual:` pair with exact values — no exceptions
- Tier 1 findings are described in plain language anyone can understand
- Tier 3 findings are one sentence each
- If `--platform` was specified, group findings under platform headers when relevant: `[iOS]`, `[Android]`, `[Web]`

---

### Step 6 — Offer to Place on Figma

After delivering the report and annotated screenshot, ask:

> **"Would you like me to place these annotated screenshots on a Figma frame? If so, paste the link to the frame where you'd like them."**

If the user provides a Figma frame link:

1. Parse the link to extract `fileKey` and `nodeId` of the target frame
2. Upload the annotated screenshot PNG and place it in the target frame using `use_figma`:

```javascript
await figma.loadFontAsync({ family: "Inter", style: "Bold" });
await figma.loadFontAsync({ family: "Inter", style: "Regular" });

let targetPage = null, target = null;
for (const pg of figma.root.children) {
  const f = pg.findOne(n => n.id === "TARGET_NODE_ID");
  if (f) { targetPage = pg; target = f; break; }
}
if (!target) { figma.closePlugin("Frame not found"); return; }
await figma.setCurrentPageAsync(targetPage);

// Create the screenshot frame
const imgBytes = figma.base64Decode("BASE64_ENCODED_PNG");
const image = figma.createImage(imgBytes);

const frame = figma.createFrame();
frame.name = "📍 QA — [page name] — [date]";
frame.resize(SCREENSHOT_WIDTH, SCREENSHOT_HEIGHT);
frame.fills = [{ type: "IMAGE", imageHash: image.hash, scaleMode: "FILL" }];

// Place as child of target frame
target.appendChild(frame);
frame.x = 0;
frame.y = 0;

figma.closePlugin("Screenshot placed");
```

**Note on base64:** Read the PNG file, base64-encode it, and embed in the `use_figma` code string. For large screenshots, this may hit size limits. If so, tell the user:
> "The screenshot is too large to embed directly. I've saved it to `/tmp/design-qa-live-annotated.png` — you can drag it into your Figma frame."

3. Optionally add a text legend node below the screenshot frame summarising findings by tier (same single multiline text approach as figma-annotate).

---

## Troubleshooting

| Problem | Solution |
|---|---|
| CAPTCHA detected | Browser opens automatically — solve manually and press Enter |
| CAPTCHA persists | Use staging URL or disable bot protection |
| Login required | Browser opens — log in manually and press Enter |
| Still on login page | Export cookies or use pre-authenticated staging URL |
| Figma MCP auth error | Re-authenticate via Figma MCP OAuth prompt |
| No Figma file access | Ask file owner to share with your Figma account |
| Playwright not found | `npm install -g playwright && npx playwright install chromium` |
| `node-id` not in URL | In Figma, right-click frame → "Copy link to selection" |
| Annotated screenshot markers in wrong position | Check that marker x/y match the element's `rect.x + rect.w/2, rect.y + rect.h/2` from styles.json |
| Screenshot too large for Figma embed | Drag `/tmp/design-qa-live-annotated.png` into Figma manually |
