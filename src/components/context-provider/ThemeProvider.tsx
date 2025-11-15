import { BamvDark } from "@/scripts/themes";
import { ProviderProps } from "@/scripts/types";
import { Theme } from "@react-navigation/native";
import { useState } from "react";
import { ThemeContext } from "./ThemeContext";

const ThemeProvider = ({ children }: ProviderProps) => {
    const [theme, setTheme] = useState<Theme>(BamvDark);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export { ThemeProvider };

