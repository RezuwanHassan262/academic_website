// Global type declarations for the academic website
export {};

declare global {
  interface Window {
    fitvids: () => void;
    jQuery: JQueryStatic;
    $: JQueryStatic;
  }

  interface MagnificPopupSettings {
    image: {
      markup: string;
    };
  }

  interface MagnificPopupInstance {
    st: MagnificPopupSettings;
  }

  interface MagnificPopupOptions {
    type: string;
    tLoading?: string;
    gallery?: {
      enabled: boolean;
      navigateByImgClick: boolean;
      preload: number[];
    };
    image?: {
      tError: string;
    };
    removalDelay?: number;
    mainClass?: string;
    callbacks?: {
      beforeOpen?: (this: MagnificPopupInstance) => void;
    };
    closeOnContentClick?: boolean;
    midClick?: boolean;
  }

  interface JQueryStatic {
    (selector: string): JQuery;
    (element: Element): JQuery;
    (callback: () => void): JQuery;
  }

  interface JQuery {
    smoothScroll(options: { offset: number }): JQuery;
    magnificPopup(options: MagnificPopupOptions): JQuery;
    fadeToggle(speed: string, callback: () => void): JQuery;
    css(property: string): string;
    css(property: string, value: string | number): JQuery;
    addClass(className: string): JQuery;
    toggleClass(className: string): JQuery;
    on(event: string, handler: () => void): JQuery;
    resize(handler: () => void): JQuery;
    width(): number | undefined;
    outerHeight(includeMargin?: boolean): number | undefined;
    ready(callback: () => void): JQuery;
  }
}