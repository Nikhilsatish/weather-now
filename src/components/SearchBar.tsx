import { useState, useRef } from "react";
import { useTemperature } from "../context/useTemperature";

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [city, setCity] = useState("");
  const { toggleUnit, symbol } = useTemperature();

  // Timer ID in ref - won't re-render when updated
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setCity(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (value.trim()) onSearch(value.trim());
    }, 500);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (timerRef.current) clearTimeout(timerRef.current);
    if (city.trim()) onSearch(city.trim());
  }

  return (
    <div className="search-wrap">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          className="search-input"
          value={city}
          onChange={handleChange}
          placeholder="Search city... e.g. Mumbai, London, Tokyo"
          disabled={isLoading}
          autoFocus
        />
        <button type="submit" className="search-btn" disabled={isLoading}>
          {isLoading ? "..." : "Search"}
        </button>
      </form>
      <button className="unit-btn" onClick={toggleUnit}>
        {symbol}
      </button>
    </div>
  );
}

export default SearchBar;
