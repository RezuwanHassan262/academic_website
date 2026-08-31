/**
 * Talks markdown generator for academicpages
 *
 * TypeScript version of the original Python script
 * Takes a TSV of talks with metadata and converts them for use with academicpages.github.io
 */
interface TalkData {
    title: string;
    type: string;
    url_slug: string;
    venue: string;
    date: string;
    location: string;
    talk_url: string;
    description: string;
}
export declare class TalksGenerator {
    private talks;
    /**
     * Parse TSV content into structured data
     */
    parseTSV(tsvContent: string): TalkData[];
    /**
     * Escape special characters for HTML
     */
    private htmlEscape;
    /**
     * Generate markdown content for a single talk
     */
    private generateMarkdownForTalk;
    /**
     * Generate all markdown files for talks
     */
    generateMarkdownFiles(): {
        filename: string;
        content: string;
    }[];
    /**
     * Get location dictionary for map generation
     */
    getLocationDictionary(): {
        [key: string]: string;
    };
    /**
     * Download generated files (browser implementation)
     */
    downloadFiles(files: {
        filename: string;
        content: string;
    }[]): void;
    /**
     * Helper function to download a single file
     */
    private downloadFile;
}
/**
 * Main function to process talks TSV and generate markdown files
 */
export declare function processTalks(tsvContent: string): {
    files: {
        filename: string;
        content: string;
    }[];
    locations: {
        [key: string]: string;
    };
};
/**
 * Example usage function
 */
export declare function exampleUsage(): void;
export {};
