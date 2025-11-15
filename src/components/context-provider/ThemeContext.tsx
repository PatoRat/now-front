import { BamvDark } from "@/scripts/themes";
import { Theme } from "@react-navigation/native";
import { createContext } from "react";

type ThemeContextProps = {
    theme: Theme,
    setTheme: (theme: Theme) => void
};

const ThemeContext = createContext<ThemeContextProps>({
    theme: BamvDark,
    setTheme: () => { }
});
/*
No podía resolver cómo hacer, asi que busqué en internet

La idea es copiar un poco el formato del ThemeProvider de react navigation
pero agregando la posibilidad de modificar el estado desde children
*/

export { ThemeContext };

