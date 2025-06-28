import { useState, useEffect } from 'react';

interface Config {
  websocketUrl: string;
}

const defaultConfig: Config = {
  websocketUrl: 'ws://localhost:7900'
};

export const useConfig = () => {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        // Essayer de charger la configuration depuis /config.json
        const response = await fetch('/config.json');
        if (response.ok) {
          const externalConfig = await response.json();
          setConfig(prev => ({ ...prev, ...externalConfig }));
        }
      } catch (error) {
        console.warn('Could not load external config, using defaults:', error);
      }
      
      // Utiliser les variables d'environnement Vite si disponibles
      const envConfig: Partial<Config> = {};
      if (import.meta.env.VITE_WEBSOCKET_URL) {
        envConfig.websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;
      }
      
      setConfig(prev => ({ ...prev, ...envConfig }));
      setLoading(false);
    };

    loadConfig();
  }, []);

  return { config, loading };
};
