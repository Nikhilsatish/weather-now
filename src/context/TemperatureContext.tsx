import { useState } from 'react'
import type { ReactNode } from 'react'
import { TempContext } from './TempContext'

export function TemperatureProvider({ children }: { children: ReactNode }) {
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