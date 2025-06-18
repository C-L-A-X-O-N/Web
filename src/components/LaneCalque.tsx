import { FeatureGroup, Polyline, useMap } from "react-leaflet";
import { useLanes, type Lane } from "../provider/LaneProvider";
import { useZoomLevel } from "../provider/ZoomProvider";

function colorOfLane(lane: Lane) : string {
    const jam = Math.max(0, Math.min(1, lane.jam ?? 0));
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

    return jamColor;
}

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

    if(zoomLevel < 12) {
        return lane.priority >= 7; 
    }
    if(zoomLevel > 18) {
        return true; 
    }

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

function LaneCalque() {
    const { zoom } = useZoomLevel();
    const {lanes} = useLanes();
    
    return (<FeatureGroup>
        {lanes && Array.from(lanes.values()).map((lane) => {
            if(!shouldDisplayLane(lane, zoom)) {
                return null; 
            }
            const weight = 2 + 4 * Math.max(0, Math.min(1, lane.jam ?? 0));
            const color = colorOfLane(lane);
            return (
                <>
                    <Polyline
                        key={lane.id + color}
                        positions={[
                            ...lane.shape.map((point) => [point[1], point[0]] as [number, number]),
                        ]}
                        color={color}
                        weight={weight}
                        opacity={1}
                        eventHandlers={{
                            click: () => {
                                console.log(`Clicked lane ${lane.id}`, lane);
                            },
                        }}
                    />
                </>
            );})}
    </FeatureGroup>);
}

export default LaneCalque;