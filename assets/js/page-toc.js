/**
 * Page TOC scroll-spy.
 *
 * Highlights the "On this page" entry for the section currently in view.
 * No-ops when the page has no `.page-toc`.
 */
(function () {
  'use strict';

  // The sticky nav overlaps whatever an in-page link jumps to. Publish its
  // real height as --nav-h so CSS scroll-margin-top can clear it; the height
  // changes as the nav wraps, so re-measure whenever it can have changed.
  function trackNavHeight() {
    var nav = document.querySelector(".site-nav");
    if (!nav) return function () { return 0; };
    var height = 0;
    function measure() {
      height = Math.round(nav.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--nav-h", height + "px");
    }
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    if (window.ResizeObserver) new ResizeObserver(measure).observe(nav);
    return function () { return height; };
  }

  function init() {
    var navHeight = trackNavHeight();
    var toc = document.querySelector('.page-toc');
    if (!toc) return;

    var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
    var targets = links
      .map(function (a) {
        return { link: a, el: document.getElementById(decodeURIComponent(a.hash.slice(1))) };
      })
      .filter(function (t) { return t.el; });

    if (!targets.length) return;

    function sync() {
      var top = window.scrollY + navHeight() + 24;
      var current = targets[0];
      for (var i = 0; i < targets.length; i++) {
        if (targets[i].el.offsetTop <= top) current = targets[i];
      }
      links.forEach(function (a) { a.classList.toggle('is-active', a === current.link); });
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { sync(); ticking = false; });
    }, { passive: true });

    sync();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
