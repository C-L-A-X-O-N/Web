import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useWebSocket } from "./WebSocketContext";
import { useFocus } from "./FocusProvider";

export interface Accident {
    id: string;
    position: [number, number]; // [latitude, longitude]
    type: string;
    start_time: number; // Étape de la simulation où l'accident s'est produit
    zone: number; // Zone géographique de l'accident
}

const AccidentContext = createContext<{
    accidents: Accident[]
}>({ accidents: [] })

export const AccidentProvider = ({children}: { children: ReactNode }) => {
    const [accidents, setAccidents] = useState<Accident[]>([]);
    const { createEffectHandler } = useWebSocket();
    const { isFocused } = useFocus();

    useEffect(() => {
        //console.log("AccidentProvider: Initialisation des handlers WebSocket");
        
        const unsub1 = createEffectHandler("accident/position", (data: Accident[]) => {
            console.log("Accidents reçus (type: accident):", data, "Longueur:", data.length);
            
            if(!isFocused){
                //console.info("Accident update ignored due to focus state");
                return;
            }
            
            // Logique MQTT : garder toujours la dernière donnée valide
            if (data.length > 0) {
                console.log("Mise à jour avec nouvelles données:", data);
                setAccidents(data);
            } else {
                console.log("Tableau vide reçu - GARDE les données précédentes (comportement MQTT)");
                // Ne pas effacer les données, garder les dernières valeurs valides
            }
        });

        // Timer pour récupérer les données toutes les secondes
        const interval = setInterval(() => {
            if (isFocused) {
                //console.log("Timer: Demande de mise à jour des accidents");
            }
        }, 500);
        
        return () => {
            unsub1 && unsub1();
            clearInterval(interval);
        };
    }, [createEffectHandler, isFocused]);

    return (
        <AccidentContext.Provider value={{ accidents }}>
            {children}
        </AccidentContext.Provider>
    );
}

export const useAccidents = () => useContext(AccidentContext);
