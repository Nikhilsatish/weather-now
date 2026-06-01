import { useState, useCallback } from "react";
import { geocodeCity, fetchWeatherByCoords } from "../api/weather";
import type { WeatherState } from "../types/weather.types";

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    city: null,
    country: null,
    current: null,
    daily: null,
    loading: false,
    error: null,
  });

  const search = useCallback(async (cityName: string) => {
    if (!cityName.trim()) return;

    // Clear old data, start loading
    setState({
      city: null,
      country: null,
      current: null,
      daily: null,
      loading: true,
      error: null,
    });

    try {
      // Step 1 — geocode: city name → lat/lon
      const geoResult = await geocodeCity(cityName);

      // Step 2 — fetch weather using coordinates
      const weatherData = await fetchWeatherByCoords(
        geoResult.latitude,
        geoResult.longitude,
      );

      setState({
        city: geoResult.name, // from geocoding
        country: geoResult.country_code, // from geocoding
        current: weatherData.current, // from weather API
        daily: weatherData.daily, // from weather API
        loading: false,
        error: null,
      });
    } catch (err) {
      setState({
        city: null,
        country: null,
        current: null,
        daily: null,
        loading: false,
        error: (err as Error).message,
      });
    }
  }, []);

  return { ...state, search };
}
