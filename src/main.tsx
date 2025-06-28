import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WebSocketProvider } from './provider/WebSocketContext.tsx'
import { LaneProvider } from './provider/LaneProvider.tsx'
import { TrafficLightsProvider } from './provider/TrafficLightsProvider.tsx'
import { FocusProvider } from './provider/FocusProvider.tsx'
import { VehicleProvider } from './provider/VehicleProvider.tsx'
import { useConfig } from './hooks/useConfig'

const AppWithConfig = () => {
  const { config, loading } = useConfig();

  if (loading) {
    return <div>Loading configuration...</div>;
  }

  return (
    <StrictMode>
      <FocusProvider>
        <WebSocketProvider url={config.websocketUrl}>
          <LaneProvider>
            <TrafficLightsProvider>
              <VehicleProvider>
                <App />
              </VehicleProvider>
            </TrafficLightsProvider>
          </LaneProvider>
        </WebSocketProvider>
      </FocusProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<AppWithConfig />);
