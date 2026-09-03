#!/usr/bin/env node
/**
 * scholarScraper.js
 *
 * Fetches citation count, h-index and i10-index for one Google Scholar profile
 * and writes them to _data/scholar.json, which scripts/build-site.js bakes into
 * the published pages. Nothing is fetched in the visitor's browser.
 *
 * Three independent methods are tried in order, stopping at the first success:
 *
 *   1. SerpAPI            — needs SERPAPI_KEY; skipped silently when unset.
 *   2. scholarly (Python) — shells out to scripts/fetch_scholar.py.
 *   3. Direct HTTPS       — scrapes the profile page; often blocked, last resort.
 *
 * THE RULE THIS FILE EXISTS TO ENFORCE: a failed scrape is a no-op. When every
 * method fails the output file is left byte-for-byte untouched — no zeros, no
 * nulls, no half-written object — and the process exits 1 so CI goes red.
 *
 * Usage:  node scripts/scholarScraper.js     (or: npm run update-scholar)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const zlib = require('zlib');
const { exec } = require('child_process');

const cheerio = require('cheerio');

/* ---------------------------------------------------------------------------
 * Configuration
 *
 * The profile is identified here and nowhere else. To point this at a
 * different Scholar profile, change this one line (and the matching constant
 * at the top of scripts/fetch_scholar.py).
 * ------------------------------------------------------------------------ */

const SCHOLAR_AUTHOR_ID = 'ZUrWZhQAAAAJ';

const OUTPUT_FILE = path.join(__dirname, '..', '_data', 'scholar.json');
const PYTHON_HELPER = path.join(__dirname, 'fetch_scholar.py');

// Google's second column is "current year minus five", so it rolls over every
// January. This is only the fallback for when a method cannot tell us the year.
const DEFAULT_SINCE_YEAR = '2021';

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:122.0) Gecko/20100101 Firefox/122.0',
];

/* ---------------------------------------------------------------------------
 * Small helpers
 * ------------------------------------------------------------------------ */

const log = (msg) => console.log(msg);
const warn = (msg) => console.warn(msg);

// Scholar prints large counts as "1,234".
function toInt(value) {
  const n = parseInt(String(value === undefined || value === null ? '' : value).replace(/,/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Assembles the payload every method returns.
 *
 * The five-year keys are BUILT, never typed: Google's "since" column tracks the
 * current year minus five, so a hardcoded `citationsSince2021` would quietly
 * stop matching reality one January.
 */
function buildResult(values) {
  const year = String(values.sinceYear || DEFAULT_SINCE_YEAR);
  return {
    citations: toInt(values.citations),
    ['citationsSince' + year]: toInt(values.citationsSince),
    hIndex: toInt(values.hIndex),
    ['hIndexSince' + year]: toInt(values.hIndexSince),
    i10Index: toInt(values.i10Index),
    ['i10IndexSince' + year]: toInt(values.i10IndexSince),
    sinceYear: year,
    lastUpdated: new Date().toISOString().split('T')[0],
  };
}

/**
 * Guards the "never write zeros over good data" rule.
 *
 * A method that technically parsed something but produced an all-zero profile
 * has almost certainly read a block page or an empty shell, so it is treated as
 * a failure and the next method gets a turn. A genuinely uncited profile is the
 * one false positive here, and for that case seeding the file by hand is the
 * right answer rather than letting a scrape zero out real numbers.
 */
function isPlausible(data) {
  const year = data.sinceYear;
  const keys = ['citations', 'hIndex', 'i10Index', 'citationsSince' + year, 'hIndexSince' + year, 'i10IndexSince' + year];
  for (const k of keys) {
    if (!Number.isInteger(data[k]) || data[k] < 0) return 'field ' + k + ' is not a non-negative integer (got ' + JSON.stringify(data[k]) + ')';
  }
  if (data.citations === 0 && data.hIndex === 0 && data.i10Index === 0) {
    return 'every all-time metric came back 0, which reads as a blocked or empty page rather than real data';
  }
  return null;
}

/* ---------------------------------------------------------------------------
 * HTTPS with the decompression the request headers promise to handle
 * ------------------------------------------------------------------------ */

function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { headers: headers || {} }, (res) => {
      const status = res.statusCode;

      // A redirect from Scholar means a consent or block page, never the data.
      if (status >= 300 && status < 400 && res.headers.location) {
        res.resume();
        reject(new Error('HTTP ' + status + ' redirect to ' + res.headers.location + ' (Google is bouncing us to a consent or block page, not the profile)'));
        return;
      }
      if (status !== 200) {
        res.resume();
        reject(new Error('HTTP ' + status + ' (expected 200)'));
        return;
      }

      // We advertised gzip/deflate/br, so we have to actually decode it.
      // Skipping this yields binary garbage and a baffling parse error.
      const encoding = String(res.headers['content-encoding'] || '').toLowerCase();
      let stream = res;
      if (encoding === 'gzip') stream = res.pipe(zlib.createGunzip());
      else if (encoding === 'deflate') stream = res.pipe(zlib.createInflate());
      else if (encoding === 'br') stream = res.pipe(zlib.createBrotliDecompress());

      const chunks = [];
      stream.on('data', (c) => chunks.push(c));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      stream.on('error', (e) => reject(new Error('Failed to decompress a ' + (encoding || 'plain') + ' response: ' + e.message)));
    });

    request.on('error', (e) => reject(new Error('Request failed: ' + e.message)));
    request.setTimeout(45000, () => {
      request.destroy();
      reject(new Error('Request timed out after 45s'));
    });
  });
}

/* ---------------------------------------------------------------------------
 * Method 1 — SerpAPI
 * ------------------------------------------------------------------------ */

async function fetchFromSerpApi() {
  const key = process.env.SERPAPI_KEY;
  if (!key) {
    log('  [1/3] SerpAPI      : skipped (SERPAPI_KEY is not set — this is normal, not an error)');
    return null;
  }

  log('  [1/3] SerpAPI      : requesting...');
  const url = 'https://serpapi.com/search.json?engine=google_scholar_author'
    + '&author_id=' + encodeURIComponent(SCHOLAR_AUTHOR_ID)
    + '&api_key=' + encodeURIComponent(key);

  const raw = await httpsGet(url, { Accept: 'application/json' });

  let json;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    throw new Error('response was not JSON: ' + e.message);
  }

  // SerpAPI fails with HTTP 200 and an `error` field — out of credits, bad key.
  if (json.error) throw new Error('SerpAPI returned an error field: ' + json.error);

  const citedBy = json.cited_by;
  if (!citedBy || !Array.isArray(citedBy.table)) {
    throw new Error('no cited_by.table in the response (top-level keys received: ' + Object.keys(json).join(', ') + ')');
  }

  const table = citedBy.table;
  const citations = table[0] && table[0].citations;
  const hIndex = table[1] && table[1].h_index;
  const i10Index = table[2] && table[2].i10_index;

  if (!citations || !hIndex || !i10Index) {
    const shape = table.map((entry, i) => i + ':' + Object.keys(entry || {}).join('+')).join(', ');
    throw new Error('cited_by.table was not [citations, h_index, i10_index] (entries received: ' + (shape || '<empty>') + ')');
  }

  // Learn the year from the data rather than assuming it.
  const sinceKey = Object.keys(citations).find((k) => k.indexOf('since_') === 0);
  const year = sinceKey ? sinceKey.slice('since_'.length) : DEFAULT_SINCE_YEAR;
  const since = (obj) => (sinceKey && obj[sinceKey] !== undefined ? obj[sinceKey] : obj.all);

  return buildResult({
    citations: citations.all,
    citationsSince: since(citations),
    hIndex: hIndex.all,
    hIndexSince: since(hIndex),
    i10Index: i10Index.all,
    i10IndexSince: since(i10Index),
    sinceYear: year,
  });
}

/* ---------------------------------------------------------------------------
 * Method 2 — the scholarly Python library
 * ------------------------------------------------------------------------ */

function runPython(command) {
  return new Promise((resolve) => {
    exec(command + ' "' + PYTHON_HELPER + '"', { timeout: 90000, maxBuffer: 4 * 1024 * 1024, env: process.env },
      (error, stdout, stderr) => resolve({ error, stdout: stdout || '', stderr: stderr || '' }));
  });
}

async function fetchFromScholarly() {
  log('  [2/3] scholarly    : running ' + path.basename(PYTHON_HELPER) + '...');

  if (!fs.existsSync(PYTHON_HELPER)) throw new Error('helper script is missing at ' + PYTHON_HELPER);

  // python3 first; on most Windows machines that is not a command, and the
  // shell reports 127 — retry as `python` before giving up.
  let result = await runPython('python3');
  if (result.error && result.error.code === 127) {
    log('        python3 not found (exit 127) — retrying as `python`');
    result = await runPython('python');
  }

  if (result.stderr.trim()) {
    result.stderr.trim().split('\n').forEach((line) => log('        [py] ' + line));
  }

  if (result.error) {
    const code = result.error.code;
    if (code === 2) throw new Error('the `scholarly` package is not installed (helper exited 2)');
    if (code === 127) throw new Error('neither `python3` nor `python` is on PATH');
    if (result.error.killed) throw new Error('helper timed out after 90s');
    throw new Error('helper exited ' + code + (result.stderr.trim() ? ': ' + result.stderr.trim().split('\n').pop() : ''));
  }

  let json;
  try {
    json = JSON.parse(result.stdout.trim());
  } catch (e) {
    throw new Error('helper stdout was not JSON (' + e.message + '); received: ' + JSON.stringify(result.stdout.slice(0, 200)));
  }

  return buildResult({
    citations: json.citations,
    citationsSince: json.citationsSince,
    hIndex: json.hIndex,
    hIndexSince: json.hIndexSince,
    i10Index: json.i10Index,
    i10IndexSince: json.i10IndexSince,
    sinceYear: json.sinceYear,
  });
}

/* ---------------------------------------------------------------------------
 * Method 3 — scraping the profile page directly
 * ------------------------------------------------------------------------ */

class CaptchaError extends Error {}

function looksLikeBotBlock(html, $) {
  const needles = ['gs_captcha', 'gsc_captcha', 'unusual traffic', 'automated requests'];
  const haystack = html.toLowerCase();
  for (const needle of needles) {
    if (haystack.indexOf(needle.toLowerCase()) !== -1) return 'page contains "' + needle + '"';
  }
  let found = null;
  $('form').each((_, el) => {
    const action = String($(el).attr('action') || '');
    if (action.indexOf('sorry') !== -1) found = 'page has a form posting to "' + action + '"';
  });
  return found;
}

async function fetchByScraping() {
  // Jitter, so repeated CI runs do not hit Google on a metronome.
  const pause = 1000 + Math.floor(Math.random() * 3000);
  log('  [3/3] direct scrape: waiting ' + (pause / 1000).toFixed(1) + 's, then fetching the profile page...');
  await sleep(pause);

  const url = 'https://scholar.google.com/citations?user=' + encodeURIComponent(SCHOLAR_AUTHOR_ID) + '&hl=en';
  const html = await httpsGet(url, {
    'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    Connection: 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
  });

  const $ = cheerio.load(html);

  const blocked = looksLikeBotBlock(html, $);
  if (blocked) throw new CaptchaError('Google served a CAPTCHA or block page (' + blocked + ')');

  // These selectors track Google's current markup for the stats table on a
  // profile page. If this method starts failing while the page loads fine in a
  // browser, THIS IS THE FIRST THING TO CHECK — compare against a fresh
  // "view source" of the profile.
  const rows = $('#gsc_rsb_st tbody tr');
  if (rows.length < 3) {
    throw new Error('expected at least 3 rows in #gsc_rsb_st, found ' + rows.length
      + ' (either the page structure changed or this was a block page)');
  }

  const header = $('#gsc_rsb_st thead tr th').eq(2).text();
  const yearMatch = header.match(/Since (\d{4})/);
  const year = yearMatch ? yearMatch[1] : DEFAULT_SINCE_YEAR;

  const cell = (rowIndex, tdIndex) => $(rows[rowIndex]).find('td').eq(tdIndex).text();

  return buildResult({
    citations: cell(0, 1),
    citationsSince: cell(0, 2),
    hIndex: cell(1, 1),
    hIndexSince: cell(1, 2),
    i10Index: cell(2, 1),
    i10IndexSince: cell(2, 2),
    sinceYear: year,
  });
}

/* ---------------------------------------------------------------------------
 * Driver
 * ------------------------------------------------------------------------ */

const METHODS = [
  { name: 'SerpAPI', run: fetchFromSerpApi },
  { name: 'scholarly (Python)', run: fetchFromScholarly },
  { name: 'direct page scrape', run: fetchByScraping },
];

async function main() {
  log('Google Scholar stats — profile ' + SCHOLAR_AUTHOR_ID);
  log('Output: ' + path.relative(path.join(__dirname, '..'), OUTPUT_FILE));
  log('');

  let data = null;
  let winner = null;

  for (const method of METHODS) {
    try {
      const result = await method.run();
      if (!result) continue;

      const problem = isPlausible(result);
      if (problem) {
        warn('        rejected: ' + problem);
        continue;
      }

      data = result;
      winner = method.name;
      break;
    } catch (e) {
      const label = e instanceof CaptchaError ? 'blocked' : 'failed';
      warn('        ' + label + ': ' + e.message);
    }
  }

  log('');

  if (!data) {
    console.error('All three methods failed — no data was obtained.');
    if (fs.existsSync(OUTPUT_FILE)) {
      console.error('Leaving the existing ' + path.basename(OUTPUT_FILE) + ' exactly as it was; the site keeps showing the last known good numbers.');
    } else {
      console.error('No existing ' + path.basename(OUTPUT_FILE) + ' to preserve. Seed it by hand from the profile page.');
    }
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2) + '\n');

  log('Success via ' + winner + '.');
  log(JSON.stringify(data, null, 2));
}

main().catch((e) => {
  console.error('Unexpected error: ' + (e && e.stack ? e.stack : e));
  console.error('Nothing was written.');
  process.exit(1);
});
