import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ZoomListener from './ZoomListener';
import { useWebSocket } from './WebSocketContext';
import LaneCalque from './LaneCalque';
import TrafficLightsCalque from './TrafficLightsCalque';

function Map() {
  // Pour gérer l'état du marker survolé et cliqué
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [clickedId, setClickedId] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(16);

  useEffect(() => {
    console.log(`Zoom level changed to: ${zoomLevel}`);
  }, [zoomLevel]);
  return (
    <MapContainer center={[47.23400547531244, -1.5705466304812643]} zoom={16} style={{ height: '100%', width: '100%' }}>

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <TrafficLightsCalque />
      <LaneCalque zoomLevel={zoomLevel}/>
    </MapContainer>
  );
}

export default Map;
