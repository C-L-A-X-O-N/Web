import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ZoomListener from './ZoomListener';
import { useWebSocket } from './WebSocketContext';

// Tableau de positions des feux
const trafficLights: { id: number; position: [number, number]; label: string; }[] = [
  { id: 1, position: [47.2782063, -1.5214026], label: 'Feu 1' },
  { id: 2, position: [47.277, -1.523], label: 'Feu 2' },
  { id: 3, position: [47.279, -1.520], label: 'Feu 3' },
  { id: 4, position: [47.281, -1.518], label: 'Feu 4' },
];


function getSvgIcon(size = 32): L.Icon {
  return L.icon({
    iconUrl: 'traffic_lights.svg',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}

function Map() {
  // Pour gérer l'état du marker survolé et cliqué
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [clickedId, setClickedId] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(13);

  const { createEffectHandler } = useWebSocket();

  // Register the WebSocket listener only once on mount
  useEffect(createEffectHandler("vehicle", (data: any) => {
    console.log("Vehicle data received:", data);
  }), [createEffectHandler]);

  return (
    <MapContainer center={trafficLights[0].position} zoom={13} style={{ height: '100%', width: '100%' }}>
      <ZoomListener onZoomChange={setZoomLevel} />

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {zoomLevel >= 14 && trafficLights.map(light => {
        let size = 32;
        if (clickedId === light.id) size = 48;
        else if (hoveredId === light.id) size = 40;

        return (
          <Marker
            key={light.id}
            position={light.position}
            icon={getSvgIcon(size)}
            eventHandlers={{
              mouseover: () => setHoveredId(light.id),
              mouseout: () => setHoveredId(null),
              click: () => setClickedId(light.id),
            }}
          />
        );
      })}
    </MapContainer>
  );
}

export default Map;
