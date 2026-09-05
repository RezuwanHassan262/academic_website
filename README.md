# Md. Rezuwan Hassan — Academic Website

Personal academic site: publications, projects, talks, teaching, adjudications,
awards, volunteering and interests.

**Live:** <https://rezuwanhassan262.github.io/academic_website/>

<a href="https://mapmyvisitors.com/web/1c808" title="Visitor map"><img src="https://mapmyvisitors.com/map.png?d=oZ7twHnHRCM2pyNbeV_7e1COrf67qUQgkA9FCDx-HgA&cl=ffffff" alt="Visitor map" /></a>

> The map above records views of **this README**, not of the live site — the
> counter registers a hit wherever the image is loaded. See
> [Visitor tracking](#visitor-tracking) for what that means and how to change it.

---

## How the site is built

There is **no framework and no bundler in the page pipeline**. The pages are
plain, hand-maintained HTML.

```
webpages/*.html   the site — the source of truth, edited by hand
      |
      |  scripts/build-site.js
      v
public/           what gets deployed (git-ignored, rebuilt every deploy)
```

`scripts/build-site.js` is the entire build. It:

1. copies each page from `webpages/` to the root of `public/`,
2. rewrites `../assets|images|files/…` to plain relative paths so the same
   output works both at `/` (Vercel) and under `/academic_website/` (GitHub
   Pages),
3. substitutes the Google Scholar figures into any element tagged
   `data-scholar="…"`,
4. copies `assets/`, `images/` and `files/`, and writes `.nojekyll`.

It fails loudly rather than shipping something broken: a missing `index.html`
or a leftover `../` reference aborts the build.

### Editing content

Edit the HTML in `webpages/` directly. That is what ships.

> [!WARNING]
> `scripts/build-static.js` **regenerates `webpages/` from the Jekyll sources
> and will overwrite anything edited in the HTML by hand.** It is not part of
> any deploy and is not run by `npm start`. Only run it deliberately, after
> porting your edits back into `_pages/`, `_data/` and the collections — the
> script prints a warning to that effect when it starts.

The Jekyll directories (`_layouts/`, `_includes/`, `_sass/`, `_pages/`,
`_publications/`, `_portfolio/`, `_talks/`, `_teaching/`) are the historical
source. `_data/` is still live: `_data/scholar.json` feeds the stats card.

## Running locally

```bash
npm install
npm start          # serves the repo root; open webpages/index.html
```

To preview exactly what will be deployed:

```bash
node scripts/build-site.js
# then open public/index.html
```

`npm start` only serves — it does not regenerate anything.

## Deployment

Two hosts serve the same `public/` output.

| Host | Trigger | Config |
|------|---------|--------|
| GitHub Pages | push to `main`, plus `workflow_call` | `.github/workflows/pages.yml` |
| Vercel | git webhook on push | `vercel.json` |

Both run `node scripts/build-site.js` and nothing else.

`pages.yml` accepts an optional `ref` input. A workflow that has just pushed a
commit must pass its branch, because `actions/checkout` otherwise resolves to
the SHA the run *started* at — which predates that commit, and would deploy
stale content.

## Google Scholar statistics

The citation count, h-index and i10-index on the Publications page and in the
compact strip on the About page are refreshed automatically from
[this profile](https://scholar.google.com/citations?user=ZUrWZhQAAAAJ&hl=en).

Current values are deliberately **not** quoted here — read
[`_data/scholar.json`](_data/scholar.json), which is the source of truth.

### How it works

1. A scheduled Actions job runs `scripts/scholarScraper.js`.
2. The scraper writes `_data/scholar.json` and commits it.
3. `scripts/build-site.js` bakes those numbers into the pages at build time.

Because the numbers are baked in, a visitor's browser never contacts Google: no
CORS problem, no API key in the client, no spinner that can hang. If every
scraping method breaks, the site keeps showing the last known good numbers.

### Three scraping methods

Tried in order, stopping at the first success. Each failure logs a specific
reason and falls through.

| # | Method | Requires | Notes |
|---|--------|----------|-------|
| 1 | SerpAPI | `SERPAPI_KEY` | Most reliable. Skipped silently when unset. |
| 2 | `scholarly` (Python) | `pip install scholarly` | Optional `SCRAPERAPI_KEY` proxy. |
| 3 | Direct page scrape | nothing | Last resort; often CAPTCHA-blocked from CI. |

**A failed scrape is a no-op.** When all three fail nothing is written — no
zeros, no nulls, no partial object — and the process exits 1 so the run goes
red. This is enforced, not incidental.

Run it by hand:

```bash
npm run update-scholar
```

### Workflows

| File | Name | Trigger |
|------|------|---------|
| `.github/workflows/update-scholar-stats.yml` | Auto Update Google Scholar Stats | `cron: '0 6 * * *'` (06:00 UTC daily) and manual dispatch |
| `.github/workflows/manual-scholar-update.yml` | Manual Scholar Stats Update | Manual dispatch only, with a `force_update` boolean |

Both commit **only when the data actually changed**, which keeps a profile that
gains a citation every few weeks from accruing a year of empty daily commits.
`force_update` overrides that on the manual workflow.

Both then invoke `pages.yml` directly as a `workflow_call` job. This is
deliberate: a commit made with the default `GITHUB_TOKEN` does **not** trigger
other workflows, so relying on the push event would leave the live site stale
while every run stayed green. No personal access token is needed. (Vercel is
unaffected — it deploys from a webhook, which does fire.)

Two things to know about GitHub's scheduler:

- **Scheduled runs are not punctual.** They are queued and routinely delayed ten
  minutes or more, and skipped under load. Treat the schedule as "about daily".
- **Scheduled workflows are disabled after 60 days without repository
  activity.** Any commit resets that clock, as does running a workflow by hand.

### Optional secrets

Under *Settings → Secrets and variables → Actions*. Neither is required; an
unset secret resolves to an empty string and the scraper skips that method.

- **`SERPAPI_KEY`** — the one worth adding. Free tier at
  [serpapi.com](https://serpapi.com) allows 100 searches/month. Without it the
  pipeline falls back to hitting Google from GitHub's shared runner IPs, which
  are heavily rate-limited, so expect CAPTCHA blocks on some days. The effect is
  "updates on most days rather than every day", not a broken site.
- **`SCRAPERAPI_KEY`** — a proxy for method 2. Genuinely optional.

### Changing the profile

The author ID is a named constant at the top of two files — change both:

- `scripts/scholarScraper.js` → `SCHOLAR_AUTHOR_ID`
- `scripts/fetch_scholar.py` → `SCHOLAR_AUTHOR_ID`

### The `sinceYear` key

Google's second column is always *the current year minus five*, so it rolls over
each January. The five-year keys in the JSON are therefore **composed at
runtime** (`citationsSince` + year), never hardcoded, and the build reads them
through a fallback chain — composite key, then all-time key, then zero — so a
half-migrated file still renders real numbers instead of zeros.

## Topic filters

Publications and Projects each carry a tag filter bar, built by
[`assets/js/tag-filter.js`](assets/js/tag-filter.js).

It is progressive enhancement: with JavaScript disabled both pages render every
entry, just unfiltered.

Two modes:

- **Derived** (Publications) — one button per distinct `<span class="tag">` on
  the page, commonest first. Adding a tag to an entry adds it to the bar
  automatically.
- **Curated** (Projects) — the filter div carries a `data-tag-groups` attribute
  holding `{"Button label": ["underlying", "tags"]}`. Only those buttons are
  shown, in that order, and a button matches an entry carrying **any** of its
  tags. That lets one button stand for a group (*Speech NLP* covering
  ASR/Whisper/Wav2Vec2) or rename one (*Natural Language Processing* for the tag
  spelled `NLP`).

Group headings whose entries are all filtered out are hidden along with their
rule, so a filtered view never leaves a bare heading.

## Visitor tracking

The site is registered with [Map My Visitors](https://mapmyvisitors.com/);
the dashboard lives at <https://mapmyvisitors.com/web/1c808>.

The badge is currently embedded **in this README only** — it was removed from
the site footer. Be aware of what that means:

> The counter records a hit wherever the image is loaded. In this README it
> counts people viewing the repository, **not** people visiting the live site.

Pick whichever you actually want:

- **Track repository views** (current setup) — leave it as is.
- **Track website visitors** — put the same `<a>/<img>` snippet back into the
  footer of the pages in `webpages/`. It can be styled small or visually hidden;
  what matters is that the page loads the image.
- **Track both, viewed from GitHub** — keep the snippet on the site *and* in
  this README, and accept that the map mixes both audiences.

## Repository layout

| Path | What it is |
|------|-----------|
| `webpages/` | **The site.** Hand-maintained HTML, the source of truth. |
| `scripts/build-site.js` | The whole build: `webpages/` → `public/`. |
| `scripts/build-static.js` | Legacy generator. Destructive — see the warning above. |
| `scripts/scholarScraper.js` | Scholar scraper (Node, three methods). |
| `scripts/fetch_scholar.py` | Method 2 helper (`scholarly`). |
| `scripts/serve.js` | Local preview server; finds a free port. |
| `assets/css/main.css` | The stylesheet. |
| `assets/js/` | `theme-toggle`, `lightbox`, `page-toc`, `tag-filter`. |
| `_data/scholar.json` | Scholar figures, written by the scraper. |
| `images/`, `files/` | Media and the CV PDF. |
| `public/` | Build output. Git-ignored. |
| `src/`, `dist/`, `markdown_generator/`, `talkmap/` | Legacy TypeScript/Python tooling, not used by the page pipeline. |

## Accessibility and responsiveness

- Every page is checked to have no horizontal overflow down to 320px.
- The sticky nav's height is measured at runtime and published as `--nav-h`, so
  in-page anchors clear it at any width (the nav wraps from 57px to over 170px).
- The sidebar and the "On this page" rail scroll independently of the page.
- Pages respect `prefers-reduced-motion` for smooth scrolling.

## License

MIT, as the original [academicpages](https://github.com/academicpages/academicpages.github.io)
template.
