interface RecentSearchesProps {
  searches: string[];
  onSelect: (city: string) => void;
  onClear: () => void;
}

function RecentSearches({ searches, onSelect, onClear }: RecentSearchesProps) {
  if (searches.length === 0) return null;
  return (
    <div className="recent-wrap">
      <span className="recent-label">Recent</span>
      <div className="recent-chips">
        {searches.map((city) => (
          <button
            key={city}
            className="recent-chip"
            onClick={() => onSelect(city)}
          >
            {city}
          </button>
        ))}
      </div>
      <button className="recent-clear" onClick={onClear}>
        Clear
      </button>
    </div>
  );
}

export default RecentSearches;
