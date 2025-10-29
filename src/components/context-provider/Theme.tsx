import { BamvDark } from "@/scripts/themes";
import { ProviderProps, ThemeContextProps } from "@/scripts/types";
import { Theme } from "@react-navigation/native";
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext<ThemeContextProps>({
    theme: {} as Theme,
    setTheme: () => { }
});
/*
No podía resolver cómo hacer, asi que busqué en internet

La idea es copiar un poco el formato del ThemeProvider de react navigation
pero agregando la posibilidad de modificar el estado desde children
*/

const ThemeProvider = ({ children }: ProviderProps) => {
    const [theme, setTheme] = useState<Theme>(BamvDark);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

const useTheme = () => useContext(ThemeContext);

export { ThemeProvider, useTheme };

