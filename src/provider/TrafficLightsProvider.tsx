import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useWebSocket } from "./WebSocketContext";
import { useFocus } from "./FocusProvider";

export interface TrafficLightPosition {
  id: string;
  stop_lat: number;
  stop_lon: number;
  in_lane?: string;
  out_lane?: string;
  via_lane?: string;
  state?: number;
}

export interface TrafficLight {
  id: string;
  state_sequence: string;
  position: TrafficLightPosition[];
}

export interface TrafficLightState {
  id: string;
  state: number;
}

const TrafficLightsContext = createContext<{
    lights: Map<string, TrafficLight>
}>({ lights: new Map() });

export const TrafficLightsProvider = ({children}: { children: ReactNode }) => {
    const [lights, setLights] = useState<Map<string, TrafficLight>>(new Map());
    const { createEffectHandler } = useWebSocket();
    const { isFocused } = useFocus();

    useEffect(() => {
        const unsub1 = createEffectHandler("traffic_light/position", (data: TrafficLightPosition[]) => {
            const map = new Map<string, TrafficLight>();
            for (const light of data) {
                const id = light.id;
                if (!map.has(id)) {
                    map.set(id, {
                        id: light.id,
                        state_sequence: "",
                        position: []
                    });
                }
                map.get(id)?.position.push(light)
            }
            console.info("Received " + map.size + " traffic lights from server");
            setLights(map);
        });
        const unsub2 = createEffectHandler("traffic_light/state", (data: TrafficLightState[]) => {
            if (!isFocused) {
                console.info("Received lights state update, but user is not focused");
                return;
            }
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
                        light.state_sequence.split("").forEach((state, index) => {
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
        return () => {
            unsub1 && unsub1();
            unsub2 && unsub2();
        };
    }, [createEffectHandler]);

    return (
        <TrafficLightsContext.Provider value={{ lights: lights }}>
            {children}
        </TrafficLightsContext.Provider>
    );
}

export const useTrafficLights = () => useContext(TrafficLightsContext);