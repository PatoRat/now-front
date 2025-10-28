import { DarkTheme, Theme } from "@react-navigation/native";
import { createContext, useState } from "react";

type ThemeContextProps = {
    theme: Theme,
    setTheme: (theme: Theme) => void
};

const ThemeContext = createContext<ThemeContextProps>({
    theme: {} as Theme,
    setTheme: () => { }
});
/*
No podía resolver cómo hacer, asi que busqué en internet
*/

type ThemeProviderProps = {
    children: React.ReactNode;
};

/*
La idea es copiar un poco el formato del ThemeProvider de react navigation
pero agregando la posibilidad de modificar el estado desde children
*/

const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [theme, setTheme] = useState(DarkTheme);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export { ThemeContext, ThemeProvider };

