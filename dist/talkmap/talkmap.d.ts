/**
 * Leaflet cluster map of talk locations
 *
 * TypeScript version of the original Python script
 * (c) 2016-2017 R. Stuart Geiger, released under the MIT license
 *
 * Browser-compatible version for generating talk maps
 */
interface LocationData {
    location: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}
interface MarkdownFile {
    name: string;
    content: string;
}
export declare class TalkMapGenerator {
    private locationDict;
    /**
     * Extract location from markdown file content
     */
    private extractLocation;
    /**
     * Geocode a location using Nominatim API
     */
    private geocodeLocation;
    /**
     * Process markdown files and extract locations
     */
    processMarkdownFiles(files: MarkdownFile[]): Promise<void>;
    /**
     * Generate the JavaScript content for the map
     */
    generateLocationJS(): string;
    /**
     * Generate the HTML map content
     */
    generateMapHTML(): string;
    /**
     * Get the current location data
     */
    getLocationData(): Map<string, LocationData>;
}
/**
 * Helper function to download generated files
 */
export declare function downloadFile(content: string, filename: string, mimeType?: string): void;
/**
 * Main function to generate talk map
 */
export declare function generateTalkMap(markdownFiles: MarkdownFile[]): Promise<{
    jsContent: string;
    htmlContent: string;
    locationData: Map<string, LocationData>;
}>;
export {};
