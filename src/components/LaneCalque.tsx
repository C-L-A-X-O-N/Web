import { FeatureGroup, Polyline } from "react-leaflet";
import { useWebSocket } from "./WebSocketContext";
import { useEffect, useState } from "react";

interface Lane {
    id: string;
    shape: [number, number][];
    priority: number;
    type: string;
    jam: number;
    color: string;
}

const color_by_type : Record<string, string> = {
    "pedestrian": "#a0a0a0",
    "bike": "#00ff00",
    "public_transport": "#ff9900",
    "freight": "#996600",
    "emergency": "#ff0000",
    "2_wheeler": "#cc00ff",
    "car": "#0000ff",
    "train": "#ff00ff",
    "custom": "#000000",
    "unknown": "#aaaaaa"
};

function shouldDisplayLane(lane: Lane, zoomLevel: number): boolean {
    const thresholds: { zoom: number; minImportance: number }[] = [
        { zoom: 18, minImportance: 0.5 },
        { zoom: 17, minImportance: 2 },
        { zoom: 16, minImportance: 3 },
        { zoom: 15, minImportance: 4 },
        { zoom: 14, minImportance: 5 },
        { zoom: 13, minImportance: 6 },
        { zoom: 12, minImportance: 7 }
    ];

    for (const { zoom, minImportance } of thresholds) {
        if( zoomLevel !== zoom ) {
            continue;
        }
        if (lane.priority >= minImportance) {
            return true;
        }
    }

    return false;
}

function LaneCalque(props: {zoomLevel: number}) {
    const { zoomLevel } = props;
    const {createEffectHandler} = useWebSocket();
    const [lanes, setLanes] = useState<Lane[]>([]);
    
    useEffect(() => {
        const handler = createEffectHandler("lanes/position", (data: any) => {
            const lanesWithJam = Array.isArray(data)
                ? data.map((lane: Lane) => ({ ...lane, jam: lane.jam ?? 0, color: "#555" }))
                : [];
            setLanes(lanesWithJam);
        });
        return handler;
    }, [createEffectHandler]);

    useEffect(() => {
        const handler = createEffectHandler("lane/state", (data: {id: string, traffic_jam: number}[]) => {
            setLanes((prevLanes) => {
                return prevLanes.map((lane) => {
                    const updatedLane = data.find((d) => d.id === lane.id);
                    if (updatedLane) {
                        const jam = Math.max(0, Math.min(1, updatedLane.traffic_jam ?? 0));
                        // 0.0: vert (#00ff00)
                        // 0.25: jaune (#ffff00)
                        // 0.5: orange (#ff9900)
                        // 0.75: rouge foncé (#cc0000)
                        // 1.0: rouge clair (#ff3333)
                        let jamColor = "#00ff00";
                        if (jam < 0.25) {
                            // Vert -> Jaune
                            const t = jam / 0.25;
                            const r = Math.round(0 + t * (255 - 0));
                            const g = 255;
                            const b = 0;
                            jamColor = `#${r.toString(16).padStart(2, "0")}${g.toString(16)}${b.toString(16).padStart(2, "0")}`;
                        } else if (jam < 0.5) {
                            // Jaune -> Orange
                            const t = (jam - 0.25) / 0.25;
                            const r = 255;
                            const g = Math.round(255 - t * (255 - 153));
                            const b = 0;
                            jamColor = `#${r.toString(16)}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
                        } else if (jam < 0.75) {
                            // Orange -> Rouge foncé
                            const t = (jam - 0.5) / 0.25;
                            const r = Math.round(255 - t * (255 - 204));
                            const g = Math.round(153 - t * (153 - 0));
                            const b = 0;
                            jamColor = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
                        } else {
                            // Rouge foncé -> Rouge clair
                            const t = (jam - 0.75) / 0.25;
                            const r = Math.round(204 + t * (255 - 204));
                            const g = 0;
                            const b = Math.round(0 + t * (51 - 0));
                            jamColor = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
                        }
                        return { ...lane, jam: updatedLane.traffic_jam, color: jamColor };
                    }
                    return lane;
                });
            });
        });
        return handler;
    }, [createEffectHandler])

    return (<FeatureGroup>
        {lanes && lanes.map((lane) => {
            if(!shouldDisplayLane(lane, zoomLevel)) {
                return null; 
            }
            const weight = 2 + 4 * Math.max(0, Math.min(1, lane.jam ?? 0));
            return (
                <Polyline
                    key={lane.id + lane.color}
                    positions={lane.shape}
                    color={lane.color}
                    weight={weight}
                    opacity={1}
                    eventHandlers={{
                        click: () => {
                            console.log(`Clicked lane ${lane.id}`, lane);
                        }
                    }}
                />
            );})}
    </FeatureGroup>);
}

export default LaneCalque;