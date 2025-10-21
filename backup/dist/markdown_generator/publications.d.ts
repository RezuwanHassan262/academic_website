/**
 * Publications markdown generator for academicpages
 *
 * TypeScript version of the original Python script
 * Takes a TSV of publications with metadata and converts them for use with academicpages.github.io
 */
interface PublicationData {
    pub_date: string;
    title: string;
    venue: string;
    excerpt: string;
    citation: string;
    site_url: string;
    paper_url: string;
    url_slug: string;
}
export declare class PublicationsGenerator {
    private publications;
    /**
     * Parse TSV content into structured data
     */
    parseTSV(tsvContent: string): PublicationData[];
    /**
     * Escape special characters for HTML
     */
    private htmlEscape;
    /**
     * Generate markdown content for a single publication
     */
    private generateMarkdownForPublication;
    /**
     * Generate all markdown files for publications
     */
    generateMarkdownFiles(): {
        filename: string;
        content: string;
    }[];
    /**
     * Download generated files as a zip (browser implementation)
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
 * Main function to process publications TSV and generate markdown files
 */
export declare function processPublications(tsvContent: string): {
    filename: string;
    content: string;
}[];
/**
 * Example usage function
 */
export declare function exampleUsage(): void;
export {};
