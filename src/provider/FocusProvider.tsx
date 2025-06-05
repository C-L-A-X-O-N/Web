import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const FocusContext = createContext<{ isFocused: boolean }>({ isFocused: true });

export const FocusProvider = ({ children }: { children: ReactNode }) => {
    const [isFocused, setIsFocused] = useState<boolean>(document.hasFocus());

    useEffect(() => {
        const onFocus = () => setIsFocused(true);
        const onBlur = () => setIsFocused(false);
        const onVisibilityChange = () => setIsFocused(!document.hidden);

        window.addEventListener("focus", onFocus);
        window.addEventListener("blur", onBlur);
        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => {
            window.removeEventListener("focus", onFocus);
            window.removeEventListener("blur", onBlur);
            document.removeEventListener("visibilitychange", onVisibilityChange);
        };
    }, []);

    useEffect(() => {
        console.info(`Focus state changed: ${isFocused ? "Focused" : "Not Focused"}`);
    }, [isFocused]);

    return (
        <FocusContext.Provider value={{ isFocused }}>
            {children}
        </FocusContext.Provider>
    );
};

export const useFocus = () => useContext(FocusContext);