import {FeatureGroup, Marker, useMap} from "react-leaflet";
import { useWebSocket } from "./WebSocketContext";
import { useEffect, useState } from "react";
import L, {LatLngBounds} from "leaflet";

interface Vehicle {
    id: string;
    angle: number;
    position: [number, number];
}

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
    }, [map]);

    const getVehicleIcon = (angle: number, zoom: number) => {
        let size = 0;
        if (zoom == 18) {
            size = 16
        } else if (zoom == 17) {
            size = 9;
        }
        return L.divIcon({
            className: 'vehicle-icon-wrapper',
            html: `
                 <img 
                   src="/assets/car.svg"
                   class="vehicle-icon" 
                   style="
                     width: ${size}px;
                     height: ${size}px;
                     transform: rotate(${angle}deg);
                     transform-origin: center center;
                   "
                 />
               `,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
        });
    }

    const isPtrintable = (zoom: number, bound: any, vehicle: Vehicle) => {
        if (zoom < 17) {
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

    useEffect(createEffectHandler("vehicle", (data: any) => {
        console.time("vehicle_render")
        setVehicles(data);
    }), [createEffectHandler]);

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
                icon={getVehicleIcon(vehicle.angle, zoom)}
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