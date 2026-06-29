import type { City } from "@/lib/geo";

export const CITIES: City[] = [
  { id: "nyc", name: "New York", country: "USA", center: [-73.9857, 40.7484] },
  { id: "la", name: "Los Angeles", country: "USA", center: [-118.2437, 34.0522] },
  { id: "london", name: "London", country: "UK", center: [-0.1276, 51.5072] },
  { id: "paris", name: "Paris", country: "France", center: [2.3522, 48.8566] },
  { id: "tokyo", name: "Tokyo", country: "Japan", center: [139.6917, 35.6895] },
  { id: "berlin", name: "Berlin", country: "Germany", center: [13.405, 52.52] },
  { id: "amsterdam", name: "Amsterdam", country: "Netherlands", center: [4.9041, 52.3676] },
  { id: "sydney", name: "Sydney", country: "Australia", center: [151.2093, -33.8688] },
];

export function findCity(id: string): City | undefined {
  return CITIES.find((c) => c.id === id);
}
