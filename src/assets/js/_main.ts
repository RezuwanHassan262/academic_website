/* ==========================================================================
   jQuery plugin settings and other scripts
   ========================================================================== */

// Use global jQuery instead of import
const $ = (window as any).$ || (window as any).jQuery;

export function initializeMainScripts(): void {
  $(document).ready(function(): void {
    // These should be the same as the settings in _variables.scss
    const scssLarge: number = 925; // pixels

    // Sticky footer
    const bumpIt = function(): void {
        $("body").css("margin-bottom", $(".page__footer").outerHeight(true) || 0);
      };
    let didResize: boolean = false;

    bumpIt();

    $(window).resize(function(): void {
      didResize = true;
    });
    
    setInterval(function(): void {
      if (didResize) {
        didResize = false;
        bumpIt();
      }
    }, 250);
    
    // FitVids init
    if ((window as any).fitvids) {
      (window as any).fitvids();
    }

    // Follow menu drop down
    $(".author__urls-wrapper button").on("click", function(): void {
      $(".author__urls").fadeToggle("fast", function(): void {});
      $(".author__urls-wrapper button").toggleClass("open");
    });

    // Restore the follow menu if toggled on a window resize
    $(window).on('resize', function(): void {
      const windowWidth = $(window).width();
      if ($('.author__urls.social-icons').css('display') === 'none' && windowWidth && windowWidth >= scssLarge) {
        $(".author__urls").css('display', 'block');
      }
    });    

    // init smooth scroll, this needs to be slightly more than then fixed masthead height
    $("a").smoothScroll({offset: -65});

    // add lightbox class to all image links
    $("a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.gif']").addClass("image-popup");

    // Magnific-Popup options
    $(".image-popup").magnificPopup({
      type: 'image',
      tLoading: 'Loading image #%curr%...',
      gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0,1] // Will preload 0 - before current, and 1 after the current image
      },
      image: {
        tError: '<a href="%url%">Image #%curr%</a> could not be loaded.',
      },
      removalDelay: 500, // Delay in milliseconds before popup is removed
      // Class that is added to body when popup is open.
      // make it unique to apply your CSS animations just to this exact popup
      mainClass: 'mfp-zoom-in',
      callbacks: {
        beforeOpen: function(): void {
          // just a hack that adds mfp-anim class to markup
          (this as any).st.image.markup = (this as any).st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
        }
      },
      closeOnContentClick: true,
      midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
    });
  });
}

// Auto-initialize
initializeMainScripts();