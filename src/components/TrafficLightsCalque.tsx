import { FeatureGroup, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState, type ReactNode } from "react";
import { useWebSocket } from "../provider/WebSocketContext";
import { useZoomLevel } from "../provider/ZoomProvider";
import { useTrafficLights } from "../provider/TrafficLightsProvider";

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

function TrafficLightsCalque() {
  const { zoom } = useZoomLevel();
  const { lights } = useTrafficLights();

  return (
    <FeatureGroup>
      {(() => {
        if (zoom < 16) {
          return null; // Do not render markers below zoom level 16
        }
        const ret: Map<string, ReactNode> = new Map();
        lights.forEach((light: TrafficLight) => {
          light.position.forEach((position: TrafficLightPosition) => {
            const posId = position.id + position.stop_lat + position.stop_lon;
            if(ret.has(posId)) {
              return; 
            }
            ret.set(posId,
              <Marker
                key={position.id + position.stop_lat + position.stop_lon}
                position={[position.stop_lat, position.stop_lon]}
                icon={getTrafficLightIcon(position.state ?? 0, zoom)}
                eventHandlers={{
                  click: () => {
                    console.log(`Clicked on traffic light ${position.id} at zoom level ${zoom}`, position);
                  },
                }}
              />
            );
          });
        });
        return ret.values()
      })()}
    </FeatureGroup>
  );
}

export default TrafficLightsCalque;
