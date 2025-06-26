import type { LatLngBounds } from "leaflet";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useMap } from "react-leaflet";
import { useWebSocket } from "./WebSocketContext";

const ZoomContext = createContext<{ zoom: number, bound?: LatLngBounds }>({ zoom: -1, bound: undefined });

export const ZoomProvider = ({ children }: { children: ReactNode }) => {
    const [zoom, setZoomLevel] = useState(-1);
    const [bound, setBound] = useState<LatLngBounds>();
    const [ready, setReady] = useState(false);
    const map = useMap();
    const {send, createEffectHandler} = useWebSocket();

    const updateZoom = () => {
        console.log("UPDATING ZOOM", map);
        if (!map) {
            console.warn("Map is not ready yet, skipping zoom update.");
            return;
        }
        if (!ready) {
            console.warn("Map is not ready yet, skipping zoom update.");
            return;
        }
        setBound(map.getBounds());
        setZoomLevel(map.getZoom())
    };

    map.whenReady(() => {
        if (!ready) {
            setReady(true);
        }
    });

    useEffect(() => {
        map.on("moveend zoomend", updateZoom);
        updateZoom();
        return () => {
            map.off("moveend zoomend");
        };
    }, [map]);

    useEffect(() => {
        if (!ready) {
            console.warn("Map is not ready yet, skipping initial zoom update.");
            return;
        }
        updateZoom();
    }, [ready]);

    useEffect(createEffectHandler(
        "connected",
        updateZoom
    ), [createEffectHandler]);

    useEffect(() => {
        const northWest = bound?.getNorthWest();
        const southEast = bound?.getSouthEast();
        if (northWest && southEast) {
            send("session/frame_update", {
                minX: northWest.lng,
                minY: northWest.lat,
                maxX: southEast.lng,
                maxY: southEast.lat,
            })
        }
    }, [bound])

    return (
        <ZoomContext.Provider value={{ zoom, bound }}>
            {children}
        </ZoomContext.Provider>
    );
};

export const useZoomLevel = () => useContext(ZoomContext);