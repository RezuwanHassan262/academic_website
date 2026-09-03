# Academic Website - TypeScript Conversion# Portfolio Website

Portfolio website repository of me.

This directory contains the TypeScript conversion of the original Jekyll-based academic website. All JavaScript and Python functionality has been converted to TypeScript for better type safety, maintainability, and modern development practices.

## Running locally

## 📁 Directory Structure

When you are initially working your website, it is very useful to be able to preview the changes locally before pushing them to GitHub. To work locally you will need to:

```

typescript_convert/1. Clone the repository and made updates as detailed above.

├── src/                          # TypeScript source files1. Make sure you have ruby-dev, bundler, and nodejs installed

│   ├── assets/    

│   │   └── js/                   # Converted JavaScript files    On most Linux distribution and [Windows Subsystem Linux](https://learn.microsoft.com/en-us/windows/wsl/about) the command is:

│   │       ├── _main.ts          # Main jQuery functionality    ```bash

│   │       ├── collapse.ts       # Collapsible sections    sudo apt install ruby-dev ruby-bundler nodejs

│   │       └── plugins/    ```

│   │           └── jquery.greedy-navigation.ts  # Navigation plugin    On MacOS the commands are:

│   ├── talkmap/                  # Talk map generation    ```bash

│   │   ├── talkmap.ts           # Main map generator (from Python)    brew install ruby

│   │   └── org-locations.ts     # Location data    brew install node

│   ├── markdown_generator/       # Markdown file generators (from Python)    gem install bundler

│   │   ├── publications.ts      # Publications generator    ```

│   │   └── talks.ts             # Talks generator1. Run `bundle install` to install ruby dependencies. If you get errors, delete Gemfile.lock and try again.

│   ├── types/                   # Type definitions1. Run `jekyll serve -l -H localhost` to generate the HTML and serve it from `localhost:4000` the local server will automatically rebuild and refresh the pages on change.

│   │   └── global.d.ts          # Global type declarations

│   └── index.ts                 # Main entry pointIf you are running on Linux it may be necessary to install some additional dependencies prior to being able to run locally: `sudo apt install build-essential gcc make`

├── dist/                        # Compiled output (generated)

├── tsconfig.json               # TypeScript configuration## Using Docker

├── webpack.config.js           # Webpack configuration

├── package.json                # Updated dependenciesWorking from a different OS, or just want to avoid installing dependencies? You can use the provided `Dockerfile` to build a container that will run the site for you if you have [Docker](https://www.docker.com/) installed.

└── README.md                   # This file

```Start by build the container:



## 🚀 Features Converted```bash

docker build -t jekyll-site .

### JavaScript to TypeScript```

- ✅ **Main Scripts** (`_main.js` → `_main.ts`)

  - jQuery-based DOM manipulationNext, run the container:

  - Sticky footer functionality```bash

  - Smooth scrollingdocker run -p 4000:4000 --rm -v $(pwd):/usr/src/app jekyll-site

  - Image lightbox (Magnific Popup)```

  - Responsive menu handling

To run the `docker run` command on Windows, you need to adjust the syntax for the volume mapping (`-v`) as Windows uses different path formats. Here's how to run your command on Windows:

- ✅ **Greedy Navigation** (`jquery.greedy-navigation.js` → `jquery.greedy-navigation.ts`)

  - Responsive navigation menu### Steps for Windows:

  - Automatic menu item hiding/showing1. **Check Docker Installation**: Ensure Docker is installed and running.

  - Type-safe jQuery interactions2. **Adjust Path for Volume Mapping**:



- ✅ **Collapse Functionality** (`collapse.js` → `collapse.ts`)   - On Windows, replace `$(pwd)` with the full absolute path to your current directory. For example:

  - Expandable/collapsible sections

  - Smooth animations     ```bash

     -v C:\path\to\your\site:/usr/src/app

### Python to TypeScript     ```

- ✅ **Talk Map Generator** (`talkmap.py` → `talkmap.ts`)

  - Geocoding functionality using Nominatim API### Full Command Example:

  - Leaflet map generation```bash

  - Location data processingdocker run -p 4000:4000 --rm -v C:\path\to\your\site:/usr/src/app jekyll-site

  - HTML/JS output generation```



- ✅ **Publications Generator** (`publications.py` → `publications.ts`)
  - TSV parsing for publication data
  - Markdown file generation
  - YAML frontmatter creation
  - HTML escaping

- ✅ **Talks Generator** (`talks.py` → `talks.ts`)
  - TSV parsing for talk data
  - Location extraction for mapping
  - Markdown file generation

## 🛠️ Setup and Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Install TypeScript types:**
```bash
npm install --save-dev @types/jquery @types/node typescript
```

3. **Install additional dependencies:**
```bash
npm install webpack webpack-cli ts-loader
```

### Build Commands

- **Compile TypeScript:**
```bash
npm run build:ts
```

- **Bundle with Webpack:**
```bash
npm run build:js
```

- **Development watch mode:**
```bash
npm run dev
```

- **Build optimized production bundle:**
```bash
npm run watch:js
```

## 📋 Usage Examples

### Using the Publications Generator

```typescript
import { PublicationsGenerator, processPublications } from './src/markdown_generator/publications';

// Process TSV data
const tsvContent = `pub_date	title	venue	excerpt	citation	site_url	paper_url	url_slug
2024-01-01	My Paper	Conference	Description	Citation	https://site.com	https://paper.pdf	my-paper`;

const files = processPublications(tsvContent);
console.log('Generated files:', files);
```

### Using the Talk Map Generator

```typescript
import { TalkMapGenerator, generateTalkMap } from './src/talkmap/talkmap';

const markdownFiles = [
  {
    name: 'talk1.md',
    content: 'location: "New York, NY"'
  }
];

generateTalkMap(markdownFiles).then(result => {
  console.log('Generated map data:', result);
});
```

### Using the Main Application

```typescript
import { AcademicWebsiteApp } from './src/index';

const app = new AcademicWebsiteApp();
await app.init();
```

## 🔧 Configuration

### TypeScript Configuration (`tsconfig.json`)
- Target: ES2020
- Strict mode enabled
- Source maps generated
- Declaration files created

### Webpack Configuration
- Entry points for main scripts
- TypeScript loader
- External jQuery dependency
- Production optimization

## 🌐 Browser Compatibility

The converted TypeScript code targets:
- Modern browsers (ES2020+)
- jQuery 3.7.1+
- Leaflet 1.7.1+

## 📦 Dependencies

### Runtime Dependencies
- `jquery` - DOM manipulation
- `fitvids` - Responsive videos
- `jquery-smooth-scroll` - Smooth scrolling
- `magnific-popup` - Image lightbox

### Development Dependencies
- `typescript` - TypeScript compiler
- `@types/jquery` - jQuery type definitions
- `@types/node` - Node.js type definitions
- `webpack` - Module bundler
- `ts-loader` - TypeScript loader for Webpack

## 🔄 Migration from Original

### JavaScript Files
- Original files preserved in `assets/js/`
- TypeScript versions in `src/assets/js/`
- Module exports added for better organization
- Type safety improvements

### Python Scripts
- Complete rewrite in TypeScript
- Browser-compatible versions created
- API-based geocoding (no server dependencies)
- File download functionality for browser use

### Key Improvements
1. **Type Safety** - All variables and functions are typed
2. **Modern ES6+** - Uses modern JavaScript features
3. **Modular Design** - Proper module exports and imports
4. **Error Handling** - Better error handling and logging
5. **Browser Compatible** - No server-side dependencies
6. **Development Tools** - Webpack, source maps, watch mode

## 🐛 Known Issues

1. **jQuery Types** - Some jQuery plugins may need additional type definitions
2. **Global Variables** - Legacy code assumes global jQuery availability
3. **File API** - File operations in browser require user interaction

## 🤝 Contributing

When adding new features:
1. Add proper TypeScript types
2. Include JSDoc comments
3. Follow the existing module pattern
4. Update this README

## 📄 License

Same license as the original academic website template (MIT).

## 🔗 Related Files

- Original JavaScript files: `../assets/js/`
- Original Python scripts: `../markdown_generator/`, `../talkmap.py`
- Jekyll configuration: `../_config.yml`
- Package configuration: `../package.json`
## 📊 Google Scholar statistics (automated)

The citation count, h-index and i10-index on the **Publications** page are
refreshed automatically from
[this Scholar profile](https://scholar.google.com/citations?user=ZUrWZhQAAAAJ&hl=en).

The current values are **not** listed here on purpose — they would go stale.
Read `_data/scholar.json`, which is the single source of truth.

### How it works

1. A scheduled GitHub Actions job runs `scripts/scholarScraper.js`.
2. The scraper writes the metrics to **`_data/scholar.json`** and commits it.
3. `scripts/build-site.js` substitutes those numbers into the card at build
   time, filling every element marked `data-scholar="…"` in
   `webpages/publications.html`.

Because the numbers are baked in at build time, a visitor's browser never
contacts Google: no CORS problem, no API key exposed to the client, and no
spinner that can hang. If every scraping method breaks, the site keeps showing
the last known good numbers.

### The scraper's three methods

Tried in order, stopping at the first success. Each failure logs a specific
reason and falls through.

| # | Method | Requires | Notes |
|---|--------|----------|-------|
| 1 | SerpAPI | `SERPAPI_KEY` | Most reliable. Skipped silently when the key is unset. |
| 2 | `scholarly` (Python) | `pip install scholarly` | Optional `SCRAPERAPI_KEY` proxy. |
| 3 | Direct page scrape | nothing | Last resort; frequently CAPTCHA-blocked from CI. |

**A failed scrape is a no-op.** When all three fail, nothing is written — no
zeros, no nulls, no partial object — and the process exits 1 so the run goes
red and you get an email.

Run it locally:

```bash
npm run update-scholar
```

### Optional repository secrets

Both live under *Settings → Secrets and variables → Actions*. Neither is
required; an unset secret resolves to an empty string and the scraper skips
that method.

- **`SERPAPI_KEY`** — the one worth adding. Free tier at
  [serpapi.com](https://serpapi.com) allows 100 searches/month, comfortably
  more than one run a day. Without it the pipeline falls back to hitting Google
  from GitHub's shared runner IPs, which are heavily rate-limited, so expect
  CAPTCHA blocks on a meaningful fraction of days. The practical effect is
  "updates on some days rather than every day", not a broken site.
- **`SCRAPERAPI_KEY`** — a proxy for method 2. Genuinely optional.

### The workflows

| File | Name | Trigger |
|------|------|---------|
| `.github/workflows/update-scholar-stats.yml` | Auto Update Google Scholar Stats | `cron: '0 6 * * *'` (06:00 UTC daily) and manual dispatch |
| `.github/workflows/manual-scholar-update.yml` | Manual Scholar Stats Update | Manual dispatch only, with a `force_update` boolean |

Both commit only when the data actually changed, which is what keeps a profile
that gains a citation every few weeks from accruing a year of empty daily
commits. `force_update` overrides that for the manual workflow.

Two things worth knowing about GitHub's scheduler:

- **Scheduled runs are not punctual.** GitHub queues cron jobs and routinely
  delays them ten minutes or more, and skips them under load. Treat the
  schedule as "about once a day".
- **GitHub disables scheduled workflows after 60 days without repository
  activity.** Any commit resets that clock, as does manually running a
  workflow from the Actions tab.

### Why the deploy is invoked explicitly

A commit made with the default `GITHUB_TOKEN` does not trigger other
workflows. Since this site deploys via `.github/workflows/pages.yml` on push,
the auto-commit would update the JSON in git and never redeploy — the live site
would show stale numbers while every run stayed green.

Both Scholar workflows therefore call the deploy workflow directly as a
`workflow_call` job, rather than relying on the push event. `pages.yml` carries
`workflow_call:` among its triggers for this reason. No personal access token
is needed. (The Vercel deployment is unaffected either way, because it runs
from a webhook, which does fire.)

### Changing the profile

The author ID is a named constant at the top of two files. Change both:

- `scripts/scholarScraper.js` — `SCHOLAR_AUTHOR_ID`
- `scripts/fetch_scholar.py` — `SCHOLAR_AUTHOR_ID`

### The `sinceYear` key

Google's second column is always *the current year minus five*, so it rolls
over each January. The five-year keys in the JSON are therefore **composed at
runtime** (`citationsSince` + year), never hardcoded, and the build reads them
through a fallback chain — composite key, then all-time key, then zero — so a
half-migrated file renders real numbers instead of a row of zeros.
