# 🌤️ WeatherNow — React + TypeScript Weather Dashboard

A clean, production-grade weather dashboard built with React 18 and TypeScript. Search any city in the world, view current conditions and a 5-day forecast, toggle between °C and °F, and revisit recent searches — all with real live data from the Open-Meteo API.

**[Live Demo →](https://weather-now-nikhil.vercel.app)** &nbsp;|&nbsp; **[GitHub →](https://github.com/Nikhilsatish/weather-now)**

> No API key. No signup. No credit card. Open-Meteo is completely free.

---

## 📸 Preview

> Add screenshot after deploying:
> `![WeatherNow Preview](./public/preview.png)`

---

## ✨ Features

- 🔍 Search any city worldwide — debounced input (500ms, no call per keystroke)
- 🌡️ Current weather — city, country, temperature, feels like, humidity, wind speed
- 📅 5-day forecast — daily cards with emoji icon, high and low temperatures
- 🔄 °C / °F toggle — TemperatureContext, all temperatures update instantly
- 🕐 Recent searches — last 5 cities saved to localStorage, clickable to re-search
- ⏳ Loading skeleton — animated placeholder while fetching
- ❌ Error state — clear message for invalid city or network failure
- 💯 TypeScript throughout — all props, state, and API responses fully typed

---

## 🧠 Concepts Demonstrated

| Concept | How it's used |
|---|---|
| **TypeScript interfaces** | `GeoResult`, `CurrentWeather`, `DailyForecast`, `WeatherState` — shape of all data defined upfront |
| **Generic custom hook** | `useLocalStorage<T>` — same hook works for `string[]`, `boolean`, `number` |
| **Custom hook** | `useWeather()` — encapsulates 2-step API logic, returns typed state |
| **Sequential async calls** | `geocodeCity()` first, then `fetchWeatherByCoords()` — Step 2 needs Step 1's result |
| **Context API** | `TemperatureContext` — unit + convert function available anywhere, no prop drilling |
| **useCallback** | `search` function is stable — won't cause child re-renders on every parent render |
| **useRef for debounce** | Timer ID stored in ref — 500ms wait, no API call on every keystroke |
| **Lazy useState initializer** | `useState(() => JSON.parse(...))` — reads localStorage once on mount, not every render |
| **Parallel array zip** | Open-Meteo returns `time[]`, `temp_max[]`, `temp_min[]` — zipped by index into day objects |
| **WMO weather codes** | Numeric codes converted to emoji and text via lookup table |

---

## 🗂️ Project Structure

```
src/
├── api/
│   └── weather.ts                # geocodeCity, fetchWeatherByCoords, getWeatherEmoji, getWeatherDescription
├── components/
│   ├── SearchBar.tsx              # Debounced input + °C/°F toggle button
│   ├── WeatherCard.tsx            # Current weather — city, temp, humidity, wind, emoji
│   ├── ForecastRow.tsx            # 5-day forecast — zips parallel arrays into daily cards
│   └── RecentSearches.tsx         # City chips saved to localStorage, null when empty
├── context/
│   └── TemperatureContext.tsx     # createContext + Provider + useTemperature hook
├── hooks/
│   ├── useWeather.ts              # 2-step API: geocode → weather, typed state management
│   └── useLocalStorage.ts         # Generic <T> persistence hook with lazy initializer
├── types/
│   └── weather.types.ts           # All TypeScript interfaces
├── App.tsx                        # Root — wires everything together
└── main.tsx                       # createRoot + TemperatureProvider
```

---

## 🔑 Key Learnings

**1. Two-step API — why you can't use Promise.all**

Most weather APIs take a city name directly. Open-Meteo takes coordinates. So the flow is:

```ts
// Step 1 — city name → lat/lon
const geoResult = await geocodeCity("Mumbai")
// { name: "Mumbai", latitude: 19.07, longitude: 72.87, country_code: "IN" }

// Step 2 — lat/lon → weather (needs Step 1's result)
const weatherData = await fetchWeatherByCoords(geoResult.latitude, geoResult.longitude)
```

`Promise.all` won't work here because Step 2 depends on Step 1's output. They must run sequentially. `Promise.all` is for independent requests that don't need each other's results.

**2. Parallel arrays — what Open-Meteo sends and how to fix it**

```ts
// What the API sends — hard to render directly
daily = {
  time:               ["2025-01-15", "2025-01-16", "2025-01-17"],
  temperature_2m_max: [32,           29,            31          ],
  temperature_2m_min: [24,           22,            23          ],
  weather_code:       [0,            61,            3           ],
}

// What we need — one object per day
const days = daily.time.map((date, i) => ({
  date,
  max:  daily.temperature_2m_max[i],
  min:  daily.temperature_2m_min[i],
  code: daily.weather_code[i],
}))
// [{ date: "2025-01-15", max: 32, min: 24, code: 0 }, ...]
```

The `.map((date, i) => ...)` zip converts parallel arrays into an array of objects — one per day. Index `i` is the link that keeps all four arrays in sync.

**3. Generic TypeScript hook — one hook for all types**

```ts
// Without generics — would need separate hooks for each type
function useLocalStorageString(key: string, initial: string) { ... }
function useLocalStorageBoolean(key: string, initial: boolean) { ... }

// With generics — one hook covers everything
function useLocalStorage<T>(key: string, initial: T): [T, (val: T) => void] { ... }

// Usage
useLocalStorage<string[]>('recent', [])     // T = string[]
useLocalStorage<boolean>('darkMode', false) // T = boolean
```

**4. Lazy initializer — why it matters**

```ts
// ❌ Reads localStorage on EVERY render — slow
const [value, setValue] = useState(JSON.parse(localStorage.getItem(key)))

// ✅ Reads localStorage ONCE on mount — fast
const [value, setValue] = useState(() => JSON.parse(localStorage.getItem(key)))
```

The function form of `useState` is called a lazy initializer. React only calls it once when the component first mounts. Without it, every re-render reads from localStorage — unnecessary work.

**5. Debounce with useRef — why not useState**

```ts
const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

function handleChange(value: string) {
  if (timerRef.current) clearTimeout(timerRef.current)
  timerRef.current = setTimeout(() => onSearch(value), 500)
}
```

The timer ID is stored in a `ref` — not state. If you used `useState` for the timer ID, every `setTimeout` call would trigger a re-render. A `ref` update is silent — it holds the value between renders without causing re-renders.

---

## 🌐 API Reference

**Geocoding API**
```
GET https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1
```

**Weather API**
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude={lat}
  &longitude={lon}
  &current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day
  &daily=temperature_2m_max,temperature_2m_min,weather_code
  &timezone=auto
  &forecast_days=5
```

Both APIs are completely free. No API key. No rate limits for reasonable usage.

---

## 🚀 Run Locally

```bash
git clone https://github.com/Nikhilsatish/weather-now.git
cd weather-now
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

No `.env` file needed. Works immediately.

---

## 🛠️ Built With

- [React 18](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev) — react-ts template
- [Open-Meteo API](https://open-meteo.com) — free, no key required
- Vanilla CSS — no UI framework

---

## 📌 Part of My React Learning Series

| Project | Topics | Stack | Status |
|---|---|---|---|
| [TaskFlow](https://github.com/Nikhilsatish/react-taskflow) | R1–R10 · Fundamentals | React, Vite | ✅ Complete |
| [ExpenseTracker](https://github.com/Nikhilsatish/expense-tracker-react) | R11–R20 · Hooks + Context + Router | React, React Router | ✅ Complete |
| [DevBoard](https://github.com/Nikhilsatish/devboard-github-explorer) | R21–R30 · Redux + Advanced | React, Redux Toolkit | ✅ Complete |
| **WeatherNow** (this one) | TypeScript + Real API + Custom Hooks | React, TypeScript, Open-Meteo | ✅ Complete |

---

## 👨‍💻 Author

**Nikhil** — Senior Software Engineer
[GitHub](https://github.com/Nikhilsatish) · [LinkedIn](https://linkedin.com/in/nikhil-sathish )
