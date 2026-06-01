import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface TempContextType {
  unit:       'C' | 'F'                       // union — only these 2 values allowed
  toggleUnit: () => void
  convert:    (celsius: number) => number    // converts any temp to current unit
  symbol:     string                           // '°C' or '°F'
}

const TempContext = createContext<TempContextType | undefined>(undefined)

function TemperatureProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<'C' | 'F'>('C')

  function toggleUnit() {
    setUnit(u => (u === 'C' ? 'F' : 'C'))
  }

  function convert(celsius: number): number {
    if (unit === 'C') return Math.round(celsius)
    return Math.round((celsius * 9) / 5 + 32)
  }

  const symbol = unit === 'C' ? '°C' : '°F'

  return (
    <TempContext.Provider value={{ unit, toggleUnit, convert, symbol }}>
      {children}
    </TempContext.Provider>
  )
}

// Throws a helpful error if used outside the Provider
function useTemperature(): TempContextType {
  const ctx = useContext(TempContext)
  if (!ctx) throw new Error('useTemperature must be inside TemperatureProvider')
  return ctx
}

TemperatureProvider.useTemperature = useTemperature

export { TemperatureProvider }