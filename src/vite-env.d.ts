/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEBSOCKET_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Ajout pour la configuration runtime
declare global {
  interface Window {
    RUNTIME_CONFIG?: {
      WEBSOCKET_URL?: string;
    };
  }
}
