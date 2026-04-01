# RULES FOR APP TO DESKTOP CONVERSION

## Constraints
- Desktop frames have a fixed width of 1440px
- Mobile frames have a fixed width of 375px
- All layouts are designed to fit these boundaries.
- **Maximize parallel operations**: Batch independent Figma tool calls into a single round. For example, creating 3 card frames, their child elements, and setting their properties should be done in as few rounds as possible — not one call at a time. If operations don't depend on each other's output, run them in parallel.
- **Child element coordinates are relative to the parent**: When using `create_frame`, `create_text`, or any creation tool with a `parentId`, the `x` and `y` values are **relative to the parent frame**, not absolute canvas coordinates. For example, to place a child 64px from the left edge of its parent, use `x=64` — not the parent's absolute canvas x plus 64.

---

## Catalog Structure

```
figma-catalog-web.json   // Web/Desktop component library
```

### File Structure

```json
{
  "fileKey": "ABC123",
  "fileName": "Global Design System (Web)",
  "lastUpdated": "2025-01-29T00:00:00Z",
  "webComponents": {
    "CATEGORY": {
      "ComponentName": {
        "description": "",
        "subTypes": {
          "VariantName": {
            "sizes": {
              "Large": {
                "componentKey": "abc123...",
                "figmaName": "Size=Large, Type=Primary, State=Normal",
                "states": {
                  "hover": "def456...",
                  "disabled": "ghi789..."
                }
              }
            }
          }
        }
      }
    }
  }
}
```

---

## Two Focuses

This system handles two distinct use cases:

### Focus 1: Component / Section Conversion (App → Desktop)

Designing a suitable desktop version of an app component or section (a group of elements smaller than a full frame). This is not just mechanical swapping — use UX knowledge and industry practices to create something that works well on desktop.

### Focus 2: Frame Conversion (App Frame → Web Frame)

Converting an entire app frame (screen) into a desktop web frame.

---

## Focus 1: Component / Section Conversion

### Workflow

1. **Read the node tree** using `get_node_info` for precise properties (positions, colors, sizes, text content). Skip any layers where `visible: false` — these are toggled off in Figma and should be ignored.
2. **Understand the purpose** — what does this component/section do? (e.g., category browsing card, action bar, product info section). Use this to inform your desktop design.
3. **Check the web catalog** for a matching component. If a match exists, use it.
4. **If no catalog match**, design a desktop-appropriate version using UX knowledge and industry practices. Consider:
   - How this type of component typically appears on desktop websites
   - Appropriate sizing, proportions, and spacing for desktop
   - Desktop interaction patterns (hover states, wider layouts, etc.)
5. **Preserve ALL visible elements** — text, shapes, images, icons. Nothing gets silently skipped. Only skip layers with `visible: false`.
6. **Preserve spatial relationships** — if a shape is behind text (background), it must remain as a background. Use z-order from the node tree to understand layering intent.
7. **Verify the result** — after building the desktop version, use `export_node_as_image` only once at the end to visually verify the output looks correct.

### Using the Web Catalog

When a catalog match exists:

1. **Parse the component type** from the instance name
   - Extract the key identifier: `"Chip"`, `"Button"`, `"Top Nav"`, etc.
   - Strip suffixes like `"- app/2. Component"` or `"- dWeb/2. Component"`

2. **Search the web catalog** for a matching component name
   - Example: `"Chip"` → found in `INPUT.Chip`

3. **Determine the variant** based on visual properties and instance name hints

4. **Create the instance** and transfer all properties (text content, states, colors)

### When No Catalog Match Exists

Design a desktop version informed by UX knowledge:

- **Understand the component's purpose** and how similar components work on desktop
- **Clone images and icons** from the source using `clone_node` — do not recreate them
- **Recreate text** with appropriate desktop sizing
- **Recreate shapes** (backgrounds, overlays) with correct spatial relationships
- **NEVER silently skip elements** — every visible part must be accounted for

---

## Focus 2: Frame Conversion

### Workflow

1. **Analyze** the source app frame using `get_node_info` to map the layer hierarchy.
2. **Build a low-fidelity wireframe in Figma** showing the proposed desktop layout using simple rectangles and text labels. This is fast and gives the user a spatial preview.
3. **Confirm with the user** that the wireframe layout is correct.
4. **Build the real frame** after approval — replace wireframe elements with actual web components from the catalog.

### Step 1: Analyze

- Recursively scan ALL children using `get_node_info`, not just components.
- Record the full tree structure including FRAME containers.
- Example structure:
  ```
  Small Test (FRAME)
  └── Frame 633498 (FRAME)
      ├── Header container (FRAME)
      │   └── Header (FRAME)
      │       └── Top Nav (INSTANCE)
      └── Tags container (FRAME)
          └── Tags row content (FRAME)
              ├── Add tag icon (INSTANCE)
              └── Chips... (INSTANCE)
  ```

### Step 2: Low-Fidelity Wireframe

Build a quick wireframe frame in Figma (1440px wide) using:
- **Rectangles** with light gray fill (`#E0E0E0`) to represent content areas and components
- **Text labels** inside or above rectangles to identify what each area represents (e.g., "Top Nav", "Product Image", "Add to Cart Button", "Chips Row")
- **Approximate sizing and positioning** to show the intended desktop layout
- Place the wireframe next to the source frame for easy comparison

The wireframe does NOT need to be pixel-perfect. Its purpose is to communicate layout intent quickly so the user can approve or adjust before real components are built.

### Step 3: Confirm

Ask the user to review the wireframe. Wait for approval before proceeding.

### Step 4: Build the Real Frame

After approval, build the actual desktop frame:

- **Replace wireframe rectangles** with real web components from the catalog.
- **Images**: Just duplicate/clone from the source frame and place them in the desktop frame. Do not analyze or recreate images.
- **Icons**: Clone the exact icon instance from the source frame using `clone_node`. NEVER create custom icons.
- **Text**: Recreate with appropriate desktop sizing.
- **Components**: Instantiate from the web catalog using `create_component_instance`.

### Frame Building Rules

#### Instance Handling
- When converting instances to desktop, if the instance cannot be edited directly (e.g., resizing internal elements, changing nested text styles), clone it using `clone_node` (with `parentId` to place it directly into the desktop frame), detach it using `detach_instance`, then edit the detached frame freely for desktop fit.

#### Container Structure
- Replicate the Figma layer hierarchy from the source. Do not "flat-map" components.
- Maintain parent-child relationships.
- **IMPORTANT**: Never flat-map components directly into the root frame.

#### Navigation
When creating a Desktop view, check the **NAVIGATION category** in the catalog and include relevant components (Navbar, Breadcrumb, Footer, Tabs, etc.) to complete the standard web page structure based on the page context.

#### Layout Specifications
- **Side margins**: 64px on left and right sides of desktop content.
- **Chip spacing**: Mobile = 8px, Desktop = 12px between chips.
- Containers and rows should be adjusted for desktop proportions.
- Never copy height/padding pixels directly from Mobile to Desktop. Parent containers must expand to accommodate Desktop component dimensions.
- **Buttons and interactive elements** should maintain natural sizing — do not stretch them to fill desktop width. Only containers and layout frames should expand.

#### Component Sizing
- **Container-Child Fit**: Before inserting components, verify the component width fits within the parent container.
- **Input/Picker Width**: Input fields and pickers should typically span the full width of their form container (minus any internal padding).
- **Overflow Check**: After inserting components, verify no overflow occurs that would clip content.

#### Auto Layout
- **CRITICAL**: If the mobile frame uses auto layout, the desktop frame MUST also use auto layout.
- When creating desktop containers, check if the corresponding mobile container has auto layout enabled using `get_node_info`.
- Apply auto layout to desktop containers using `set_auto_layout` with adapted settings:
  - Increase `itemSpacing` according to spacing rules (e.g., 8px → 12px for chips)
  - Adjust padding for desktop proportions
  - Match `layoutMode` (HORIZONTAL/VERTICAL) from the mobile frame, unless horizontal expansion applies
  - Match alignment settings (`primaryAxisAlignItems`, `counterAxisAlignItems`)

#### Horizontal Expansion
- **Desktop has 1312px usable content width** (1440px - 64px margins on each side).
- When mobile displays items in multiple rows due to width constraints, evaluate if desktop width allows a single-row layout.
- **Prefer horizontal layouts on desktop** when all items fit within the content width.

#### Images
- **Just duplicate** — clone images from the source frame using `clone_node` and place them in the desktop frame.
- Do not analyze, recreate, or reconstruct images.
- Maintain aspect ratio for: Images, Media Placeholders, Illustrations, Square/Circular components (Avatars, Square Ads).
- **Image scale mode**: When resizing image containers for desktop, ensure image fills use `FILL` scale mode (not `STRETCH`) so the image crops to fit while preserving its natural aspect ratio. If the source image uses `STRETCH`, change it to `FILL` after resizing to prevent distortion. You may adjust the container's width and height freely, but the image content itself must never appear compressed or stretched.
- **On overflow**: If maintaining aspect ratio causes overflow beyond 1440px, stop and ask the user.

#### Icon Handling
- **NEVER create custom icons or use substitutes.** Always clone the exact icon instance from the source frame using `clone_node`.
- Scale cloned icons proportionally based on container size changes.

#### Typography
- **Always use text styles from `figma-catalog-web.json`** when creating or recreating text in desktop frames.
- Look up the appropriate style name (e.g., `Desktop/H2 - Callout - 30`, `Desktop/Small - Reg - 14`) in the `textStyles` section of the catalog and apply it using `set_text_style_id` with the corresponding style ID.
- Match the text style to the text's role: headings use heading styles, body text uses body styles, captions use small styles, etc.
- **Do not manually set font family, size, or weight** when a matching text style exists in the catalog — always prefer applying the text style ID.

---

## Creative Liberty

By default, do faithful conversion (Focus 1 or Focus 2 workflows above). If the user explicitly asks for a redesign or reimagining (e.g., "reimagine this", "give me ideas", "creative insight", "draft a desktop version"), apply desktop-optimized layout patterns and offer multiple wireframe options in Figma for the user to choose from.

---

## Handling Ambiguity

When encountering any of the following, stop and ask the user:
- Aspect ratio causes overflow or excessive whitespace
- Component has no catalog equivalent and reconstruction approach is unclear
- Unclear whether footer should be included
- Any design decision with multiple valid interpretations
