import { ThemeName } from "@/scripts/types";
import { getThemeFromName, readTheme, writeTheme } from "@/src/hooks/theme-hooks";
import { Theme } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { ThemeContext } from "./ThemeContext";



const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const queryClient = useQueryClient();


    const { data: themeName = "dark" } = useQuery({
        queryKey: ["themePreference"],
        queryFn: readTheme,
        initialData: "dark", // mientras busca de SecureStore
        staleTime: Infinity,
    });

    const { mutate: guardarTheme } = useMutation({
        mutationFn: writeTheme,
        onError: (error) => {
            console.warn("Error guardando theme en SecureStore:", error);
        },
    });

    
    const cambiarTheme = (theme: Theme) => {
        const name: ThemeName = theme.dark ? "dark" : "light";
        queryClient.setQueryData<ThemeName>(["themePreference"], name);

        
        guardarTheme(name);
    };

    const theme = getThemeFromName(themeName as ThemeName);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                cambiarTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export { ThemeProvider };

