/**
 * Talks markdown generator for academicpages
 *
 * TypeScript version of the original Python script
 * Takes a TSV of talks with metadata and converts them for use with academicpages.github.io
 */
export class TalksGenerator {
    constructor() {
        this.talks = [];
    }
    /**
     * Parse TSV content into structured data
     */
    parseTSV(tsvContent) {
        const lines = tsvContent.trim().split('\n');
        const headers = lines[0].split('\t');
        const talks = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split('\t');
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            talks.push({
                title: row.title || '',
                type: row.type || 'Talk',
                url_slug: row.url_slug || '',
                venue: row.venue || '',
                date: row.date || '',
                location: row.location || '',
                talk_url: row.talk_url || '',
                description: row.description || ''
            });
        }
        this.talks = talks;
        return talks;
    }
    /**
     * Escape special characters for HTML
     */
    htmlEscape(text) {
        if (typeof text !== 'string') {
            return 'False';
        }
        const htmlEscapeTable = {
            "&": "&amp;",
            '"': "&quot;",
            "'": "&apos;"
        };
        return text.replace(/[&"']/g, (match) => htmlEscapeTable[match] || match);
    }
    /**
     * Generate markdown content for a single talk
     */
    generateMarkdownForTalk(talk) {
        const htmlFilename = `${talk.date}-${talk.url_slug}`;
        let md = `---\ntitle: "${talk.title}"\n`;
        md += `collection: talks\n`;
        if (talk.type && talk.type.length > 3) {
            md += `type: "${talk.type}"\n`;
        }
        else {
            md += `type: "Talk"\n`;
        }
        md += `permalink: /talks/${htmlFilename}\n`;
        if (talk.venue && talk.venue.length > 3) {
            md += `venue: "${talk.venue}"\n`;
        }
        if (talk.location && talk.location.length > 3) {
            md += `date: ${talk.date}\n`;
        }
        if (talk.location && talk.location.length > 3) {
            md += `location: "${talk.location}"\n`;
        }
        md += `---\n`;
        // Additional content for the talk page
        if (talk.talk_url && talk.talk_url.length > 3) {
            md += `\n[More information here](${talk.talk_url})\n`;
        }
        if (talk.description && talk.description.length > 3) {
            md += `\n${this.htmlEscape(talk.description)}\n`;
        }
        return md;
    }
    /**
     * Generate all markdown files for talks
     */
    generateMarkdownFiles() {
        const files = [];
        this.talks.forEach((talk) => {
            const filename = `${talk.date}-${talk.url_slug}.md`;
            const content = this.generateMarkdownForTalk(talk);
            files.push({ filename, content });
        });
        return files;
    }
    /**
     * Get location dictionary for map generation
     */
    getLocationDictionary() {
        const locDict = {};
        this.talks.forEach((talk) => {
            if (talk.location && talk.location.length > 3) {
                locDict[talk.location] = talk.location;
            }
        });
        return locDict;
    }
    /**
     * Download generated files (browser implementation)
     */
    downloadFiles(files) {
        files.forEach(file => {
            this.downloadFile(file.content, file.filename, 'text/markdown');
        });
    }
    /**
     * Helper function to download a single file
     */
    downloadFile(content, filename, mimeType = 'text/plain') {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
/**
 * Main function to process talks TSV and generate markdown files
 */
export function processTalks(tsvContent) {
    const generator = new TalksGenerator();
    generator.parseTSV(tsvContent);
    const files = generator.generateMarkdownFiles();
    const locations = generator.getLocationDictionary();
    return { files, locations };
}
/**
 * Example usage function
 */
export function exampleUsage() {
    const exampleTSV = `title	type	url_slug	venue	date	location	talk_url	description
Example Talk	Conference talk	example-talk	Example Conference	2024-01-01	New York, NY	https://example.com	This is an example talk description.`;
    const result = processTalks(exampleTSV);
    console.log('Generated files:', result.files);
    console.log('Locations:', result.locations);
}
//# sourceMappingURL=talks.js.map