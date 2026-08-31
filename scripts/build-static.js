#!/usr/bin/env node
/**
 * build-static.js
 *
 * Renders the static preview in `webpages/` from the Jekyll sources so the site
 * can be viewed locally without a Ruby/Jekyll toolchain.
 *
 * Sources of truth (never edit webpages/*.html by hand — it is generated):
 *   _config.yml                     site + author metadata
 *   _data/navigation.yml            header navigation
 *   _data/scholar.yml               Google Scholar metrics card
 *   _data/research_interests.yml    research interests (About, Publications, Interests)
 *   _data/hobbies.yml               hobbies (Interests)
 *   _data/awards.yml                achievements + honours (Awards)
 *   _data/volunteering.yml          community service (Volunteering)
 *   _data/adjudications.yml         judging + peer review (Adjudications)
 *   _publications/ _portfolio/ _talks/ _teaching/   collections
 *   _pages/*.{md,html}              page bodies and intro copy
 *
 * Usage:  node scripts/build-static.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'webpages');

/* ---------------------------------------------------------------------------
 * Minimal YAML reader
 *
 * Covers what these data files use: nested maps, scalars, `- ` sequences,
 * quoted strings and folded/literal block scalars (`>` and `|`).
 * Not a general YAML parser.
 * ------------------------------------------------------------------------ */

function parseScalar(raw) {
  let v = raw.trim();
  if (v === '' || v.startsWith('#')) return '';
  if (!/^["']/.test(v)) {
    const hash = v.indexOf(' #');
    if (hash !== -1) v = v.slice(0, hash).trim();
  }
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1).replace(/\\"/g, '"');
  }
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (/^-?\d+$/.test(v)) return Number(v);
  v = v.replace(/^&\S+\s*/, '').replace(/^\*\S+\s*$/, '');
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

const BLOCK_SCALAR = /^([>|])([-+]?)$/;

function parseYaml(text) {
  const lines = text.split(/\r?\n/);
  const root = {};
  const stack = [{ indent: -1, container: root }];

  // Reads the indented body of a `key: >` / `key: |` block scalar.
  function readBlock(startIndex, ownerIndent, style) {
    const collected = [];
    let i = startIndex;
    while (i < lines.length) {
      const l = lines[i];
      if (!l.trim()) { collected.push(''); i++; continue; }
      const ind = l.match(/^\s*/)[0].length;
      if (ind <= ownerIndent) break;
      collected.push(l.trim());
      i++;
    }
    while (collected.length && collected[collected.length - 1] === '') collected.pop();
    const value = style === '>'
      ? collected.reduce((acc, cur) => (cur === '' ? `${acc}\n` : acc ? `${acc} ${cur}` : cur), '')
      : collected.join('\n');
    return { value: value.trim(), next: i };
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const indent = line.match(/^\s*/)[0].length;
    const body = line.trim();

    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop();
    const parent = stack[stack.length - 1].container;

    if (body.startsWith('- ')) {
      const item = body.slice(2).trim();
      if (!Array.isArray(parent.__list)) parent.__list = [];
      if (/^[\w".'-]+\s*:/.test(item) && !/^https?:/.test(item)) {
        const obj = {};
        const k = item.slice(0, item.indexOf(':')).trim();
        const rest = item.slice(item.indexOf(':') + 1);
        const blockMatch = rest.trim().match(BLOCK_SCALAR);
        if (blockMatch) {
          // `- key: >` — the dash column is the owner indent for the block body
          const res = readBlock(i + 1, indent, blockMatch[1]);
          obj[k] = res.value;
          i = res.next - 1;
        } else {
          obj[k] = parseScalar(rest);
        }
        parent.__list.push(obj);
        stack.push({ indent, container: obj });
      } else {
        parent.__list.push(parseScalar(item));
      }
      continue;
    }

    const colon = body.indexOf(':');
    if (colon === -1) continue;
    const key = body.slice(0, colon).trim().replace(/^["']|["']$/g, '');
    const rest = body.slice(colon + 1);
    const blockMatch = rest.trim().match(BLOCK_SCALAR);

    if (blockMatch) {
      const res = readBlock(i + 1, indent, blockMatch[1]);
      parent[key] = res.value;
      i = res.next - 1;
      continue;
    }

    if (rest.trim() === '' || rest.trim().startsWith('#') || /^\s*&\S+\s*$/.test(rest)) {
      const child = {};
      parent[key] = child;
      stack.push({ indent, container: child });
    } else {
      parent[key] = parseScalar(rest);
    }
  }

  const collapse = (node) => {
    if (node === null || typeof node !== 'object') return node;
    if (Array.isArray(node.__list)) return node.__list.map(collapse);
    for (const k of Object.keys(node)) node[k] = collapse(node[k]);
    return node;
  };
  return collapse(root);
}

function readYaml(rel) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) return {};
  return parseYaml(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
}

function readYamlList(rel) {
  const parsed = readYaml(rel);
  return Array.isArray(parsed) ? parsed : [];
}

/* ---------------------------------------------------------------------------
 * Front matter + collection loading
 * ------------------------------------------------------------------------ */

function readDoc(file) {
  const raw = fs.readFileSync(file, 'utf8').replace(/^﻿/, '');
  const m = raw.match(/^\s*---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw, file };
  return { data: parseYaml(m[1]), body: m[2], file };
}

function readCollection(dir) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith('.md') || f.endsWith('.markdown'))
    .map((f) => readDoc(path.join(full, f)));
}

/* ---------------------------------------------------------------------------
 * Minimal Markdown renderer
 * ------------------------------------------------------------------------ */

function escapeAttr(s) {
  return String(s).replace(/&(?![a-zA-Z#0-9]+;)/g, '&amp;').replace(/"/g, '&quot;');
}

function inline(text) {
  return text
    .replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`)
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, src) => `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}">`)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, href) => `<a href="${escapeAttr(href)}">${t}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/(^|[\s(])_([^_\n]+)_/g, '$1<em>$2</em>');
}

const VOID_TAGS = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i;
function tagDelta(line) {
  let delta = 0;
  const re = /<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>/g;
  let m;
  while ((m = re.exec(line))) {
    const [, closing, name, , selfClose] = m;
    if (VOID_TAGS.test(name) || selfClose === '/') continue;
    delta += closing ? -1 : 1;
  }
  return delta;
}

function markdown(src) {
  const lines = src.split(/\r?\n/);
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    if (/^\s*</.test(line)) {
      const block = [];
      let depth = 0;
      do {
        depth += tagDelta(lines[i]);
        block.push(lines[i]);
        i++;
      } while (i < lines.length && (depth > 0 || (lines[i].trim() && /^\s*</.test(lines[i]))));
      out.push(block.join('\n'));
      continue;
    }

    if (/^#{1,6}\s/.test(line)) {
      const level = line.match(/^#+/)[0].length;
      const text = line.replace(/^#+\s*/, '');
      const id = text.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
      out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
      i++;
      continue;
    }

    if (/^(---|\*\*\*|___)\s*$/.test(line)) { out.push('<hr>'); i++; continue; }

    if (line.includes('|') && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1])) {
      const cells = (r) => r.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) { rows.push(cells(lines[i])); i++; }
      const thead = head.some((h) => h)
        ? `<thead><tr>${head.map((h) => `<th>${inline(h)}</th>`).join('')}</tr></thead>`
        : '';
      const tbody = rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('');
      out.push(`<table>${thead}<tbody>${tbody}</tbody></table>`);
      continue;
    }

    if (/^\s*[-*+]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items = [];
      while (i < lines.length && (/^\s*[-*+]\s+/.test(lines[i]) || /^\s*\d+\.\s+/.test(lines[i]))) {
        items.push(inline(lines[i].replace(/^\s*(?:[-*+]|\d+\.)\s+/, '')));
        i++;
      }
      const tag = ordered ? 'ol' : 'ul';
      out.push(`<${tag}>${items.map((t) => `<li>${t}</li>`).join('')}</${tag}>`);
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quote = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) { quote.push(lines[i].replace(/^\s*>\s?/, '')); i++; }
      out.push(`<blockquote><p>${inline(quote.join(' '))}</p></blockquote>`);
      continue;
    }

    const para = [];
    while (i < lines.length && lines[i].trim() && !/^\s*</.test(lines[i]) && !/^#{1,6}\s/.test(lines[i]) &&
           !/^\s*[-*+]\s+/.test(lines[i]) && !/^\s*>/.test(lines[i])) {
      para.push(lines[i]);
      i++;
    }
    if (para.length) out.push(`<p>${inline(para.join(' '))}</p>`);
  }

  return out.join('\n');
}

/* ---------------------------------------------------------------------------
 * Shared component renderers
 *
 * These mirror the Liquid includes one-for-one so both builds emit the same
 * markup from the same data.
 * ------------------------------------------------------------------------ */

// mirrors _includes/gallery-strip.html
function galleryHtml(images) {
  if (!Array.isArray(images) || images.length === 0) return '';
  const items = images.map((image) => {
    const src = String(image.src || '');
    const url = src.includes('://') ? src : `../images/${src}`;
    const ph = src === 'placeholder.svg' ? ' gallery-strip__item--placeholder' : '';
    const lg = image.kind === 'logo' ? ' gallery-strip__item--logo' : '';
    return `      <figure class="gallery-strip__item${ph}${lg}">` +
      `<img src="${escapeAttr(url)}" alt="${escapeAttr(image.alt || '')}" loading="lazy">` +
      `${image.caption ? `<figcaption>${image.caption}</figcaption>` : ''}</figure>`;
  }).join('\n');
  return `    <div class="gallery-strip" role="group" aria-label="Photos">\n${items}\n    </div>`;
}

// mirrors _includes/research-interests.html
function interestsHtml(items, limit) {
  const list = limit ? items.slice(0, limit) : items;
  return `<ul class="icon-grid">\n` + list.map((item) =>
    `  <li class="icon-card" style="border-left-color: ${item.color};">\n` +
    `    <img class="icon-card__img" src="${escapeAttr(item.icon)}" alt="" loading="lazy">\n` +
    `    <span class="icon-card__body">\n` +
    `      <span class="icon-card__title">${item.title}</span>\n` +
    `      <span class="icon-card__desc">${item.description}</span>\n` +
    `    </span>\n  </li>`
  ).join('\n') + `\n</ul>`;
}

// mirrors _includes/ongoing-research.html
function ongoingHtml(items) {
  if (!Array.isArray(items) || !items.length) return '';
  return `<ul class="ongoing-list">
` + items.map((item) =>
    `  <li class="ongoing-item">
` +
    `    <span class="ongoing-item__title">${item.link ? `<a href="${escapeAttr(item.link)}">${item.title}</a>` : item.title}</span>
` +
    `    <span class="ongoing-item__desc">${item.description || ''}</span>
  </li>`
  ).join('\n') + `
</ul>`;
}

// mirrors _includes/highlights.html — everything here is derived from the
// talks collection and _data/adjudications.yml, never duplicated.
function highlightsHtml(talks, adjudications, volunteering) {
  const monthYear = (d) => {
    const dt = new Date(String(d));
    return isNaN(dt) ? String(d || '') :
      dt.toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });
  };
  const workshops = talks.filter((t) => String(t.data.type || '').includes('Workshop'));
  const talkOnly = talks.filter((t) => String(t.data.type || '').includes('Talk'));
  const judging = (adjudications.competitions || []).concat(adjudications.peer_review || []);
  const volunteers = (volunteering && volunteering.entries) || [];

  const list = (rows) => `    <ul class="highlight-card__list">
` + rows.map((r) =>
    `      <li><strong>${r.head}</strong><span>${r.sub}</span></li>`).join('\n') + `
    </ul>`;

  // two per row, two rows max — keeps the board scannable
  const strip = (all) => {
    const images = all.slice(0, 4);
    if (!images.length) return '';
    return `    <div class="highlight-card__strip">
` + images.map((img) =>
      `      <img src="../images/${escapeAttr(img.src)}" alt="${escapeAttr(img.alt || '')}" loading="lazy">`
    ).join('\n') + `
    </div>`;
  };

  const pick = (docs, perDoc) => docs.flatMap((d) => (d.data.gallery || []).slice(0, perDoc));
  const pickData = (rows, perRow) => rows.flatMap((r) => (r.images || []).slice(0, perRow));

  const card = (icon, title, rows, images, href, more) =>
    `  <section class="highlight-card">
` +
    `    <h3 class="highlight-card__title"><i class="fas fa-${icon}" aria-hidden="true"></i> ${title}</h3>
` +
    list(rows) + '\n' + (strip(images) ? strip(images) + '\n' : '') +
    `    <a class="highlight-card__more" href="${href}">${more} &rarr;</a>
  </section>`;

  return `<div class="highlight-board">
` + [
    card('chalkboard-teacher', 'Workshops',
      workshops.map((t) => ({ head: t.data.venue, sub: `${t.data.title} &middot; ${monthYear(t.data.date)}` })),
      pick(workshops, 2), '/talks/', 'All talks &amp; workshops'),
    card('microphone', 'Invited Talks',
      talkOnly.map((t) => ({ head: t.data.venue, sub: `${t.data.title} &middot; ${monthYear(t.data.date)}` })),
      pick(talkOnly, 1), '/talks/', 'All talks &amp; workshops'),
    card('gavel', 'Judging &amp; Review',
      judging.map((j) => ({ head: j.org, sub: `${j.role} &middot; ${j.date}` })),
      pickData(judging, 1), '/adjudications/', 'All adjudications'),
    card('hands-helping', 'Volunteering',
      volunteers.map((v) => ({ head: v.org, sub: `${v.role} &middot; ${v.date}` })),
      pickData(volunteers, 2), '/volunteering/', 'All volunteering'),
  ].join('\n') + `
</div>`;
}

// mirrors _includes/testimonials.html
function testimonialsHtml(t) {
  const people = (t && t.people) || [];
  if (!people.length) return '';
  const link = escapeAttr(t.link || '');
  const cards = people.map((p) => {
    const shot = p.screenshot
      ? `        <img class="testimonial__shot" src="../images/${escapeAttr(p.screenshot)}" alt="LinkedIn recommendation from ${escapeAttr(p.name)}" loading="lazy">
`
      : '';
    return `  <figure class="testimonial">
    <header class="testimonial__head">
      <img class="testimonial__avatar no-lightbox" src="../images/${escapeAttr(p.avatar)}" alt="${escapeAttr(p.name)}" loading="lazy">
      <span class="testimonial__who">
        <a class="testimonial__name" href="${link}" target="_blank" rel="noopener">${p.name}</a>
        <span class="testimonial__title">${p.title}</span>
        <span class="testimonial__meta">${p.relation} &middot; ${p.date}</span>
      </span>
${shot}    </header>
    <blockquote class="testimonial__quote">${p.quote}</blockquote>
    <figcaption class="testimonial__more">
      <a href="${link}" target="_blank" rel="noopener">${p.truncated ? 'Read the full recommendation' : 'View on LinkedIn'} &rarr;</a>
    </figcaption>
  </figure>`;
  }).join('\n');

  return `<div class="testimonial-grid">
${cards}
</div>
` +
    `<p class="testimonial-all"><a href="${link}" target="_blank" rel="noopener">` +
    `<i class="fab fa-linkedin" aria-hidden="true"></i> All recommendations on LinkedIn &rarr;</a></p>`;
}

// mirrors _includes/service-entries.html
function serviceEntriesHtml(entries) {
  if (!Array.isArray(entries)) return '';
  return `<ul class="service-list">\n` + entries.map((entry) => {
    const gallery = galleryHtml(entry.images);
    return `  <li>\n` +
      `    <span class="service-list__role">${entry.role}</span>\n` +
      `    <span class="service-list__org">${entry.org}` +
      `${entry.date ? `<span class="service-list__date">${entry.date}</span>` : ''}</span>\n` +
      `    <p>${entry.description}</p>\n` +
      `${gallery ? gallery + '\n' : ''}` +
      `  </li>`;
  }).join('\n') + `\n</ul>`;
}

/* ---------------------------------------------------------------------------
 * Targeted Liquid rendering for hand-written page bodies
 *
 * Only the tags these pages actually use are supported, so page copy can stay
 * in _pages/ instead of being duplicated in this script.
 * ------------------------------------------------------------------------ */

function renderPageLiquid(body, data) {
  let out = body;

  // {% include ongoing-research.html %}
  out = out.replace(/\{%\s*include\s+ongoing-research\.html\s*%\}/g,
    () => ongoingHtml(data.ongoing_research || []));

  // {% include testimonials.html %}
  out = out.replace(/\{%\s*include\s+testimonials\.html\s*%\}/g,
    () => testimonialsHtml(data.testimonials || {}));

  // {% include highlights.html %}
  out = out.replace(/\{%\s*include\s+highlights\.html\s*%\}/g,
    () => highlightsHtml(data.talks || [], data.adjudications || {}, data.volunteering || {}));

  // {% for item in site.data.<name> %} ... {% endfor %}
  out = out.replace(
    /\{%\s*for\s+(\w+)\s+in\s+site\.data\.([\w.]+)\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g,
    (_, varName, dataPath, tpl) => {
      const list = dataPath.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), data);
      if (!Array.isArray(list)) return '';
      return list.map((item) =>
        tpl.replace(new RegExp(`\\{\\{\\s*${varName}\\.(\\w+)\\s*\\}\\}`, 'g'), (__, field) => item[field] ?? '')
      ).join('');
    }
  );

  // {% include service-entries.html entries=site.data.a.b %}
  out = out.replace(
    /\{%\s*include\s+service-entries\.html\s+entries=site\.data\.([\w.]+)\s*%\}/g,
    (_, dataPath) => serviceEntriesHtml(dataPath.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), data))
  );

  // {% include research-interests.html [limit=N] %}
  out = out.replace(
    /\{%\s*include\s+research-interests\.html(?:\s+limit=(\d+))?\s*%\}/g,
    (_, limit) => interestsHtml(data.research_interests || [], limit ? Number(limit) : undefined)
  );

  // {% include gallery-strip.html images=<expr> %} is only used inside other
  // includes, which are already expanded above — drop any stragglers.
  out = out.replace(/\{%\s*include\s+gallery-strip\.html[^%]*%\}/g, '');

  return stripLiquid(out);
}

function stripLiquid(body) {
  return body
    .replace(/\{%\s*(assign|include|if|elsif|else|endif|for|endfor|unless|endunless|continue|comment|endcomment)[\s\S]*?%\}/g, '')
    .replace(/\{\{\s*base_path\s*\}\}/g, '')
    .replace(/\{\{[\s\S]*?\}\}/g, '');
}

/* ---------------------------------------------------------------------------
 * Page shell
 * ------------------------------------------------------------------------ */

const URL_TO_FILE = {
  '/': 'index.html',
  '/publications/': 'publications.html',
  '/projects/': 'projects.html',
  '/talks/': 'talks.html',
  '/teaching/': 'teaching.html',
  '/adjudications/': 'adjudications.html',
  '/awards/': 'awards.html',
  '/volunteering/': 'volunteering.html',
  '/interests/': 'interests.html',
};

function urlToFile(url) {
  return URL_TO_FILE[url] || url;
}

function rewriteLinks(html) {
  // The static preview is flat files under webpages/, so Jekyll permalinks are
  // remapped onto the generated page that contains that content.
  return html
    .replace(
      /href="\/(publications|projects|talks|teaching|adjudications|awards|volunteering|interests)\/"/g,
      (_, p) => `href="${p}.html"`
    )
    .replace(/href="\/volunteering-and-achievements\/"/g, 'href="awards.html"')
    // the collection still lives at _portfolio/, but the page is now "Projects"
    .replace(/href="\/portfolio\/[^"]*"/g, 'href="projects.html"')
    .replace(/href="\/publication\/[^"]*"/g, 'href="publications.html"')
    .replace(/href="\/talks\/[^"]*"/g, 'href="talks.html"')
    .replace(/href="\/teaching\/[^"]*"/g, 'href="teaching.html"')
    .replace(/src="\/images\//g, 'src="../images/');
}

function navHtml(nav, current) {
  const items = [{ title: 'About', url: '/' }].concat(nav);
  return items
    .map((item) => {
      const href = urlToFile(item.url);
      const external = /^https?:\/\//.test(href);
      const cls = href === current ? ' class="current"' : '';
      const rel = external ? ' target="_blank" rel="noopener"' : '';
      return `                <li><a href="${href}"${cls}${rel}>${item.title}</a></li>`;
    })
    .join('\n');
}

function sidebarHtml(author) {
  const li = [];
  li.push(`<li><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${author.location}</li>`);
  if (author.employer) li.push(`<li><i class="fas fa-building" aria-hidden="true"></i> ${author.employer}</li>`);
  li.push(`<li><a href="mailto:${author.email}"><i class="fas fa-envelope"></i> Email</a></li>`);
  li.push(`<li><a href="${author.uri}"><i class="fas fa-globe"></i> Website</a></li>`);
  li.push(`<li><a href="${escapeAttr(author.googlescholar)}"><i class="ai ai-google-scholar"></i> Google Scholar</a></li>`);
  li.push(`<li><a href="${author.researchgate}"><i class="ai ai-researchgate"></i> ResearchGate</a></li>`);
  li.push(`<li><a href="https://github.com/${author.github}"><i class="fab fa-github"></i> GitHub</a></li>`);
  li.push(`<li><a href="https://huggingface.co/${author.huggingface}"><i class="fas fa-robot"></i> HuggingFace</a></li>`);
  li.push(`<li><a href="https://www.kaggle.com/${author.kaggle}"><i class="fab fa-kaggle"></i> Kaggle</a></li>`);
  li.push(`<li><a href="https://www.linkedin.com/in/${author.linkedin}/"><i class="fab fa-linkedin"></i> LinkedIn</a></li>`);
  return li.map((x) => `                                ${x}`).join('\n');
}

// Builds the "On this page" nav from the h2 headings of already-rendered
// content. Mirrors what Jekyll's `toc: true` produces for the single layout.
function tocHtml(contentHtml, cvUrl) {
  const headings = [];
  const re = /<h2 id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g;
  let m;
  while ((m = re.exec(contentHtml))) {
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    if (text) headings.push({ id: m[1], text });
  }
  if (headings.length < 2) return '';

  const items = headings.map(
    (h) => `                          <li><a href="#${h.id}">${h.text}</a></li>`
  );
  // The CV lives at the foot of the rail so it is reachable from anywhere on
  // the page. URL comes from the nav entry, so there is one place to change it.
  if (cvUrl) {
    items.push(
      `                          <li class="page-toc__cv"><a href="${escapeAttr(cvUrl)}" target="_blank" rel="noopener">` +
      `<i class="fas fa-file-arrow-down" aria-hidden="true"></i> Download CV</a></li>`
    );
  }

  return `                    <nav class="page-toc" aria-label="On this page">
                        <h4 class="page-toc__title"><i class="fas fa-align-justify" aria-hidden="true"></i> On this page</h4>
                        <ul class="page-toc__list">
${items.join('\n')}
                        </ul>
                    </nav>`;
}

function shell({ site, author, nav, currentFile, title, lead, content, toc, cvUrl }) {
  content = rewriteLinks(content);
  return `<!DOCTYPE html>
<!-- data-theme is set to the site default here so the page paints dark even
     before theme-toggle.js runs; a visitor's saved choice overrides it. -->
<html lang="en" class="no-js" data-theme="dark">
<head>
    <meta charset="utf-8">
    <title>${title} | ${site.title}</title>
    <meta name="description" content="${escapeAttr(site.description)}">
    <meta name="author" content="${escapeAttr(author.name)}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="generator" content="scripts/build-static.js — do not edit this file by hand">

    <!-- CSS -->
    <link rel="stylesheet" href="../assets/css/main.css">
    <link rel="stylesheet" href="../assets/css/academicons.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

    <!-- jQuery and other libraries -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js"></script>

    <!-- Custom JavaScript -->
    <script src="../assets/js/theme-toggle.js"></script>
    <script src="../assets/js/lightbox.js"></script>
    <script src="../assets/js/page-toc.js"></script>
</head>

<body>

    <!-- Navigation -->
    <nav class="site-nav">
        <div class="nav-container">
            <div class="site-title">
                <a href="index.html">${author.name}</a>
            </div>
            <ul class="nav-list">
${navHtml(nav, currentFile)}
            </ul>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="layout--single">
        <div class="page">
            <div class="page__inner-wrap">

                <!-- Sidebar -->
                <aside class="sidebar">
                    <div class="author__avatar">
                        <img src="../images/profile-img.jpg" alt="${escapeAttr(author.name)}" class="author__avatar-image">
                    </div>

                    <div class="author__content">
                        <h3 class="author__name">${author.name}</h3>
                        <p class="author__bio">${author.bio}</p>

                        <div class="author__urls-wrapper">
                            <ul class="author__urls social-icons">
${sidebarHtml(author)}
                            </ul>
                        </div>
                    </div>
                </aside>

                <!-- Main content area -->
                <main class="page__content">
                    <header>
                        <h1 class="page__title">${title}</h1>
${lead ? `                        <p class="page__lead" style="font-style: italic; color: var(--text-muted); margin-bottom: 2rem;">${lead}</p>` : ''}
                    </header>

                    <section class="page__content-inner">
${content}
                    </section>
                </main>
${toc ? `
                <!-- Right-hand "On this page" rail; sticky so it follows the scroll -->
                <aside class="toc-rail">
${tocHtml(content, cvUrl)}
                </aside>` : ''}

            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="page__footer">
        <div class="page__footer-follow">
            <p><strong>${author.name}</strong> &mdash; a researcher by day, an engineer by night, and an artist all the way.</p>
        </div>
        <div class="page__footer-copyright">
            &copy; ${new Date().getFullYear()} ${author.name}. All rights reserved.
            Built from the Jekyll sources by <code>scripts/build-static.js</code>.
        </div>
    </footer>

</body>
</html>
`;
}

/* ---------------------------------------------------------------------------
 * Collection renderers
 * ------------------------------------------------------------------------ */

function scholarCard(s) {
  if (!s || !s.citations) return '';
  return `<div class="scholar-stats">
  <div class="scholar-stats__header">
    <h3 class="scholar-stats__title"><i class="ai ai-google-scholar" aria-hidden="true"></i> Google Scholar Metrics</h3>
    <a class="scholar-stats__link" href="${escapeAttr(s.profile_url)}" rel="noopener">View full profile &rarr;</a>
  </div>
  <div class="scholar-stats__grid">
    <div class="scholar-stat"><span class="scholar-stat__value">${s.citations}</span><span class="scholar-stat__label">Citations</span><span class="scholar-stat__sub">${s.citations_since} since ${s.since_year}</span></div>
    <div class="scholar-stat"><span class="scholar-stat__value">${s.h_index}</span><span class="scholar-stat__label">h-index</span><span class="scholar-stat__sub">${s.h_index_since} since ${s.since_year}</span></div>
    <div class="scholar-stat"><span class="scholar-stat__value">${s.i10_index}</span><span class="scholar-stat__label">i10-index</span><span class="scholar-stat__sub">${s.i10_index_since} since ${s.since_year}</span></div>
  </div>
  <p class="scholar-stats__note">${s.note} Last updated ${s.last_updated}.</p>
</div>`;
}

function docYear(doc) {
  const d = doc.data.date;
  if (!d) return 0;
  return parseInt(String(d).slice(0, 4), 10) || 0;
}

function byDateDesc(a, b) {
  return String(b.data.date || '').localeCompare(String(a.data.date || ''));
}

function linkButtons(d) {
  const btns = [];
  const paper = d.paperurl || d.paper;
  const code = d.projecturl || d.github;
  const demo = d.demourl || d.demo || d.live;
  if (paper) btns.push(`<a href="${escapeAttr(paper)}" class="btn-link" target="_blank" rel="noopener"><i class="fa-regular fa-file"></i> Paper</a>`);
  const slides = d.slidesurl || d.slides;
  const poster = d.posterurl || d.poster;
  const video = d.videourl || d.video;
  if (slides) btns.push(`<a href="${escapeAttr(slides)}" class="btn-link" target="_blank" rel="noopener"><i class="fa-regular fa-file-powerpoint"></i> Slides</a>`);
  if (poster) btns.push(`<a href="${escapeAttr(poster)}" class="btn-link" target="_blank" rel="noopener"><i class="fa-regular fa-image"></i> Poster</a>`);
  if (video) btns.push(`<a href="${escapeAttr(video)}" class="btn-link" target="_blank" rel="noopener"><i class="fa-brands fa-youtube"></i> Video</a>`);
  if (code) btns.push(`<a href="${escapeAttr(code)}" class="btn-link" target="_blank" rel="noopener"><i class="fa-solid fa-code"></i> Code</a>`);
  if (demo) btns.push(`<a href="${escapeAttr(demo)}" class="btn-link" target="_blank" rel="noopener"><i class="fas fa-play-circle"></i> Demo</a>`);
  return btns.length ? `<div class="portfolio-links">${btns.join('')}</div>` : '';
}

function tagChips(tags) {
  if (!Array.isArray(tags) || !tags.length) return '';
  return `<div class="publication-tags">${tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>`;
}

function excerptOf(doc) {
  if (doc.data.excerpt) return doc.data.excerpt;
  const firstPara = doc.body.split(/\r?\n\s*\r?\n/).map((s) => s.trim()).find((s) => s && !s.startsWith('#') && !s.startsWith('<'));
  return firstPara || '';
}

function publicationCard(doc) {
  const d = doc.data;
  const typeLabel = { under_review: 'Under Review', conferences: 'Conference / Workshop Paper', preprints: 'Preprint / Technical Report', theses: 'Thesis' }[d.category] || 'Publication';
  let teaser = (d.header && d.header.teaser) || '';
  if (teaser && !teaser.includes('://')) teaser = `../images/${teaser}`;
  const teaserAlt = (d.header && d.header.teaser_alt) || d.title;
  return `<div class="publication-item${teaser ? ' publication-item--has-figure' : ''}" data-category="${d.category || ''}" data-year="${docYear(doc)}">
  ${teaser ? `<div class="publication-figure"><img src="${escapeAttr(teaser)}" alt="${escapeAttr(teaserAlt)}" loading="lazy"></div>` : ''}
  <div class="publication-content">
    <div class="publication-type">${typeLabel}</div>
    <div class="publication-title"><strong>${d.title}</strong></div>
    <div class="publication-venue"><small>${d.venue || ''}${d.date ? ` &middot; ${docYear(doc)}` : ''}</small></div>
    <div class="publication-authors"><small>${inline(d.authors || '')}</small></div>
    <div class="publication-abstract">${markdown(excerptOf(doc))}</div>
    ${linkButtons(d)}
  </div>
</div>`;
}

function portfolioCard(doc) {
  const d = doc.data;
  let teaser = (d.header && d.header.teaser) || '';
  if (teaser && !teaser.includes('://')) teaser = `../images/${teaser}`;
  return `<div class="portfolio-item" data-category="${d.category || ''}" data-year="${d.year || ''}">
  ${teaser ? `<div class="portfolio-image"><img src="${escapeAttr(teaser)}" alt="${escapeAttr(d.title)}" loading="lazy"></div>` : ''}
  <div class="portfolio-content">
    ${d.year ? `<span class="project-year">${d.year}</span>` : ''}
    <h3>${d.title}</h3>
    <p>${inline(d.excerpt || '')}</p>
    ${tagChips(d.tags)}
    ${linkButtons(d)}
  </div>
</div>`;
}

function talkCard(doc) {
  const d = doc.data;
  return `<div class="talk-item">
  <div class="talk-header"><h3>${d.title}</h3></div>
  <div class="talk-venue"><strong>${d.type || 'Talk'}</strong> &middot; ${d.venue || ''}${d.location ? ` &middot; ${d.location}` : ''}</div>
  <div class="talk-date">${d.date || ''}</div>
  <div class="talk-description">${markdown(doc.body)}</div>
${galleryHtml(d.gallery)}
</div>`;
}

function teachingCard(doc) {
  const d = doc.data;
  return `<div class="teaching-item">
  <div class="teaching-header"><h3>${d.link ? `<a href="${escapeAttr(d.link)}" target="_blank" rel="noopener">${d.title}</a>` : d.title}</h3></div>
  <div class="teaching-meta"><span class="term">${d.type || ''}</span> <span class="institution">${d.venue || ''}${d.location ? ` &middot; ${d.location}` : ''}</span></div>
  <div class="teaching-content">${markdown(doc.body)}</div>
${galleryHtml(d.gallery)}
</div>`;
}

/* ---------------------------------------------------------------------------
 * Build
 * ------------------------------------------------------------------------ */

function build() {
  const config = readYaml('_config.yml');
  const nav = readYaml('_data/navigation.yml').main || [];

  const data = {
    scholar: readYaml('_data/scholar.yml'),
    research_interests: readYamlList('_data/research_interests.yml'),
    hobbies: readYamlList('_data/hobbies.yml'),
    awards: readYaml('_data/awards.yml'),
    volunteering: readYaml('_data/volunteering.yml'),
    adjudications: readYaml('_data/adjudications.yml'),
    ongoing_research: readYamlList('_data/ongoing_research.yml'),
    testimonials: readYaml('_data/testimonials.yml'),
  };

  const site = { title: config.title, description: config.description };
  const a = config.author || {};
  const author = {
    name: a.name, bio: a.bio, location: a.location, employer: a.employer,
    email: a.email, uri: a.uri, googlescholar: a.googlescholar,
    researchgate: a.researchgate, github: a.github, huggingface: a.huggingface,
    kaggle: a.kaggle, linkedin: a.linkedin,
  };

  const publications = readCollection('_publications').sort(byDateDesc);
  const portfolio = readCollection('_portfolio');
  const talks = readCollection('_talks').sort(byDateDesc);
  data.talks = talks; // the Highlights board derives from this
  const teaching = readCollection('_teaching').sort(byDateDesc);

  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  const written = [];
  const write = (file, html) => {
    fs.writeFileSync(path.join(OUT, file), html, 'utf8');
    written.push(file);
  };

  // Pulls the intro paragraph out of a _pages file so the copy lives there.
  const leadOf = (pageFile) => {
    const file = path.join(ROOT, '_pages', pageFile);
    if (!fs.existsSync(file)) return '';
    const m = fs.readFileSync(file, 'utf8').match(/<p class="page__lead">([\s\S]*?)<\/p>/);
    if (!m) return '';
    // leads may contain `{{ base_path }}` links — resolve them like any page body
    return rewriteLinks(stripLiquid(m[1]).replace(/\s+/g, ' ').trim());
  };

  /* --- index (about) ---------------------------------------------------- */
  const about = readDoc(path.join(ROOT, '_pages', 'about.md'));
  let aboutBody = about.body.replace(
    /\{%\s*assign recent_pubs[\s\S]*?\{%\s*endfor\s*%\}/,
    publications.slice(0, 5).map((doc) => {
      const d = doc.data;
      return `<div class="about_card"><div class="about_card__content">` +
        `<div class="about_card__content__title">${d.title}</div>` +
        `<div class="about_card__content__date">${d.venue || ''}${d.date ? ` &middot; ${docYear(doc)}` : ''}` +
        `${d.paperurl ? ` &middot; <a href="${escapeAttr(d.paperurl)}">Paper</a>` : ''}</div>` +
        `<div class="about_card__content__details">${inline(d.authors || '')}</div>` +
        `</div></div>`;
    }).join('\n')
  );
  write('index.html', shell({
    site, author, nav, currentFile: 'index.html',
    title: 'About Me', lead: '', toc: true,
    cvUrl: (nav.find((i) => i.title === 'CV') || {}).url,
    content: markdown(renderPageLiquid(aboutBody, data)),
  }));

  /* --- publications ----------------------------------------------------- */
  const pubCategories = config.publication_category || {};
  let pubHtml = scholarCard(data.scholar) +
    `\n<p>You can also find my articles on <a href="${escapeAttr(author.googlescholar)}">Google Scholar</a> and <a href="${author.researchgate}">ResearchGate</a>.</p>\n`;
  for (const key of Object.keys(pubCategories)) {
    const group = publications.filter((p) => p.data.category === key);
    if (!group.length) continue;
    pubHtml += `\n<h2>${pubCategories[key].title}</h2><hr />\n<div class="publications-grid">\n`;
    pubHtml += group.map(publicationCard).join('\n');
    pubHtml += `\n</div>\n`;
  }
  pubHtml += `\n<h2 id="research-interests">Research Interests</h2>\n` +
    `<p>The topics that make me excited to explore, test ideas, and chase answers &mdash; ` +
    `and where the work above is heading next.</p>\n` +
    interestsHtml(data.research_interests) + '\n';
  pubHtml += `\n<h2 id="ongoing-research">Ongoing Research</h2>\n` +
    `<p>Threads currently in progress &mdash; datasets being built, models being trained, ` +
    `papers not yet written.</p>\n` +
    ongoingHtml(data.ongoing_research) + '\n';
  write('publications.html', shell({
    site, author, nav, currentFile: 'publications.html',
    title: 'Publications', lead: leadOf('publications.html'), content: pubHtml,
  }));

  /* --- portfolio -------------------------------------------------------- */
  const portCategories = config.portfolio_category || {};
  let portHtml = '';
  for (const key of Object.keys(portCategories)) {
    const group = portfolio.filter((p) => p.data.category === key)
      .sort((x, y) => (y.data.year || 0) - (x.data.year || 0));
    if (!group.length) continue;
    portHtml += `\n<h2>${portCategories[key].title}</h2><hr />\n<div class="portfolio-grid">\n`;
    portHtml += group.map(portfolioCard).join('\n');
    portHtml += `\n</div>\n`;
  }
  write('projects.html', shell({
    site, author, nav, currentFile: 'projects.html',
    title: 'Projects', lead: leadOf('projects.html'), content: portHtml,
  }));

  /* --- talks / teaching ------------------------------------------------- */
  write('talks.html', shell({
    site, author, nav, currentFile: 'talks.html',
    title: 'Talks & Workshops', lead: leadOf('talks.html'),
    content: talks.map(talkCard).join('\n'),
  }));

  write('teaching.html', shell({
    site, author, nav, currentFile: 'teaching.html',
    title: 'Teaching', lead: leadOf('teaching.html'),
    content: teaching.map(teachingCard).join('\n'),
  }));

  /* --- data-driven pages ------------------------------------------------ */
  const liquidPages = [
    { src: 'adjudications.html', out: 'adjudications.html', title: 'Adjudications & Judging' },
    { src: 'awards.html', out: 'awards.html', title: 'Awards & Achievements' },
    { src: 'volunteering.html', out: 'volunteering.html', title: 'Volunteering' },
    { src: 'interests.html', out: 'interests.html', title: 'Interests & Hobbies' },
  ];
  for (const page of liquidPages) {
    const file = path.join(ROOT, '_pages', page.src);
    if (!fs.existsSync(file)) continue;
    const doc = readDoc(file);
    // the lead paragraph is promoted into the page header, so drop it from the body
    const body = doc.body.replace(/<p class="page__lead">[\s\S]*?<\/p>/, '');
    write(page.out, shell({
      site, author, nav, currentFile: page.out, title: page.title,
      lead: leadOf(page.src), content: renderPageLiquid(body, data),
    }));
  }

  console.log(`Static preview written to webpages/ (${written.length} pages):`);
  for (const f of written) console.log(`  - webpages/${f}`);
  console.log(`\nCollections: ${publications.length} publications, ${portfolio.length} projects, ` +
    `${talks.length} talks, ${teaching.length} teaching entries.`);
  console.log(`Data: ${data.research_interests.length} research interests, ${data.hobbies.length} hobbies, ` +
    `${(data.awards.achievements || []).length + (data.awards.honours || []).length} awards, ` +
    `${(data.volunteering.entries || []).length} volunteering, ` +
    `${(data.adjudications.competitions || []).length + (data.adjudications.peer_review || []).length} adjudications.`);
}

build();
