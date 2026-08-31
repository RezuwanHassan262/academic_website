/**
 * Main entry point for the Academic Website TypeScript conversion
 *
 * This module exports all the main functionality converted from the original
 * Jekyll-based academic website to TypeScript.
 */
export { initializeMainScripts } from './assets/js/_main';
export { GreedyNavigation } from './assets/js/plugins/jquery.greedy-navigation';
export { CollapseModule } from './assets/js/collapse';
export * from './talkmap/talkmap';
export * from './talkmap/org-locations';
export { PublicationsGenerator, processPublications } from './markdown_generator/publications';
export { TalksGenerator, processTalks } from './markdown_generator/talks';
export declare class AcademicWebsiteApp {
    private initialized;
    /**
     * Initialize the entire application
     */
    init(): Promise<void>;
    /**
     * Initialize jQuery-based components
     */
    private initializeJQueryComponents;
    /**
     * Initialize other TypeScript components
     */
    private initializeComponents;
    /**
     * Check if the application is initialized
     */
    isInitialized(): boolean;
}
export declare const app: AcademicWebsiteApp;
