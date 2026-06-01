import { useTemperature } from "../context/useTemperature";
import { getWeatherDescription, getWeatherEmoji } from "../api/weather";
import type { CurrentWeather } from "../types/weather.types";

// city + country are separate props — they come from geocoding, not weather data
interface WeatherCardProps {
  city: string;
  country: string;
  current: CurrentWeather;
}

function WeatherCard({ city, country, current }: WeatherCardProps) {
  const { convert, symbol } = useTemperature();

  const description = getWeatherDescription(current.weather_code);
  const emoji = getWeatherEmoji(current.weather_code, current.is_day);

  return (
    <div className="weather-card">
      <div className="weather-top">
        <div>
          <h2 className="city-name">
            {city}, {country}
          </h2>
          <p className="weather-desc">{description}</p>
        </div>
        {/* Emoji icon — no image URL needed */}
        <span className="weather-emoji">{emoji}</span>
      </div>

      <div className="temp-display">
        <span className="temp-main">
          {convert(current.temperature_2m)}
          {symbol}
        </span>
        <span className="temp-feels">
          Feels like {convert(current.apparent_temperature)}
          {symbol}
        </span>
      </div>

      <div className="weather-stats">
        <div className="stat">
          <span className="stat-label">Humidity</span>
          <span className="stat-value">{current.relative_humidity_2m}%</span>
        </div>
        <div className="stat">
          <span className="stat-label">Wind</span>
          <span className="stat-value">{current.wind_speed_10m} km/h</span>
        </div>
        <div className="stat">
          <span className="stat-label">Condition</span>
          <span className="stat-value">{emoji}</span>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
