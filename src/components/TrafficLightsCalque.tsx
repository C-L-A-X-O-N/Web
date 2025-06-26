// TrafficLightsCalque.tsx
import { useState, useMemo } from "react";
import { FeatureGroup, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useWebSocket } from "../provider/WebSocketContext";
import { useZoomLevel } from "../provider/ZoomProvider";
import { useTrafficLights } from "../provider/TrafficLightsProvider";
import RadialMenu from "./RadialMenu";
// Un petit mock local, désactivez-le quand vous voudrez voir les vrais feux
import { GlobalStyles } from '@mui/material';

interface TrafficLightPosition {
  id: string;
  stop_lat: number;
  stop_lon: number;
  state?: number;
}

function getTrafficLightIcon(phase: number, zoom: number): L.Icon {
  const color =
    phase === 0 ? "green" :
    phase === 2 ? "red" :
    "yellow" ;
  const size = 24 - (zoom - 18) * -4;
  return L.icon({
    iconUrl: `traffic_lights_${color}.svg`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });
}

export default function TrafficLightsCalque() {
  const { zoom } = useZoomLevel();
  const { lights } = useTrafficLights();
  const { send } = useWebSocket();

  // Récupère les vraies positions
  const realPositions: TrafficLightPosition[] = Array.from(
    lights.values()
  ).flatMap(light => light.position);

  // ID du feu dont la popup est ouverte
  const [popupLightId, setPopupLightId] = useState<string | null>(null);

  // état local pour overrides (optimistic UI)
  //const [overrides, setOverrides] = useState<Record<string, number>>({});

  const allPositions: TrafficLightPosition[] = useMemo(() => {
    return Array.from(lights.values()).flatMap(light => light.position);
  }, [lights]);

  const validPositions = useMemo(() => {
    return allPositions.filter(
      pos =>
        typeof pos.stop_lat === "number" &&
        typeof pos.stop_lon === "number"
    );
  }, [allPositions]);

  // 3) Ne garder qu’une occurrence par ID
  const uniquePositions = useMemo(() => {
    const seen = new Set<string>();
    return validPositions.filter(pos => {
      if (seen.has(pos.id)) return false;
      seen.add(pos.id);
      return true;
    });
  }, [validPositions]);
  return (
    <>
      {/* GlobalStyles injecté une seule fois */}
      <GlobalStyles styles={{
        ".leaflet-popup.radial-popup .leaflet-popup-content-wrapper": {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
        },
        ".leaflet-popup.radial-popup .leaflet-popup-tip": {
          display: "none",
        },
      }} />

      <FeatureGroup>
        {zoom >= 16 &&
        
          uniquePositions.map((pos, idx) => {
          const key = `${pos.id}-${idx}`;
            return (
              <Marker
                key={key}
                position={[pos.stop_lat, pos.stop_lon]}
                icon={getTrafficLightIcon(pos.state ?? 0, zoom)}
                eventHandlers={{
                  click: () => setPopupLightId(pos.id)
                }}
              >
                {popupLightId === pos.id && (
                  <Popup
                    position={[pos.stop_lat, pos.stop_lon]}
                    offset={[15, 20]}
                    closeButton={false}
                    autoClose={false}
                    closeOnClick={false}
                    className="radial-popup"
                    eventHandlers={{
                      remove: () => setPopupLightId(null)
                    }}
                  >
                    <RadialMenu
                      onSelectColor={(color) => {
                        const state =
                          color === "green" ? 0 :
                          color === "yellow" ? 1 : 2;

                        // 2) mise à jour optimiste de l'UI
                        // setOverrides(prev => ({
                        //   ...prev,
                        //   [pos.id]: state,
                        // }));
                        send("command/traffic_light/update", {
                          id: pos.id,
                          state,
                        });
                        setPopupLightId(null);
                      }}
                      onClose={() => setPopupLightId(null)}
                    />
                  </Popup>
                )}
              </Marker>
            );
          })}
      </FeatureGroup>
    </>
  );
}