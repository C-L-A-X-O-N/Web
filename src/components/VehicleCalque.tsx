import {FeatureGroup, Marker, useMap} from "react-leaflet";
import { useWebSocket } from "./WebSocketContext";
import { useEffect, useState } from "react";
import L, {LatLngBounds} from "leaflet";

interface Vehicle {
    id: string;
    angle: number;
    position: [number, number];
    type: string;
}

let lastUpdate = Date.now();

function VehicleCalque() {
    const {createEffectHandler} = useWebSocket();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [zoom, setZoom] = useState<number>(-1);
    const [bound, setBound] = useState<LatLngBounds>();
    const map = useMap();

    useEffect(() => {
        map.whenReady(() => {
            const updateZoomAndBound = () => {
                setZoom(map.getZoom());
                setBound(map.getBounds());
            }

            map.on("moveend zoomend", updateZoomAndBound);
            updateZoomAndBound();
        });

        return () => {
            map.off("moveend zoomend");
        };
    }, [map]);

    const getVehicleIcon = (vehicle: Vehicle, zoom: number) => {
        const angle = vehicle.angle || 0; 
        const size = 2 + (zoom - 16) * 2;

        const iconKey = `vehicle-icon-${angle}-${size}`;
        // @ts-ignore
        if (window._vehicleIcons === undefined) window._vehicleIcons = {};
        // @ts-ignore
        if (window._vehicleIcons[iconKey]) {
            // @ts-ignore
            return window._vehicleIcons[iconKey];
        }
        let icon;
        if(vehicle.type === "veh__private") {
            icon =L.divIcon({
                className: 'vehicle-icon-wrapper',
                html: `
                <div style="
                    width: ${size}px;
                    height: ${size}px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transform: rotate(${angle}deg);
                    transform-origin: center center;
                ">
                    <img 
                        src="/assets/car.svg" 
                        style="width: 100%; height: auto; display: block;" 
                    />
                </div>`,
                iconSize: [size, size],
                iconAnchor: [size/2, size/2],
            });
        }else if(vehicle.type === "train__tram") {
            icon =L.divIcon({
                className: 'vehicle-icon-wrapper',
                html: `
                <div style="
                    width: ${size}px;
                    height: ${size*8}px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transform: rotate(${angle}deg);
                    transform-origin: center center;
                ">
                    <img 
                        src="/assets/tram.png" 
                        style="width: ${size}px; height: ${size*8}px; display: block;" 
                    />
                </div>`,
                iconSize: [size, size*8],
                iconAnchor: [size/2, size*4],
            });
        }else if(vehicle.type === "bus__bus") {
            icon =L.divIcon({
                className: 'vehicle-icon-wrapper',
                html: `
                <div style="
                    width: ${size}px;
                    height: ${size*4}px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transform: rotate(${angle}deg);
                    transform-origin: center center;
                ">
                    <img 
                        src="/assets/bus.png" 
                        style="width: ${size}px; height: ${size*4}px; display: block;" 
                    />
                </div>`,
                iconSize: [size, size*4],
                iconAnchor: [size/2, size*2],
            });
        }else{
            console.warn("Unknown vehicle type:", vehicle.type);
            icon = L.divIcon({
                className: 'vehicle-icon-wrapper',
                html: `
                <div style="
                    width: ${size}px;
                    height: ${size}px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transform: rotate(${angle}deg);
                    transform-origin: center center;
                ">
                    <img 
                        src="/assets/unknown_vehicle.svg" 
                        style="width: 100%; height: auto; display: block;" 
                    />
                </div>`,
                iconSize: [size, size],
                iconAnchor: [size/2, size/2],
            });
        }
        // @ts-ignore
        window._vehicleIcons[iconKey] = icon;
        return icon;
    }

    const isPtrintable = (zoom: number, bound: any, vehicle: Vehicle) => {
        if (zoom < 16) {
            return false;
        }
        if (bound) {
            const latLng = L.latLng(vehicle.position);
            if (bound.contains(latLng) === false) {
                return false;
            }
            //return bound.contains(latLng);
        }
        return true;
    }

    useEffect(() => {
        const handler = createEffectHandler("vehicle", (data: any) => {
            console.time("vehicle_render");
            const now = Date.now();
            const elapsed = now - lastUpdate;
            document.documentElement.style.setProperty('--vehicule-transition-duration', `${elapsed}ms`);
            lastUpdate = now;
            setVehicles(data);
        });
        return handler;
    }, [createEffectHandler]);

    useEffect(() => {
        if (vehicles.length > 0) {
            console.timeEnd("vehicle_render");
        }
    }, [vehicles]);

    return (<FeatureGroup>
        {vehicles && vehicles.map((vehicle) => (
            (isPtrintable(zoom, bound, vehicle) && <Marker
                key={vehicle.id}
                position={vehicle.position}
                icon={getVehicleIcon(vehicle, zoom)}
                eventHandlers={{
                    click: () => {
                        console.log("Clicked", vehicle.id, "at position", vehicle.position, "with orientation", vehicle.angle);
                    }
                }}
            />)
        ))}
    </FeatureGroup>);
}

export default VehicleCalque;