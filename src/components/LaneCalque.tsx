import { FeatureGroup, Polyline } from "react-leaflet";
import { useWebSocket } from "./WebSocketContext";
import { useEffect, useState } from "react";

interface Lane {
    id: string;
    shape: [number, number][];
    importance_score: number;
    type: string;
    edgeType: string;
}

const color_by_type = {
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
    // Define thresholds for importance_score at different zoom levels
    const thresholds: { zoom: number; minImportance: number }[] = [
        { zoom: 17, minImportance: 0.5 },
        { zoom: 16, minImportance: 1 },
        { zoom: 15, minImportance: 2 },
        { zoom: 14, minImportance: 3 },
        { zoom: 13, minImportance: 4 },
        { zoom: 12, minImportance: 5 },
        { zoom: 11, minImportance: 6 },
        { zoom: 10, minImportance: 7 }
    ];

    for (const { zoom, minImportance } of thresholds) {
        if (zoomLevel < zoom && lane.importance_score < minImportance) {
            return false;
        }
    }
    return true;
}

function LaneCalque(props: {zoomLevel: number}) {
    const { zoomLevel } = props;
    const {createEffectHandler} = useWebSocket();
    const [lanes, setLanes] = useState<Lane[]>([]);
    
    useEffect(createEffectHandler("lanes/position", (data: any) => {
        setLanes(data);
    }), [createEffectHandler]);

    return (<FeatureGroup>
        {lanes && lanes.map((lane) => {
            if(!shouldDisplayLane(lane, zoomLevel)) {
                return null; 
            }
            return (<Polyline
                key={lane.id}
                positions={lane.shape}
                color={color_by_type[lane.type] || "#555"}
                weight={2}
                opacity={0.5}
                eventHandlers={{
                    click: () => {
                        console.log(`Clicked lane ${lane.id}`, lane);
                    }
                }}
            />
        )})}
    </FeatureGroup>);
}

export default LaneCalque;