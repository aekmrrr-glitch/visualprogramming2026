export interface GeocodingResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

const API_KEY = '6ad1d850c1e547f23cd3eb3c8ce17748';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';

export async function searchCity(cityName: string): Promise<GeocodingResult[]> {
  try {
    const response = await fetch(
      `${GEO_URL}?q=${encodeURIComponent(cityName)}&limit=5&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding ошибка: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.map((item: any) => ({
      name: item.name,
      lat: item.lat,
      lon: item.lon,
      country: item.country,
      state: item.state
    }));
  } catch (error) {
    console.error('Geocoding API Error:', error);
    return [];
  }
}