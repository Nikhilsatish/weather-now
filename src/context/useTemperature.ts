import { useContext } from 'react'
import { TempContext } from './TempContext'
import type { TempContextType } from './TempContext'

export function useTemperature(): TempContextType {
  const ctx = useContext(TempContext)
  if (!ctx) throw new Error('useTemperature must be inside TemperatureProvider')
  return ctx
}
