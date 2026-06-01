// Geocoding API — converts city name to lat/lon
// URL: https://geocoding-api.open-meteo.com/v1/search?name=Mumbai
export interface GeoResult {
  id:           number
  name:         string   // "Mumbai"
  latitude:     number
  longitude:    number
  country:      string   // "India"
  country_code: string   // "IN"
  timezone:     string   // "Asia/Kolkata"
}

export interface GeoResponse {
  results?: GeoResult[]   // undefined when city not found
}

// Current weather — live conditions
export interface CurrentWeather {
  temperature_2m:       number   // temp in °C
  apparent_temperature: number   // feels like
  relative_humidity_2m: number   // humidity %
  wind_speed_10m:       number   // wind in km/h
  weather_code:         number   // WMO code → we convert to emoji + text
  is_day:               number   // 1 = day, 0 = night
  time:                 string
}

// Daily forecast — parallel arrays, one value per day
export interface DailyForecast {
  time:               string[]   // ["2025-01-15", "2025-01-16", ...]
  temperature_2m_max: number[]   // high temps
  temperature_2m_min: number[]   // low temps
  weather_code:       number[]   // WMO code per day
}

// Full weather API response
export interface WeatherResponse {
  current:  CurrentWeather
  daily:    DailyForecast
  timezone: string
}

// State inside the useWeather hook
// city/country come from geocoding — separate from weather data
export interface WeatherState {
  city:    string | null
  country: string | null
  current: CurrentWeather | null
  daily:   DailyForecast | null
  loading: boolean
  error:   string | null
}