import { FeatureGroup, Marker, useMap } from "react-leaflet";
import L, { LatLng } from "leaflet";
import { useEffect, useState, type ReactNode } from "react";
import { useWebSocket } from "../provider/WebSocketContext";
import { useZoomLevel } from "../provider/ZoomProvider";
import { useTrafficLights } from "../provider/TrafficLightsProvider";
import RadialMenu from "./RadialMenu";
interface TrafficLightPosition {
  id: string;
  stop_lat: number;
  stop_lon: number;
  in_lane?: string;
  out_lane?: string;
  via_lane?: string;
  state?: number;
}

interface TrafficLight {
  id: string;
  state_sequence: string;
  position: TrafficLightPosition[];
}

interface TrafficLightState {
  id: string;
  state: number;
}

function getTrafficLightIcon(phase: number, zoom: number): L.Icon {
  let state: string;
  let size = 24 - (zoom - 18) * -4;

  if (phase === 0) state = "green";
  else if (phase === 1 || phase === 3) state = "yellow";
  else if (phase === 2) state = "red";
  else state = "off";

  return L.icon({
    iconUrl: `traffic_lights_${state}.svg`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });
}

function updateLightState(id : string, color : string, zoom: number) : L.Icon {

  let size = 24 - (zoom - 18) * -4;

  return L.icon({
      iconUrl: `traffic_lights_${color}.svg`,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
  });
}

function TrafficLightsCalque() {
  const { zoom } = useZoomLevel();
  const { lights } = useTrafficLights();
  const [menuPosition, setMenuPosition] = useState<{
    x: number;
    y: number;
    latlng: LatLng
  } | null>(null);

const map = useMap(); // ajoute ce hook en haut du composant
const [selectedLightId, setSelectedLightId] = useState<string | null>(null);

 const [lightStates, setLightStates] = useState<Record<string, number>>({});

  return (
  <>
    <FeatureGroup>
      {(() => {
        if (zoom < 16) return null;
        const ret: Map<string, ReactNode> = new Map();
        lights.forEach((light: TrafficLight) => {
          light.position.forEach((position: TrafficLightPosition) => {
            const posId = position.id + position.stop_lat + position.stop_lon;
            if (ret.has(posId)) return;
            ret.set(
              posId,
              <Marker
                key={position.id + position.stop_lat + position.stop_lon}
                position={[position.stop_lat, position.stop_lon]}
                icon={getTrafficLightIcon(position.state ?? 0, zoom)}
                eventHandlers={{
                  click: (e) => {
                    const point = map.latLngToContainerPoint(e.latlng);
                    setMenuPosition({
                      x: point.x-20,
                      y: point.y-20,
                      latlng: e.latlng,
                    });
                    setSelectedLightId(position.id);

                  },
                }}
              />
            );
          });
        });
        return Array.from(ret.values());
      })()}
    </FeatureGroup>

    {menuPosition && selectedLightId && (
  <RadialMenu
    x={menuPosition.x}
    y={menuPosition.y}
    onClose={() => {
      setMenuPosition(null);
      setSelectedLightId(null);
    }}
    onSelectColor={(color) => {
      updateLightState(selectedLightId, color, zoom);
    }}
  />
)}

  </>
);

}

export default TrafficLightsCalque;
