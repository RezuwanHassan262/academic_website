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

interface GeocodingResult {
  lat: number;
  lng: number;
  display_name: string;
}

interface MarkdownFile {
  name: string;
  content: string;
}

export class TalkMapGenerator {
  private locationDict: Map<string, LocationData> = new Map();

  /**
   * Extract location from markdown file content
   */
  private extractLocation(content: string): string | null {
    const locationMatch = content.match(/location:\s*"([^"]+)"/);
    return locationMatch ? locationMatch[1] : null;
  }

  /**
   * Geocode a location using Nominatim API
   */
  private async geocodeLocation(location: string): Promise<GeocodingResult | null> {
    try {
      const encodedLocation = encodeURIComponent(location);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}&limit=1`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        return {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          display_name: result.display_name
        };
      }
      return null;
    } catch (error) {
      console.error(`Error geocoding location ${location}:`, error);
      return null;
    }
  }

  /**
   * Process markdown files and extract locations
   */
  public async processMarkdownFiles(files: MarkdownFile[]): Promise<void> {
    for (const file of files) {
      try {
        const location = this.extractLocation(file.content);
        
        if (location && location.trim() !== '') {
          console.log(`Processing location: ${location}`);
          
          if (!this.locationDict.has(location)) {
            const coordinates = await this.geocodeLocation(location);
            this.locationDict.set(location, {
              location,
              ...(coordinates && { coordinates })
            });
            
            console.log(`Geocoded: ${location}`, coordinates);
            
            // Add delay to respect API rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
      }
    }
  }

  /**
   * Generate the JavaScript content for the map
   */
  public generateLocationJS(): string {
    const addressPoints: [string, number, number][] = [];
    
    this.locationDict.forEach((data) => {
      if (data.coordinates) {
        addressPoints.push([
          data.location,
          data.coordinates.lat,
          data.coordinates.lng
        ]);
      }
    });

    return `var addressPoints = ${JSON.stringify(addressPoints, null, 2)};`;
  }

  /**
   * Generate the HTML map content
   */
  public generateMapHTML(): string {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Talk Map</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <link rel="stylesheet" href="leaflet_dist/MarkerCluster.css" />
    <link rel="stylesheet" href="leaflet_dist/MarkerCluster.Default.css" />
    <style>
        #map { height: 500px; }
    </style>
</head>
<body>
    <div id="map"></div>
    
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="leaflet_dist/leaflet.markercluster.js"></script>
    <script src="org-locations.js"></script>
    <script>
        var map = L.map('map').setView([40.0, -100.0], 4);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        var markers = L.markerClusterGroup();
        
        for (var i = 0; i < addressPoints.length; i++) {
            var a = addressPoints[i];
            var title = a[0];
            var marker = L.marker(new L.LatLng(a[1], a[2]), { title: title });
            marker.bindPopup(title);
            markers.addLayer(marker);
        }
        
        map.addLayer(markers);
    </script>
</body>
</html>`;
  }

  /**
   * Get the current location data
   */
  public getLocationData(): Map<string, LocationData> {
    return this.locationDict;
  }
}

/**
 * Helper function to download generated files
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
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

/**
 * Main function to generate talk map
 */
export async function generateTalkMap(markdownFiles: MarkdownFile[]): Promise<{
  jsContent: string;
  htmlContent: string;
  locationData: Map<string, LocationData>;
}> {
  const generator = new TalkMapGenerator();
  await generator.processMarkdownFiles(markdownFiles);
  
  const jsContent = generator.generateLocationJS();
  const htmlContent = generator.generateMapHTML();
  const locationData = generator.getLocationData();
  
  return {
    jsContent,
    htmlContent,
    locationData
  };
}