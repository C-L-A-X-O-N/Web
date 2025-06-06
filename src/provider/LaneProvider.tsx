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
    lanes: Lane[]
}>({ lanes: [] })

export const LaneProvider = ({children}: { children: ReactNode }) => {
    const [lanes, setLanes] = useState<Lane[]>([]);
    const { createEffectHandler } = useWebSocket();
    const { isFocused } = useFocus();


    useEffect(() => {
        const unsub1 = createEffectHandler("lanes/position", (data: any) => {
            const lanesWithJam = Array.isArray(data)
                ? data.map((lane: Lane) => ({ ...lane, jam: lane.jam ?? 0, color: "#555" }))
                : [];
            console.info("Received " + lanesWithJam.length + " lanes from server");
            setLanes(lanesWithJam);
        });
        const unsub2 = createEffectHandler("lane/state", (data: { id: string; traffic_jam: number }[]) => {
            if (!isFocused) {
                console.info("Received lane state update, but user is not focused");
                return;
            }
            setLanes((prevLanes) =>
                prevLanes.map((lane) => {
                    const updated = data.find((d) => d.id === lane.id);
                    if (updated) {
                        return { ...lane, jam: updated.traffic_jam };
                    }
                    return lane;
                })
            );
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