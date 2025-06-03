import { FeatureGroup, Polyline } from "react-leaflet";
import { useWebSocket } from "./WebSocketContext";
import { useEffect, useState } from "react";

interface Lane {
    id: string;
    shape: [number, number][];
}

function LaneCalque() {
    const {createEffectHandler} = useWebSocket();
    const [lanes, setLanes] = useState<Lane[]>([]);
    
    useEffect(createEffectHandler("lanes/position", (data: any) => {
        console.debug("Lane data received:", data);
        setLanes(data);
    }), [createEffectHandler]);


    return (<FeatureGroup>
        {lanes && lanes.map((lane) => (
            <Polyline
                key={lane.id}
                positions={lane.shape}
                color="green"
                weight={2}
                opacity={0.5}
            />
        ))}
    </FeatureGroup>);
}

export default LaneCalque;