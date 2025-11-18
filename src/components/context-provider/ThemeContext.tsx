import { BamvDark } from "@/scripts/themes";
import { Theme } from "@react-navigation/native";
import { createContext } from "react";

type ThemeContextProps = {
    theme: Theme,
    cambiarTheme: (theme: Theme) => void
};

const ThemeContext = createContext<ThemeContextProps>({
    theme: BamvDark,
    cambiarTheme: () => { }
});

export { ThemeContext };

