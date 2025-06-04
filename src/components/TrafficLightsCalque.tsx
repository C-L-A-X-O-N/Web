import { FeatureGroup, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState, type ReactNode } from "react";
import { useWebSocket } from "./WebSocketContext";

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
  const [zoom, setZoom] = useState<number>(-1);
  const { createEffectHandler } = useWebSocket();
  const [lights, setLights] = useState<Map<string, TrafficLight>>(new Map());
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
      setLights(prevLights => {
        data.forEach(d => {
          if (!prevLights.has(d.id)) {
            return;
          }
          const light = prevLights.get(d.id);
          if(!light) {
            return;
          }
          if (light) {
            light.state_sequence = d.state.toString();
            // iterate each character in the state_sequence
            light.state_sequence.split("").forEach((state, index) => {
              // update the state of the corresponding position
              if (light.position[index]) {
                if(state === "R" || state === "r") {
                  light.position[index].state = 2; // red
                } else if(state === "Y" || state === "y" || state === "O" || state === "o") {
                  light.position[index].state = 1; // yellow
                } else if(state === "G" || state === "g") {
                  light.position[index].state = 0; // green
                }else{
                  light.position[index].state = 3; // off
                }
              }
            });
          }
          prevLights.set(d.id, light);
        });
        return new Map(prevLights);
      });
    });
    return handler;
  }, [createEffectHandler]);

  useEffect(createEffectHandler("traffic_light/position", (data: TrafficLightPosition[]) => {
    const tmpMap = new Map<string, TrafficLight>();
    for (const light of data) {
      const id = light.id;
      if (!tmpMap.has(id)) {
        tmpMap.set(id, {
          id: light.id,
          state_sequence: "",
          position: []
        });
      }
      tmpMap.get(id)?.position.push(light)
    }

    setLights(tmpMap);
  }), [createEffectHandler]);

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
