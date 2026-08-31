#!/usr/bin/env node
/**
 * build-vercel.js
 *
 * Assembles the deployable site in `public/` — the output directory Vercel
 * looks for.
 *
 * The generated pages live in `webpages/` and reference assets as
 * `../assets/...` and `../images/...`, i.e. from the repo root. Flattening the
 * pages to the root of `public/` keeps those links working (a leading `../`
 * clamps at the site root) and makes `/` serve the landing page.
 *
 *   public/index.html          <- webpages/index.html
 *   public/publications.html   <- webpages/publications.html
 *   public/assets/ images/ files/
 *
 * Usage:  node scripts/build-vercel.js      (run after scripts/build-static.js)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PAGES = path.join(ROOT, 'webpages');
const OUT = path.join(ROOT, 'public');

// Top-level directories the pages link to, copied verbatim.
const ASSET_DIRS = ['assets', 'images', 'files'];

if (!fs.existsSync(PAGES)) {
  console.error(`No ${path.relative(ROOT, PAGES)}/ directory — run scripts/build-static.js first.`);
  process.exit(1);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const pages = fs.readdirSync(PAGES).filter((f) => f.endsWith('.html'));
for (const page of pages) {
  fs.copyFileSync(path.join(PAGES, page), path.join(OUT, page));
}

const copiedDirs = [];
for (const dir of ASSET_DIRS) {
  const from = path.join(ROOT, dir);
  if (!fs.existsSync(from)) continue;
  fs.cpSync(from, path.join(OUT, dir), { recursive: true });
  copiedDirs.push(dir);
}

if (!fs.existsSync(path.join(OUT, 'index.html'))) {
  console.error('No index.html was generated — public/ would have no landing page.');
  process.exit(1);
}

console.log(`public/: ${pages.length} pages (${pages.join(', ')})`);
console.log(`public/: asset directories ${copiedDirs.join(', ')}`);
