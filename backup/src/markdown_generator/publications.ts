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

interface ParsedCSVRow {
  [key: string]: string;
}

export class PublicationsGenerator {
  private publications: PublicationData[] = [];

  /**
   * Parse TSV content into structured data
   */
  public parseTSV(tsvContent: string): PublicationData[] {
    const lines = tsvContent.trim().split('\n');
    const headers = lines[0].split('\t');
    const publications: PublicationData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split('\t');
      const row: ParsedCSVRow = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      publications.push({
        pub_date: row.pub_date || '',
        title: row.title || '',
        venue: row.venue || '',
        excerpt: row.excerpt || '',
        citation: row.citation || '',
        site_url: row.site_url || '',
        paper_url: row.paper_url || '',
        url_slug: row.url_slug || ''
      });
    }

    this.publications = publications;
    return publications;
  }

  /**
   * Escape special characters for HTML
   */
  private htmlEscape(text: string): string {
    const htmlEscapeTable: { [key: string]: string } = {
      "&": "&amp;",
      '"': "&quot;",
      "'": "&apos;"
    };

    return text.replace(/[&"']/g, (match) => htmlEscapeTable[match] || match);
  }

  /**
   * Generate markdown content for a single publication
   */
  private generateMarkdownForPublication(publication: PublicationData): string {
    const htmlFilename = `${publication.pub_date}-${publication.url_slug}`;

    let md = `---\ntitle: "${publication.title}"\n`;
    md += `collection: publications`;
    md += `\npermalink: /publication/${htmlFilename}`;

    if (publication.excerpt && publication.excerpt.length > 5) {
      md += `\nexcerpt: '${this.htmlEscape(publication.excerpt)}'`;
    }

    md += `\ndate: ${publication.pub_date}`;
    md += `\nvenue: '${this.htmlEscape(publication.venue)}'`;

    if (publication.paper_url && publication.paper_url.length > 5) {
      md += `\npaperurl: '${publication.paper_url}'`;
    }

    md += `\ncitation: '${this.htmlEscape(publication.citation)}'`;
    md += `\n---`;

    // Markdown description for individual page
    if (publication.paper_url && publication.paper_url.length > 5) {
      md += `\n\n<a href='${publication.paper_url}'>Download paper here</a>\n`;
    }

    if (publication.excerpt && publication.excerpt.length > 5) {
      md += `\n${this.htmlEscape(publication.excerpt)}\n`;
    }

    md += `\nRecommended citation: ${publication.citation}`;

    return md;
  }

  /**
   * Generate all markdown files for publications
   */
  public generateMarkdownFiles(): { filename: string; content: string }[] {
    const files: { filename: string; content: string }[] = [];

    this.publications.forEach((publication) => {
      const filename = `${publication.pub_date}-${publication.url_slug}.md`;
      const content = this.generateMarkdownForPublication(publication);
      files.push({ filename, content });
    });

    return files;
  }

  /**
   * Download generated files as a zip (browser implementation)
   */
  public downloadFiles(files: { filename: string; content: string }[]): void {
    files.forEach(file => {
      this.downloadFile(file.content, file.filename, 'text/markdown');
    });
  }

  /**
   * Helper function to download a single file
   */
  private downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
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
 * Main function to process publications TSV and generate markdown files
 */
export function processPublications(tsvContent: string): { filename: string; content: string }[] {
  const generator = new PublicationsGenerator();
  generator.parseTSV(tsvContent);
  return generator.generateMarkdownFiles();
}

/**
 * Example usage function
 */
export function exampleUsage(): void {
  const exampleTSV = `pub_date	title	venue	excerpt	citation	site_url	paper_url	url_slug
2024-01-01	Example Paper	Example Conference	This is an example paper	Author et al. (2024). Example Paper. Example Conference.	https://example.com	https://example.com/paper.pdf	example-paper`;

  const files = processPublications(exampleTSV);
  console.log('Generated files:', files);
}