import type {
  GeoResponse,
  GeoResult,
  WeatherResponse,
} from "../types/weather.types";

const GEO_BASE = "https://geocoding-api.open-meteo.com/v1";
const WEATHER_BASE = "https://api.open-meteo.com/v1";

// Step 1 — city name → lat/lon coordinates
export async function geocodeCity(city: string): Promise<GeoResult> {
  const res = await fetch(
    `${GEO_BASE}/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
  );
  if (!res.ok) throw new Error("Could not reach geocoding service.");

  const data: GeoResponse = await res.json();

  // results is undefined or empty when city is not found
  if (!data.results || data.results.length === 0) {
    throw new Error("City not found. Check the spelling.");
  }
  return data.results[0];
}

// Step 2 — lat/lon → weather data
export async function fetchWeatherByCoords(
  lat: number,
  lon: number,
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day",
    daily: "temperature_2m_max,temperature_2m_min,weather_code",
    timezone: "auto",
    forecast_days: "5",
  });
  const res = await fetch(`${WEATHER_BASE}/forecast?${params}`);
  if (!res.ok) throw new Error("Could not fetch weather data.");
  return res.json() as Promise<WeatherResponse>;
}

// WMO code → human readable description
export function getWeatherDescription(code: number): string {
  const map: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Icy fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Slight showers",
    81: "Moderate showers",
    82: "Violent showers",
    95: "Thunderstorm",
    99: "Thunderstorm with hail",
  };
  return map[code] ?? "Unknown";
}

// WMO code → emoji (no image URL needed)
export function getWeatherEmoji(code: number, isDay = 1): string {
  if (code === 0) return isDay ? "☀️" : "🌙";
  if (code <= 2) return isDay ? "🌤️" : "🌙";
  if (code === 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 55) return "🌦️";
  if (code <= 65) return "🌧️";
  if (code <= 75) return "❄️";
  if (code <= 82) return "🌦️";
  if (code <= 99) return "⛈️";
  return "🌡️";
}
