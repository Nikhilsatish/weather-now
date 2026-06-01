import { useWeather } from "./hooks/useWeather";
import { useLocalStorage } from "./hooks/useLocalStorage";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastRow from "./components/ForecastRow";
import RecentSearches from "./components/RecentSearches";
import "./App.css";

function App() {
  const { city, country, current, daily, loading, error, search } =
    useWeather();
  const [recent, setRecent] = useLocalStorage<string[]>("recent", []);

  function handleSearch(cityName: string) {
    search(cityName);
    // Deduplicate and cap at 5 recent searches
    setRecent((prev: string[]) => {
      const filtered = prev.filter(
        (c) => c.toLowerCase() !== cityName.toLowerCase(),
      );
      return [cityName, ...filtered].slice(0, 5);
    });
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🌤️ WeatherNow</h1>
        <SearchBar onSearch={handleSearch} isLoading={loading} />
      </header>

      <main className="app-main">
        <RecentSearches
          searches={recent}
          onSelect={handleSearch}
          onClear={() => setRecent([])}
        />

        {loading && (
          <div className="loading-wrap">
            <div className="skeleton skeleton-card"></div>
            <div className="skeleton skeleton-row"></div>
          </div>
        )}

        {error && <p className="error-text">❌ {error}</p>}

        {/* city and country guard — they only exist after successful geocode */}
        {city && country && current && !loading && (
          <>
            <WeatherCard city={city} country={country} current={current} />
            {daily && <ForecastRow daily={daily} />}
          </>
        )}

        {!city && !loading && !error && (
          <div className="empty-state">
            <p className="empty-icon">🌍</p>
            <p>Search any city to see the weather</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
