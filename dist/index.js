/**
 * Main entry point for the Academic Website TypeScript conversion
 *
 * This module exports all the main functionality converted from the original
 * Jekyll-based academic website to TypeScript.
 */
// Import all modules with specific exports to avoid conflicts
export { initializeMainScripts } from './assets/js/_main';
export { GreedyNavigation } from './assets/js/plugins/jquery.greedy-navigation';
export { CollapseModule } from './assets/js/collapse';
export * from './talkmap/talkmap';
export * from './talkmap/org-locations';
export { PublicationsGenerator, processPublications } from './markdown_generator/publications';
export { TalksGenerator, processTalks } from './markdown_generator/talks';
// Main application class
export class AcademicWebsiteApp {
    constructor() {
        this.initialized = false;
    }
    /**
     * Initialize the entire application
     */
    async init() {
        if (this.initialized) {
            console.warn('Application already initialized');
            return;
        }
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            // Initialize jQuery-based components
            this.initializeJQueryComponents();
            // Initialize other components
            this.initializeComponents();
            this.initialized = true;
            console.log('Academic Website App initialized successfully');
        }
        catch (error) {
            console.error('Failed to initialize Academic Website App:', error);
        }
    }
    /**
     * Initialize jQuery-based components
     */
    initializeJQueryComponents() {
        if (typeof window.$ === 'undefined') {
            console.warn('jQuery not found. Some features may not work.');
            return;
        }
        // jQuery components are auto-initialized via their own document.ready handlers
        console.log('jQuery components initialized');
    }
    /**
     * Initialize other TypeScript components
     */
    initializeComponents() {
        // Add any additional initialization logic here
        console.log('TypeScript components initialized');
    }
    /**
     * Check if the application is initialized
     */
    isInitialized() {
        return this.initialized;
    }
}
// Create global app instance
export const app = new AcademicWebsiteApp();
// Auto-initialize when the module is loaded
if (typeof window !== 'undefined') {
    app.init().catch(console.error);
}
//# sourceMappingURL=index.js.map