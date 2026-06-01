import { createContext } from 'react'

export interface TempContextType {
  unit:       'C' | 'F'
  toggleUnit: () => void
  convert:    (celsius: number) => number
  symbol:     string
}

export const TempContext = createContext<TempContextType | undefined>(undefined)
