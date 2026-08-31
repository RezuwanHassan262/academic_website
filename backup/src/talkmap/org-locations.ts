// Organization locations data for the map
export interface LocationPoint {
  location: string;
  latitude: number;
  longitude: number;
}

export const addressPoints: [string, number, number][] = [
  [
    "Berkeley CA, USA",
    37.8708393,
    -122.2728638
  ],
  [
    "London, UK",
    51.5073219,
    -0.1276473
  ],
  [
    "San Francisco, California",
    37.7792808,
    -122.4192362
  ],
  [
    "Los Angeles, CA",
    34.0543942,
    -118.2439408
  ]
];

// Make it available globally for compatibility
(window as any).addressPoints = addressPoints;