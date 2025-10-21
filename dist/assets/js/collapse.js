// Collapse functionality for expandable sections
export var CollapseModule;
(function (CollapseModule) {
    // Use global jQuery
    const $ = window.$ || window.jQuery;
    function init() {
        $(".header").click(function () {
            const $header = $(this);
            // Getting the next element
            const $content = $header.next();
            // Open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
            $content.slideToggle(500, function () {
                // Execute this after slideToggle is done
                // Change text of header based on visibility of content div
                $header.text(function () {
                    // Change text based on condition
                    return $content.is(":visible") ? "Collapse" : "Expand";
                });
            });
        });
    }
    CollapseModule.init = init;
})(CollapseModule || (CollapseModule = {}));
// Auto-initialize when DOM is ready
window.$(document).ready(function () {
    CollapseModule.init();
});
//# sourceMappingURL=collapse.js.map