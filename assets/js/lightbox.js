/**
 * Lightbox
 *
 * Click any content image to open it full-size in an overlay.
 *
 *   close     Esc, the X button, or a click on the backdrop
 *   navigate  Left/Right arrow keys, the on-screen chevrons, or a swipe
 *
 * Images are grouped per gallery/strip/grid so the arrows step through the
 * photos of one event rather than every image on the page. Images that are
 * chrome rather than content (avatar, logos, icons, badges) are skipped, as are
 * images already wrapped in a link — the link is what the visitor wanted.
 */

(function () {
  'use strict';

  // Images that are UI furniture, not content worth enlarging.
  var SKIP_SELECTOR = [
    '.author__avatar img',
    '.author__avatar-image',
    '.about_card__logo',
    '.icon-card__img',
    '.platform-link img',
    '.site-title img',
    '.no-lightbox',
  ].join(',');

  // Containers that define a navigation group.
  var GROUP_SELECTOR = '.gallery-strip, .highlight-card__strip, .portfolio-grid, .publications-grid';

  var overlay, imgEl, captionEl, counterEl, prevBtn, nextBtn;
  var group = [];
  var index = 0;
  var lastFocused = null;

  function isEligible(img) {
    if (img.closest(SKIP_SELECTOR)) return false;
    if (img.matches(SKIP_SELECTOR)) return false;
    if (img.closest('a')) return false;
    if (img.closest('.lightbox')) return false;
    return true;
  }

  function collect() {
    return Array.prototype.filter.call(document.images, isEligible);
  }

  function groupFor(img) {
    var container = img.closest(GROUP_SELECTOR);
    var scope = container
      ? Array.prototype.slice.call(container.querySelectorAll('img'))
      : collect();
    var eligible = scope.filter(isEligible);
    return eligible.length ? eligible : [img];
  }

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image viewer');
    overlay.hidden = true;

    overlay.innerHTML =
      '<button class="lightbox__close" type="button" aria-label="Close (Esc)">&times;</button>' +
      '<button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous image">&#10094;</button>' +
      '<figure class="lightbox__stage">' +
      '  <img class="lightbox__img" alt="">' +
      '  <figcaption class="lightbox__caption"></figcaption>' +
      '</figure>' +
      '<button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next image">&#10095;</button>' +
      '<div class="lightbox__counter" aria-live="polite"></div>';

    document.body.appendChild(overlay);

    imgEl = overlay.querySelector('.lightbox__img');
    captionEl = overlay.querySelector('.lightbox__caption');
    counterEl = overlay.querySelector('.lightbox__counter');
    prevBtn = overlay.querySelector('.lightbox__nav--prev');
    nextBtn = overlay.querySelector('.lightbox__nav--next');

    overlay.querySelector('.lightbox__close').addEventListener('click', close);
    prevBtn.addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
    nextBtn.addEventListener('click', function (e) { e.stopPropagation(); step(1); });

    // A click on the backdrop closes; a click on the image itself does not.
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.closest('.lightbox__stage') === null) close();
    });
    imgEl.addEventListener('click', function (e) { e.stopPropagation(); });

    addSwipe();
  }

  function show(i) {
    index = (i + group.length) % group.length;
    var source = group[index];
    imgEl.src = source.currentSrc || source.src;
    imgEl.alt = source.alt || '';
    var caption = source.alt || (source.closest('figure') ? (source.closest('figure').querySelector('figcaption') || {}).textContent : '') || '';
    captionEl.textContent = caption.trim();
    captionEl.hidden = !caption.trim();
    counterEl.textContent = group.length > 1 ? index + 1 + ' / ' + group.length : '';
    var many = group.length > 1;
    prevBtn.hidden = !many;
    nextBtn.hidden = !many;
  }

  function step(delta) {
    if (group.length > 1) show(index + delta);
  }

  function open(img) {
    if (!overlay) build();
    group = groupFor(img);
    lastFocused = document.activeElement;
    show(group.indexOf(img));
    overlay.hidden = false;
    document.body.classList.add('lightbox-open');
    overlay.querySelector('.lightbox__close').focus();
  }

  function close() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    imgEl.removeAttribute('src');
    document.body.classList.remove('lightbox-open');
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function addSwipe() {
    var startX = null;
    overlay.addEventListener('touchstart', function (e) {
      startX = e.changedTouches[0].clientX;
    }, { passive: true });
    overlay.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
      startX = null;
    }, { passive: true });
  }

  // One delegated listener, so images added later still work.
  document.addEventListener('click', function (e) {
    var img = e.target.closest ? e.target.closest('img') : null;
    if (!img || !isEligible(img)) return;
    e.preventDefault();
    open(img);
  });

  document.addEventListener('keydown', function (e) {
    if (!overlay || overlay.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
  });

  // Mark eligible images so CSS can show a zoom cursor.
  function markEligible() {
    collect().forEach(function (img) { img.classList.add('is-zoomable'); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', markEligible);
  } else {
    markEligible();
  }
})();
