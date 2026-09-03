#!/usr/bin/env node
/**
 * build-site.js
 *
 * Assembles the deployable site in `public/`. Used by both hosts:
 * Vercel (see vercel.json) and GitHub Pages (see .github/workflows/pages.yml).
 *
 * `scripts/build-static.js` writes the pages into `webpages/` and links assets
 * as `../assets/...` / `../images/...`, because the local preview serves the
 * repo root and the pages sit one directory down. Here the pages are flattened
 * to the root of `public/`, so those prefixes are rewritten to plain relative
 * paths:
 *
 *   public/index.html          <- webpages/index.html   (../assets -> assets)
 *   public/publications.html   <- webpages/publications.html
 *   public/assets/ images/ files/
 *
 * Relative rather than absolute (`/assets/...`) because GitHub Pages serves
 * this repo under `/academic_website/`, while Vercel serves it at `/`. A plain
 * `assets/css/main.css` resolves correctly under both; a leading `/` or `../`
 * would not.
 *
 * Usage:  node scripts/build-static.js && node scripts/build-site.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PAGES = path.join(ROOT, 'webpages');
const OUT = path.join(ROOT, 'public');

// Top-level directories the pages link to, copied verbatim.
const ASSET_DIRS = ['assets', 'images', 'files'];

// `../assets/x` -> `assets/x`, now that the pages sit alongside those
// directories instead of one level below.
//
// Plain string replacement, NOT a regex. The previous version built the
// pattern in a template literal, where `.` is not a recognised escape and
// collapses to a bare `.` — so `../` became "any two characters then a
// slash" and silently ate three characters out of every URL that happened
// to contain one, e.g. .../sites/default/files/ -> .../sites/defaufiles/.
function flattenAssetLinks(html) {
  let out = html;
  let count = 0;
  for (const dir of ASSET_DIRS) {
    const parts = out.split("../" + dir + "/");
    count += parts.length - 1;
    out = parts.join(dir + "/");
  }
  return { html: out, count: count };
}

/* ---------------------------------------------------------------------------
 * Google Scholar stats, baked in at build time
 *
 * _data/scholar.json is refreshed daily by scripts/scholarScraper.js. The
 * numbers are substituted into the card here, so the visitor's browser never
 * contacts Google: no CORS, no API key in the client, no spinner that can hang.
 * If the file is missing or unreadable the pages ship exactly as authored,
 * still showing the last values committed to webpages/.
 *
 * The card markup carries data-scholar="<key>" on each element to fill.
 * ------------------------------------------------------------------------ */

const SCHOLAR_DATA_FILE = path.join(ROOT, '_data', 'scholar.json');

function readScholarData() {
  if (!fs.existsSync(SCHOLAR_DATA_FILE)) {
    console.warn('  scholar: _data/scholar.json not found — leaving the card as authored');
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(SCHOLAR_DATA_FILE, 'utf8'));
  } catch (e) {
    console.warn('  scholar: _data/scholar.json is not valid JSON (' + e.message + ') — leaving the card as authored');
    return null;
  }
}

// Replaces the text inside every element tagged data-scholar="<key>".
// Deliberately narrow: it rewrites only the run of text between that element's
// opening tag and the next `<`, so the rest of the page stays byte-for-byte
// as authored.
function fillMarked(html, key, text) {
  const re = new RegExp('(<[a-zA-Z]+[^>]*data-scholar="' + key + '"[^>]*>)([^<]*)(</)', 'g');
  let count = 0;
  const out = html.replace(re, (_match, open, _inner, close) => {
    count += 1;
    return open + text + close;
  });
  return { html: out, count: count };
}

function injectScholarStats(html, data) {
  if (!data) return { html: html, count: 0 };

  // The five-year keys are composed at runtime from sinceYear, because Google's
  // second column is the current year minus five and rolls over each January.
  // Each metric falls back to the all-time figure and then to zero, so a
  // malformed or half-migrated file still renders real numbers rather than a
  // row of zeros. Do not collapse this chain.
  const sinceYear = data.sinceYear || '2021';
  const citations = data['citationsSince' + sinceYear] ?? data.citations ?? 0;
  const hIndex = data['hIndexSince' + sinceYear] ?? data.hIndex ?? 0;
  const i10Index = data['i10IndexSince' + sinceYear] ?? data.i10Index ?? 0;

  const fields = {
    citations: String(data.citations ?? 0),
    hIndex: String(data.hIndex ?? 0),
    i10Index: String(data.i10Index ?? 0),
    citationsSince: citations + ' since ' + sinceYear,
    hIndexSince: hIndex + ' since ' + sinceYear,
    i10IndexSince: i10Index + ' since ' + sinceYear,
    note: 'The stats are automatically scraped and synced with Google Scholar every 24 hours.'
      + (data.lastUpdated ? ' Last updated ' + data.lastUpdated + '.' : ''),
  };

  let out = html;
  let total = 0;
  for (const key of Object.keys(fields)) {
    const result = fillMarked(out, key, fields[key]);
    out = result.html;
    total += result.count;
  }
  return { html: out, count: total };
}

if (!fs.existsSync(PAGES)) {
  console.error(`No ${path.relative(ROOT, PAGES)}/ directory — run scripts/build-static.js first.`);
  process.exit(1);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const pages = fs.readdirSync(PAGES).filter((f) => f.endsWith('.html'));
const scholar = readScholarData();
let rewritten = 0;
let scholarFilled = 0;

for (const page of pages) {
  const html = fs.readFileSync(path.join(PAGES, page), 'utf8');
  const flat = flattenAssetLinks(html);
  rewritten += flat.count;
  const withStats = injectScholarStats(flat.html, scholar);
  scholarFilled += withStats.count;
  fs.writeFileSync(path.join(OUT, page), withStats.html);
}

const copiedDirs = [];
for (const dir of ASSET_DIRS) {
  const from = path.join(ROOT, dir);
  if (!fs.existsSync(from)) continue;
  fs.cpSync(from, path.join(OUT, dir), { recursive: true });
  copiedDirs.push(dir);
}

// GitHub Pages must not run its own Jekyll pass over the assembled output.
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

if (!fs.existsSync(path.join(OUT, 'index.html'))) {
  console.error('No index.html was generated — public/ would have no landing page.');
  process.exit(1);
}

// A stale `../` would 404 under a project Pages URL, so fail loudly instead.
const leftovers = pages.filter((p) => /\.\.\//.test(fs.readFileSync(path.join(OUT, p), 'utf8')));
if (leftovers.length) {
  console.error(`Unrewritten parent-relative links in: ${leftovers.join(', ')}`);
  process.exit(1);
}

console.log(`public/: ${pages.length} pages, ${rewritten} asset links rewritten`);
console.log(`public/: asset directories ${copiedDirs.join(', ')}`);
console.log(`public/: ${scholarFilled} Scholar stat fields filled from _data/scholar.json`
  + (scholar && scholar.lastUpdated ? ` (last updated ${scholar.lastUpdated})` : ''));
