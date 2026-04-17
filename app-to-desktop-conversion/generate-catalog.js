#!/usr/bin/env node
/**
 * Generates figma-catalog-app.json and figma-catalog-app-index.json
 * from extracted Figma batch data.
 *
 * Reads temp files:
 *   /tmp/figma_batch_1a.json - Buttons, Third-party
 *   /tmp/figma_batch_1b.json - Badge & Tag
 *   /tmp/figma_batch_2.json  - Navigation, Loading, Feedback, Overlay
 *   /tmp/figma_batch_3a_h1.json - Input (sets 0-15)
 *   /tmp/figma_batch_3a_h2.json - Input (sets 16+)
 *   /tmp/figma_batch_3a_sc.json - Input standalone components
 *   /tmp/figma_batch_3b.json - Filter chip, Tutorial, Chat
 *   /tmp/figma_batch_4.json  - Card, Activity, Ads, Listing, System, Pagination, Cover
 *     (or split: figma_batch_4a.json + figma_batch_4b.json)
 *
 * Optional text files for canvas documentation:
 *   /tmp/figma_text_*.json - TEXT nodes with absolute positions per page
 *
 * Optional notes file:
 *   ./component-notes.json - Manual composition notes
 *
 * Output:
 *   ./figma-catalog-app.json       - Full enriched catalog
 *   ./figma-catalog-app-index.json - Slim index for fast lookup
 */

const fs = require('fs');
const path = require('path');

// --- Configuration ---
const FILE_KEY = 'NmeAXg5CGWRbBtIqxVcf96';
const LIBRARY_NAME = 'App Components';

const PAGE_TO_CATEGORY = {
  'Buttons': 'BUTTONS',
  'Third-party Icon button': 'BUTTONS',
  '↪Third-party Icon button': 'BUTTONS',
  'Badge & Tag': 'BADGE_AND_TAG',
  'Navigation': 'NAVIGATION',
  'Loading': 'LOADING',
  'Feedback Indicator': 'FEEDBACK_INDICATORS',
  'Overlay': 'OVERLAYS',
  'Input': 'INPUT',
  'Filter chip (custom)': 'FILTER_CHIP',
  'Filter chip': 'FILTER_CHIP',
  '↪ Filter chip (custom)': 'FILTER_CHIP',
  'Tutorial': 'TUTORIAL',
  'Chat': 'CHAT',
  'Card': 'CARD',
  'Activity (notification)': 'ACTIVITY',
  'Ads': 'ADS',
  'Listing/Product Cards': 'LISTING_PRODUCT_CARDS',
  'System': 'SYSTEM',
  'Pagination': 'PAGINATION',
  'Cover': 'SPEECH_BUBBLE',
};

// --- Helpers ---

function tryReadJSON(filepath) {
  if (!fs.existsSync(filepath)) return null;
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

/** Parse component name from set name like "Normal Button - app /2.Component" → "Normal Button" */
function parseComponentName(setName) {
  let name = setName.replace(/\s*-\s*[Aa]pp\s*\/.*$/, '').trim();
  if (name.includes('/')) {
    const parts = name.split('/').map(s => s.trim());
    name = parts.filter(p => !['System'].includes(p)).join(' ');
  }
  return name;
}

/** Parse sub-type from set name like "Top Nav - app/2.Component/Search" → "Search" */
function parseSubType(setName) {
  const match = setName.match(/\/(\d+\.?\s*(?:Component|Micro|Micros?|Example))\s*\/?\s*(.*)$/i);
  if (match && match[2]) return match[2].trim();
  const segments = setName.split('/');
  if (segments.length >= 3) {
    const last = segments[segments.length - 1].trim();
    if (!/^\d+\./.test(last)) return last;
  }
  return null;
}

/** Parse variant string "Size=Large, Type=Primary, State=Normal" → {Size:"Large", ...} */
function parseVariantProps(variantName) {
  const props = {};
  const pairs = variantName.split(',').map(s => s.trim());
  for (const pair of pairs) {
    const eqIdx = pair.indexOf('=');
    if (eqIdx > 0) {
      props[pair.slice(0, eqIdx).trim()] = pair.slice(eqIdx + 1).trim();
    }
  }
  return props;
}

function isDefaultState(val) {
  const v = val.toLowerCase();
  return v === 'normal' || v === 'default' || v === 'enabled' ||
         v === 'unselected-enabled' || v === 'false';
}

// --- File Loading ---

function loadBatchFiles() {
  const pages = [];

  // Load split batch 1
  for (const file of ['figma_batch_1a.json', 'figma_batch_1b.json']) {
    const data = tryReadJSON(path.join('/tmp', file));
    if (data) pages.push(...data);
  }

  // Load batch 2
  const b2 = tryReadJSON('/tmp/figma_batch_2.json');
  if (b2) pages.push(...b2);

  // Load batch 3b
  const b3b = tryReadJSON('/tmp/figma_batch_3b.json');
  if (b3b) pages.push(...b3b);

  // Load batch 4 (single or split)
  const b4 = tryReadJSON('/tmp/figma_batch_4.json');
  if (b4) {
    pages.push(...b4);
  } else {
    for (const file of ['figma_batch_4a.json', 'figma_batch_4b.json']) {
      const data = tryReadJSON(path.join('/tmp', file));
      if (data) pages.push(...data);
    }
  }

  // Fallback: also try old batch 1 format
  if (!tryReadJSON('/tmp/figma_batch_1a.json')) {
    const b1 = tryReadJSON('/tmp/figma_batch_1.json');
    if (b1) pages.push(...b1);
  }

  // Load Input page (split into two halves + standalone components)
  const h1 = tryReadJSON('/tmp/figma_batch_3a_h1.json');
  const h2 = tryReadJSON('/tmp/figma_batch_3a_h2.json');
  const sc = tryReadJSON('/tmp/figma_batch_3a_sc.json');
  if (h1) {
    pages.push({ page: 'Input', sets: [...h1, ...(h2 || [])], sc: sc || [] });
  }

  return pages;
}

function loadTextFiles() {
  const textByPage = {};
  const tmpDir = '/tmp';
  try {
    const files = fs.readdirSync(tmpDir).filter(f => f.startsWith('figma_text_') && f.endsWith('.json'));
    for (const file of files) {
      const data = tryReadJSON(path.join(tmpDir, file));
      if (data && data.page) {
        textByPage[data.page] = data.texts || [];
      }
    }
  } catch (e) { /* no text files yet */ }
  return textByPage;
}

function loadComponentNotes() {
  const notesPath = path.join(__dirname, 'component-notes.json');
  return tryReadJSON(notesPath) || {};
}

// --- Text Matching ---

function matchDescriptionsForSet(set, pageTexts) {
  if (!pageTexts || pageTexts.length === 0 || !set.sy) return null;

  // Find text nodes within ±100px Y-range of the component set's position
  const nearby = pageTexts.filter(t =>
    Math.abs(t.absY - set.sy) < 100 &&
    t.text.length > 20 // Only meaningful descriptions
  );

  if (nearby.length === 0) return null;

  // Prefer text that's to the right of the component (description column)
  const descriptions = nearby
    .filter(t => t.absX > (set.sx || 0))
    .sort((a, b) => a.absY - b.absY);

  return descriptions.length > 0 ? descriptions[0].text : nearby[0].text;
}

// --- Variant Processing ---

function buildVariantStructure(variants) {
  if (!variants || variants.length === 0) {
    return { hasSizes: false, variants: {} };
  }

  const parsed = variants.map(v => ({
    props: parseVariantProps(v.n),
    key: v.k,
    name: v.n,
    w: v.w || null,
    h: v.h || null
  }));

  const hasSize = parsed.some(v => v.props.Size || v.props['Title size']);
  const hasState = parsed.some(v => v.props.State || v.props.Status);
  const hasType = parsed.some(v => v.props.Type);

  if (hasSize) {
    return buildSizeStructure(parsed);
  } else if (hasState || hasType) {
    return buildStateStructure(parsed);
  } else {
    return {
      hasSizes: false,
      variants: Object.fromEntries(parsed.map(v => [
        v.name,
        { componentKey: v.key, figmaName: v.name, width: v.w, height: v.h }
      ]))
    };
  }
}

function buildSizeStructure(parsed) {
  const sizes = {};

  for (const v of parsed) {
    const size = v.props.Size || v.props['Title size'] || 'Default';
    const stateVal = v.props.State || v.props.Status || null;

    if (!sizes[size]) {
      sizes[size] = { componentKey: null, figmaName: null, width: null, height: null, states: {} };
    }

    if (!stateVal || isDefaultState(stateVal)) {
      if (!sizes[size].componentKey) {
        sizes[size].componentKey = v.key;
        sizes[size].figmaName = v.name;
        sizes[size].width = v.w;
        sizes[size].height = v.h;
      }
    } else {
      sizes[size].states[stateVal] = v.key;
    }
  }

  for (const size of Object.keys(sizes)) {
    if (!sizes[size].componentKey && parsed.length > 0) {
      const first = parsed.find(v => (v.props.Size || v.props['Title size']) === size);
      if (first) {
        sizes[size].componentKey = first.key;
        sizes[size].figmaName = first.name;
        sizes[size].width = first.w;
        sizes[size].height = first.h;
      }
    }
    if (Object.keys(sizes[size].states).length === 0) delete sizes[size].states;
  }

  return { hasSizes: true, sizes };
}

function buildStateStructure(parsed) {
  const result = { componentKey: null, figmaName: null, width: null, height: null, states: {} };

  for (const v of parsed) {
    const stateVal = v.props.State || v.props.Status || v.props.Type || null;
    if (!stateVal || isDefaultState(stateVal)) {
      if (!result.componentKey) {
        result.componentKey = v.key;
        result.figmaName = v.name;
        result.width = v.w;
        result.height = v.h;
      }
    } else {
      result.states[stateVal] = v.key;
    }
  }

  if (!result.componentKey && parsed.length > 0) {
    result.componentKey = parsed[0].key;
    result.figmaName = parsed[0].name;
    result.width = parsed[0].w;
    result.height = parsed[0].h;
  }

  if (Object.keys(result.states).length === 0) delete result.states;

  return { hasSizes: false, variants: { Default: result } };
}

// --- Main Processing ---

function processPages(pages, textByPage) {
  const catalog = {};

  for (const page of pages) {
    const pageName = page.page.replace(/^↪\s*/, '').trim();
    const category = PAGE_TO_CATEGORY[pageName] || PAGE_TO_CATEGORY[page.page];
    if (!category) {
      console.warn(`No category mapping for page: "${page.page}" (cleaned: "${pageName}")`);
      continue;
    }
    if (!catalog[category]) catalog[category] = {};

    const pageTexts = textByPage[pageName] || [];

    const seenSets = new Set();
    for (const set of (page.sets || [])) {
      const dedupeKey = set.n + '|' + (set.v[0]?.k || '');
      if (seenSets.has(dedupeKey)) continue;
      seenSets.add(dedupeKey);

      const compName = parseComponentName(set.n);
      const subType = parseSubType(set.n);

      if (!catalog[category][compName]) {
        catalog[category][compName] = { description: set.d || '', subTypes: {} };
      }

      // Try to match canvas documentation text
      const canvasDesc = matchDescriptionsForSet(set, pageTexts);
      if (canvasDesc && !catalog[category][compName].canvasDescription) {
        catalog[category][compName].canvasDescription = canvasDesc;
      }

      const variantData = buildVariantStructure(set.v);
      const subTypeName = subType || 'Default';
      if (!catalog[category][compName].subTypes[subTypeName]) {
        catalog[category][compName].subTypes[subTypeName] = {};
      }

      const target = catalog[category][compName].subTypes[subTypeName];
      if (variantData.hasSizes) {
        if (!target.sizes) target.sizes = {};
        Object.assign(target.sizes, variantData.sizes);
      } else {
        if (!target.variants) target.variants = {};
        Object.assign(target.variants, variantData.variants);
      }
    }

    for (const sc of (page.sc || [])) {
      const compName = parseComponentName(sc.n);
      if (!catalog[category][compName]) {
        catalog[category][compName] = {
          description: sc.d || '',
          componentKey: sc.k,
          figmaName: sc.n,
          width: sc.w || null,
          height: sc.h || null
        };
      }
    }
  }

  return catalog;
}

// --- Index Generation ---

function buildIndex(catalog, notes) {
  const index = {};

  for (const [category, components] of Object.entries(catalog)) {
    index[category] = {};

    for (const [compName, comp] of Object.entries(components)) {
      const entry = {
        description: comp.canvasDescription || comp.description || '',
        defaultKey: null,
        defaultSize: null,
        subTypes: [],
        notes: notes[compName] || null
      };

      if (comp.componentKey) {
        // Standalone component
        entry.defaultKey = comp.componentKey;
        entry.defaultSize = (comp.width && comp.height) ? { w: comp.width, h: comp.height } : null;
      } else if (comp.subTypes) {
        entry.subTypes = Object.keys(comp.subTypes);

        // Find first default key + size
        for (const sub of Object.values(comp.subTypes)) {
          if (entry.defaultKey) break;

          if (sub.sizes) {
            // Prefer Medium, then first available
            const preferred = sub.sizes['Medium'] || sub.sizes[Object.keys(sub.sizes)[0]];
            if (preferred) {
              entry.defaultKey = preferred.componentKey;
              entry.defaultSize = (preferred.width && preferred.height)
                ? { w: preferred.width, h: preferred.height }
                : null;
              entry.availableSizes = Object.keys(sub.sizes);
            }
          } else if (sub.variants) {
            const firstVariant = sub.variants['Default'] || sub.variants[Object.keys(sub.variants)[0]];
            if (firstVariant) {
              entry.defaultKey = firstVariant.componentKey;
              entry.defaultSize = (firstVariant.width && firstVariant.height)
                ? { w: firstVariant.width, h: firstVariant.height }
                : null;
            }
          }
        }
      }

      index[category][compName] = entry;
    }
  }

  return index;
}

// --- Execute ---

console.log('Loading batch files...');
const pages = loadBatchFiles();
console.log(`Loaded ${pages.length} pages`);

console.log('Loading text files...');
const textByPage = loadTextFiles();
console.log(`Loaded text for ${Object.keys(textByPage).length} pages`);

console.log('Loading component notes...');
const notes = loadComponentNotes();
console.log(`Loaded ${Object.keys(notes).length} notes`);

console.log('Processing pages into catalog...');
const appComponents = processPages(pages, textByPage);

const categoryCount = Object.keys(appComponents).length;
let componentCount = 0;
for (const cat of Object.values(appComponents)) {
  componentCount += Object.keys(cat).length;
}
console.log(`Generated ${categoryCount} categories with ${componentCount} components`);

// Write full catalog
const output = {
  fileKey: FILE_KEY,
  libraryName: LIBRARY_NAME,
  lastUpdated: new Date().toISOString(),
  appComponents
};

const outputPath = path.join(__dirname, 'figma-catalog-app.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`Full catalog: ${outputPath} (${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`);

// Write index
console.log('Building index...');
const indexData = {
  fileKey: FILE_KEY,
  libraryName: LIBRARY_NAME,
  lastUpdated: new Date().toISOString(),
  components: buildIndex(appComponents, notes)
};

const indexPath = path.join(__dirname, 'figma-catalog-app-index.json');
fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
console.log(`Index: ${indexPath} (${(fs.statSync(indexPath).size / 1024).toFixed(1)} KB)`);
