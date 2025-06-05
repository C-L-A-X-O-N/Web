import { MapContainer, TileLayer, LayersControl, ScaleControl, ZoomControl} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LaneCalque from './LaneCalque';
import TrafficLightsCalque from './TrafficLightsCalque';
import VehicleCalque from './VehicleCalque';
import { ZoomProvider } from '../provider/ZoomProvider';
import { useFocus } from '../provider/FocusProvider';

function Map() {
  const { isFocused } = useFocus();

  return (
    <>
      <MapContainer center={[47.23262717554573, -1.576783785586457]} zoom={19} style={{ 
        height: '100%', 
        width: '100%'
      }}>
        <ZoomProvider>

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            maxZoom={30}
          />

          <ZoomControl position="bottomleft" />
          <ScaleControl position="bottomleft" />

          <LayersControl position="bottomright">
            <LayersControl.Overlay name="Routes" checked>
              <LaneCalque />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Véhicules" checked>
              <VehicleCalque/>
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Feux de circulations" checked>
              <TrafficLightsCalque/>
            </LayersControl.Overlay>
          </LayersControl>
          
        </ZoomProvider>
      </MapContainer>
      {!isFocused && (
        <div className="focus-overlay" style={{
          zIndex: 1000,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontSize: '1.5rem',
          pointerEvents: 'none',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          <h2>Focus sur la carte pour interagir</h2>
        </div>
      )}
    </>
  );
}

export default Map;
