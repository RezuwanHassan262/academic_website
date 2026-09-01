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

if (!fs.existsSync(PAGES)) {
  console.error(`No ${path.relative(ROOT, PAGES)}/ directory — run scripts/build-static.js first.`);
  process.exit(1);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const pages = fs.readdirSync(PAGES).filter((f) => f.endsWith('.html'));
let rewritten = 0;

for (const page of pages) {
  const html = fs.readFileSync(path.join(PAGES, page), 'utf8');
  const flat = flattenAssetLinks(html);
  rewritten += flat.count;
  fs.writeFileSync(path.join(OUT, page), flat.html);
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
