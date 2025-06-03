import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WebSocketProvider } from './components/WebSocketContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WebSocketProvider url="ws://localhost:7890">
      <App />
    </WebSocketProvider>
  </StrictMode>,
)
