import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import DashboardConsole from './App.tsx'
import { DeliveryProvider } from './context/DeliveryContext.tsx'

createRoot(document.getElementById('root')!).render(
  <DeliveryProvider>
    <DashboardConsole />
  </DeliveryProvider>,
)
