import { useTemperature } from "../context/useTemperature";
import { getWeatherEmoji } from "../api/weather";
import type { DailyForecast } from "../types/weather.types";

interface ForecastRowProps {
  daily: DailyForecast;
}

// "2025-01-15" → "Wed"
function getDayName(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });
}

function ForecastRow({ daily }: ForecastRowProps) {
  const { convert, symbol } = useTemperature();

  // Zip the parallel arrays into one array of day objects
  const days = daily.time.map((date, i) => ({
    date,
    max: daily.temperature_2m_max[i],
    min: daily.temperature_2m_min[i],
    code: daily.weather_code[i],
  }));

  return (
    <div className="forecast-row">
      {days.map((day) => (
        <div key={day.date} className="forecast-card">
          <p className="forecast-day">{getDayName(day.date)}</p>
          <span className="forecast-emoji">{getWeatherEmoji(day.code)}</span>
          <p className="forecast-high">
            {convert(day.max)}
            {symbol}
          </p>
          <p className="forecast-low">
            {convert(day.min)}
            {symbol}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ForecastRow;
