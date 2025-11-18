import { BamvDark, BamvLight } from "@/scripts/themes";
import { ThemeName } from "@/scripts/types";
import * as SecureStore from "expo-secure-store";
import { useContext } from "react";
import { ThemeContext } from "../components/context-provider/ThemeContext";

const useTheme = () => useContext(ThemeContext);

const getThemeFromName = (name: ThemeName) => {
    console.log("entro al get, con name: ", name);
    return name === "light" ? BamvLight : BamvDark;
}

const readTheme = async () => {
    const stored = await SecureStore.getItemAsync("theme");

    console.log("Tema guardado", stored);

    if (stored === "light" || stored === "dark") {
        return stored;
    }

    return "dark"; // default, aguante Modo Oscuro
};

const writeTheme = async (name: ThemeName) => {
    console.log("entro aca?? ", name);
    await SecureStore.setItemAsync("theme", name).catch(() => { });
};

export { getThemeFromName, readTheme, useTheme, writeTheme };

