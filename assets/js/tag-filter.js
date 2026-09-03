/**
 * Topic tag filter for the Publications and Projects pages.
 *
 * Progressive enhancement: the pages are static HTML and render every entry
 * with no JavaScript at all. This only adds a filter bar on top.
 *
 * The filter list is DERIVED from the page rather than hand-maintained, so
 * adding a <span class="tag"> to an entry automatically adds that tag to the
 * bar and removes it again when the last entry carrying it goes away.
 *
 * Markup contract:
 *   <div class="tag-filter" data-tag-filter=".publication-item"></div>
 * where the attribute is a CSS selector matching the filterable entries. The
 * container is filled in at runtime.
 *
 * Groups (an <h2>, its <hr> and the following grid) are hidden when every entry
 * inside them is filtered out, so a filtered view never leaves a bare heading.
 */
(function () {
  'use strict';

  var HIDDEN = 'data-filter-hidden';
  var EMPTY = 'tag-filter__empty';

  function tagsOf(item) {
    return Array.prototype.map.call(item.querySelectorAll('.tag'), function (t) {
      return t.textContent.trim();
    }).filter(Boolean);
  }

  function init(bar) {
    var selector = bar.getAttribute('data-tag-filter');
    if (!selector) return;

    var items = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!items.length) return;

    // Two modes.
    //
    // Default: derive one button per distinct tag on the page, commonest first.
    //
    // Curated: when data-tag-groups holds a JSON object of
    //   {"Button label": ["underlying", "tags"]}
    // only those buttons are shown, in the order given, and a button matches an
    // entry carrying ANY of its tags. That is what lets one button stand for a
    // group ("Speech NLP" covering ASR/Whisper/Wav2Vec2) or simply rename one
    // ("Natural Language Processing" for the tag spelled "NLP").
    var groups = null;
    var raw = bar.getAttribute('data-tag-groups');
    if (raw) {
      try {
        groups = JSON.parse(raw);
      } catch (e) {
        // A malformed attribute must not cost the reader the whole filter bar.
        if (window.console) console.warn('tag-filter: data-tag-groups is not valid JSON — falling back to derived tags.', e);
        groups = null;
      }
    }

    var labels;
    if (groups) {
      labels = Object.keys(groups);
    } else {
      var counts = {};
      items.forEach(function (item) {
        tagsOf(item).forEach(function (tag) {
          counts[tag] = (counts[tag] || 0) + 1;
        });
      });
      labels = Object.keys(counts).sort(function (a, b) {
        return b.length && counts[b] - counts[a] || a.localeCompare(b);
      });
    }
    if (!labels.length) return;

    // Tags a given button stands for.
    function tagsFor(label) {
      if (!groups) return [label];
      var list = groups[label];
      return Object.prototype.toString.call(list) === '[object Array]' ? list : [label];
    }

    function matches(item, label) {
      var has = tagsOf(item);
      var wanted = tagsFor(label);
      for (var i = 0; i < wanted.length; i++) {
        if (has.indexOf(wanted[i]) !== -1) return true;
      }
      return false;
    }

    var grids = Array.prototype.slice.call(
      document.querySelectorAll('.publications-grid, .portfolio-grid')
    );

    var status = document.createElement('span');
    status.className = 'tag-filter__count';
    status.setAttribute('role', 'status');

    var buttons = [];

    function apply(active) {
      var shown = 0;
      items.forEach(function (item) {
        var match = active === null || matches(item, active);
        if (match) { item.removeAttribute(HIDDEN); shown++; }
        else { item.setAttribute(HIDDEN, ''); }
      });

      // Hide a group heading, its rule and its grid once the grid is empty.
      grids.forEach(function (grid) {
        var visible = Array.prototype.some.call(grid.children, function (child) {
          return !child.hasAttribute(HIDDEN);
        });
        [grid, grid.previousElementSibling, grid.previousElementSibling
          && grid.previousElementSibling.previousElementSibling].forEach(function (el) {
          if (!el) return;
          if (el !== grid && el.tagName !== 'HR' && el.tagName !== 'H2') return;
          el.classList.toggle(EMPTY, !visible);
        });
      });

      buttons.forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(btn.dataset.tag === (active || '')));
      });

      status.textContent = active
        ? shown + ' of ' + items.length + ' shown'
        : items.length + ' total';
    }

    function addButton(label, tag) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tag-filter__btn';
      btn.textContent = label;
      btn.dataset.tag = tag;
      btn.setAttribute('aria-pressed', 'false');
      btn.addEventListener('click', function () {
        // Clicking the active tag again clears the filter.
        var active = btn.getAttribute('aria-pressed') === 'true' ? null : (tag || null);
        apply(active);
      });
      bar.appendChild(btn);
      buttons.push(btn);
      return btn;
    }

    addButton('All', '');
    labels.forEach(function (label) { addButton(label, label); });
    bar.appendChild(status);

    apply(null);
  }

  function boot() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-tag-filter]'), init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
