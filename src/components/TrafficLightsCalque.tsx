import { FeatureGroup, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketContext";

interface TrafficLightPosition {
  id: string;
  stop_lat: number;
  stop_lon: number;
  state?: number;
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

function TrafficLightsCalque() {
  const [zoom, setZoom] = useState<number>(-1);
  const { createEffectHandler } = useWebSocket();
  const [lights, setLights] = useState<TrafficLightPosition[]>([]);
  const map = useMap();

  useEffect(() => {
      map.whenReady(() => {
          const updateZoomAndBound = () => {
              setZoom(map.getZoom());
          }

          map.on("moveend zoomend", updateZoomAndBound);
          updateZoomAndBound();
      });

      return () => {
          map.off("moveend zoomend");
      };
  }, [map]);

  useEffect(() => {
    const handler = createEffectHandler("traffic_light/state", (data: TrafficLightState[]) => {
      setLights(prevLights =>
        prevLights.map(light => {
          const match = data.find(d => d.id === light.id);
          return match ? { ...light, state: match.state } : light;
        })
      );
    });
    return handler;
  }, [createEffectHandler]);

  useEffect(createEffectHandler("traffic_light/position", (data: TrafficLightPosition[]) => {
    const uniqueLightsMap = new Map<string, TrafficLightPosition>();

    for (const light of data) {
      if (!uniqueLightsMap.has(light.id)) {
        uniqueLightsMap.set(light.id, light);
      }
    }

    setLights(Array.from(uniqueLightsMap.values()));
  }), [createEffectHandler]);

  return (
    <FeatureGroup>
      {lights.map(light => {
        return (
        <Marker
          key={light.id + light.state + zoom}
          position={[light.stop_lat, light.stop_lon]}
          icon={getTrafficLightIcon(light.state ?? 0, zoom)}
        />
        );
      })}
    </FeatureGroup>
  );
}

export default TrafficLightsCalque;
