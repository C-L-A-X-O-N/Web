import type { LatLngBounds } from "leaflet";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useMap } from "react-leaflet";

const ZoomContext = createContext<{ zoom: number, bound?: LatLngBounds }>({ zoom: -1, bound: undefined });

export const ZoomProvider = ({ children }: { children: ReactNode }) => {
    const [zoom, setZoomLevel] = useState(-1);
    const [bound, setBound] = useState<LatLngBounds>();
    const map = useMap();

    useEffect(() => {
        map.whenReady(() => {
            const updateZoom = () => {
                setBound(map.getBounds());
                setZoomLevel(map.getZoom())
            };
            map.on("moveend zoomend", updateZoom);
            updateZoom();
        });
        return () => {
            map.off("moveend zoomend");
        };
    }, [map]);

    return (
        <ZoomContext.Provider value={{ zoom, bound }}>
            {children}
        </ZoomContext.Provider>
    );
};

export const useZoomLevel = () => useContext(ZoomContext);