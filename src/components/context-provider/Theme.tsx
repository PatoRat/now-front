import { ThemeContextProps, ThemeProviderProps } from "@/scripts/types";
import { DarkTheme, Theme } from "@react-navigation/native";
import { createContext, useState } from "react";

const ThemeContext = createContext<ThemeContextProps>({
    theme: {} as Theme,
    setTheme: () => { }
});
/*
No podía resolver cómo hacer, asi que busqué en internet

La idea es copiar un poco el formato del ThemeProvider de react navigation
pero agregando la posibilidad de modificar el estado desde children
*/

const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [theme, setTheme] = useState<Theme>(DarkTheme);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export { ThemeContext, ThemeProvider };

