import { BamvDark } from "@/scripts/themes";
import { Theme } from "@react-navigation/native";
import { useState } from "react";
import { ThemeContext } from "./ThemeContext";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(BamvDark);

    /*
    Mi idea es que cuando abra la app, use la secure store de expo para
    chequear las preferencias guardadas y que awaitee para que se setee automaticamente
    como lo haya guardado, pero a la vez, que cada vez que cambie el Theme, actualice tanto
    la pestaña como el secure store, basicamente hoy por hoy solo llamo a setTheme y le paso el
    Theme, pero ahora quiero pasarle una funcion que haga el cambio en secure store y haga tambien el
    setTheme.
    
    Eso no es lo que me parece dificil, lo que realmente no se si hacer con un useEffect, es al
    iniciar el bundler, es decir al hacer el get del secureStore, no el set
    */

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export { ThemeProvider };

