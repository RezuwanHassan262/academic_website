// Collapse functionality for expandable sections
export module CollapseModule {
  // Use global jQuery
  const $ = (window as any).$ || (window as any).jQuery;

  export function init(): void {
    $(".header").click(function(this: any): void {
      const $header = $(this);
      // Getting the next element
      const $content = $header.next();
      
      // Open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
      $content.slideToggle(500, function(): void {
        // Execute this after slideToggle is done
        // Change text of header based on visibility of content div
        $header.text(function(): string {
          // Change text based on condition
          return $content.is(":visible") ? "Collapse" : "Expand";
        });
      });
    });
  }
}

// Auto-initialize when DOM is ready
(window as any).$(document).ready(function(): void {
  CollapseModule.init();
});