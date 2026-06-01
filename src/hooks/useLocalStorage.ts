import { useState, useEffect } from "react";
import type React from "react";

// <T> generic - works for string[], boolean, number, any type
// Usage: useLocalStorage<string[]>('recent', [])
export function useLocalStorage<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    
  // Lazy initializer — reads localStorage once on mount
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
