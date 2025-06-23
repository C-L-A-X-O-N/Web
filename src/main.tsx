import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WebSocketProvider } from './provider/WebSocketContext.tsx'
import { LaneProvider } from './provider/LaneProvider.tsx'
import { TrafficLightsProvider } from './provider/TrafficLightsProvider.tsx'
import { FocusProvider } from './provider/FocusProvider.tsx'
import { VehicleProvider } from './provider/VehicleProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FocusProvider>
      <WebSocketProvider url="ws://localhost:7900">
        <LaneProvider>
          <TrafficLightsProvider>
            <VehicleProvider>
              <App />
            </VehicleProvider>
          </TrafficLightsProvider>
        </LaneProvider>
      </WebSocketProvider>
    </FocusProvider>
  </StrictMode>,
)
