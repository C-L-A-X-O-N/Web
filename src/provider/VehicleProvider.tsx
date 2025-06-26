import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useWebSocket } from "./WebSocketContext";
import { useFocus } from "./FocusProvider";

export interface Vehicle {
    id: string;
    angle: number;
    position: [number, number];
    type: string;
}

const VehicleContext = createContext<{
    vehicles: Vehicle[]
}>({ vehicles: [] })


export const VehicleProvider = ({children}: { children: ReactNode }) => {
    const [vehiclesMap, setVehiclesMap] = useState<Map<string, Vehicle>>(new Map());
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const { createEffectHandler } = useWebSocket();
    const { isFocused } = useFocus();


    useEffect(() => {
        const unsub1 = createEffectHandler("vehicle", (data: Vehicle[]) => {
            if(!isFocused){
                console.info("Vehicle update ignored due to focus state");
                return;
            }
            const newVehicules = new Map<string, Vehicle>();
            data.forEach((veh) => {
                newVehicules.set(veh.id, veh)
            })
            setVehiclesMap(newVehicules)
            setVehicles(Array.from(newVehicules.values()));
        });
        return () => {
            unsub1 && unsub1();
        };
    }, [createEffectHandler, isFocused]);

    return (
        <VehicleContext.Provider value={{ vehicles }}>
            {children}
        </VehicleContext.Provider>
    );
}

export const useVehicles = () => useContext(VehicleContext);