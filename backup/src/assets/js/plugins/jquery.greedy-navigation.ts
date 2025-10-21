/*
* Greedy Navigation
*
* http://codepen.io/lukejacksonn/pen/PwmwWV
*
*/

// Create a module to avoid global scope conflicts
export module GreedyNavigation {
  // Use global jQuery instead of import
  const $ = (window as any).$ || (window as any).jQuery;

  interface GreedyNavElements {
    nav: any;
    btn: any;
    vlinks: any;
    hlinks: any;
  }

  const greedyNav: GreedyNavElements = {
    nav: $('#site-nav'),
    btn: $('#site-nav button'),
    vlinks: $('#site-nav .visible-links'),
    hlinks: $('#site-nav .hidden-links')
  };

  let breaks: number[] = [];

  function updateNavigation(): void {
    const availableSpace: number = greedyNav.btn.hasClass('hidden') 
      ? greedyNav.nav.width() 
      : greedyNav.nav.width() - greedyNav.btn.width() - 30;

    // The visible list is overflowing the nav
    if (greedyNav.vlinks.width() > availableSpace) {
      // Record the width of the list
      breaks.push(greedyNav.vlinks.width());

      // Move item to the hidden list
      greedyNav.vlinks.children('*:not(.masthead__menu-item--lg)').last().prependTo(greedyNav.hlinks);

      // Show the dropdown btn
      if (greedyNav.btn.hasClass('hidden')) {
        greedyNav.btn.removeClass('hidden');
      }

    // The visible list is not overflowing
    } else {
      // There is space for another item in the nav
      if (breaks.length > 0 && availableSpace > breaks[breaks.length - 1]) {
        // Move the item to the visible list
        greedyNav.hlinks.children().first().appendTo(greedyNav.vlinks);
        breaks.pop();
      }

      // Hide the dropdown btn if hidden list is empty
      if (breaks.length < 1) {
        greedyNav.btn.addClass('hidden');
        greedyNav.hlinks.addClass('hidden');
      }
    }

    // Keep counter updated
    greedyNav.btn.attr("count", breaks.length.toString());

    // Recur if the visible list is still overflowing the nav
    if (greedyNav.vlinks.width() > availableSpace) {
      updateNavigation();
    }
  }

  // Initialize the greedy navigation
  export function init(): void {
    // Window listeners
    $(window).resize(function(): void {
      updateNavigation();
    });

    greedyNav.btn.on('click', function(this: any): void {
      greedyNav.hlinks.toggleClass('hidden');
      $(this).toggleClass('close');
    });

    updateNavigation();
  }
}

// Auto-initialize when DOM is ready
(window as any).$(document).ready(function(): void {
  GreedyNavigation.init();
});