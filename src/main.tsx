import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { TemperatureProvider } from './context/TemperatureContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TemperatureProvider>
      <App />
    </TemperatureProvider>
  </StrictMode>,
)
