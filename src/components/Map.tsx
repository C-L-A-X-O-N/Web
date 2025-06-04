import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, LayersControl, ScaleControl, ZoomControl} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LaneCalque from './LaneCalque';
import TrafficLightsCalque from './TrafficLightsCalque';
import VehicleCalque from './VehicleCalque';
function Map() {

  const [zoomLevel, setZoomLevel] = useState(16);

  useEffect(() => {
    console.log(`Zoom level changed to: ${zoomLevel}`);
  }, [zoomLevel]);

  return (
    <MapContainer center={[47.22924679606443, -1.5695475486831956]} zoom={20} style={{ height: '100%', width: '100%' }}>

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        maxZoom={30}
      />

      <ZoomControl position="bottomleft" />
      <ScaleControl position="bottomleft" />

      <LayersControl position="bottomright">
        <LayersControl.Overlay name="Routes" checked>
          <LaneCalque zoomLevel={zoomLevel} />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Véhicules" checked>
          <VehicleCalque/>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Feux de circulations" checked>
          <TrafficLightsCalque/>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
}

export default Map;
