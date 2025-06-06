import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useWebSocket } from "./WebSocketContext";
import { useFocus } from "./FocusProvider";

export interface Lane {
    id: string;
    shape: [number, number][];
    priority: number;
    type: string;
    jam: number;
}

const LaneContext = createContext<{
    lanes: Map<string, Lane>;
}>({ lanes: new Map<string, Lane>() });

export const LaneProvider = ({children}: { children: ReactNode }) => {
    const [lanes, setLanes] = useState<Map<string, Lane>>(new Map<string, Lane>());
    const { createEffectHandler } = useWebSocket();
    const { isFocused } = useFocus();


    useEffect(() => {
        const unsub1 = createEffectHandler("lanes/position", (data: any) => {
            const map = new Map<string, Lane>();
            data.map((lane: Lane) => {
                map.set(lane.id, { ...lane, jam: lane.jam ?? 0 });
            })
            setLanes(map);
        });
        const unsub2 = createEffectHandler("lane/state", (data: { id: string; traffic_jam: number }[]) => {
            if (!isFocused) {
                console.info("Received lane state update, but user is not focused");
                return;
            }
            setLanes((prevLanes) => {
                const map = new Map<string, Lane>(prevLanes);
                data.forEach((d) => {
                    const lane = prevLanes.get(d.id);
                    if (lane) {
                        map.set(d.id, { ...lane, jam: d.traffic_jam });
                    }
                })

                return map;
            });
        });
        return () => {
            unsub1 && unsub1();
            unsub2 && unsub2();
        };
    }, [createEffectHandler, isFocused]);

    return (
        <LaneContext.Provider value={{ lanes }}>
            {children}
        </LaneContext.Provider>
    );
}

export const useLanes = () => useContext(LaneContext);