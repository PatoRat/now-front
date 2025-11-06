import { AuthContextProps, ProviderProps } from "@/scripts/types";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext<AuthContextProps>({
    isLogged: {} as boolean,
    guardar_sesion: () => { },
    destruir_sesion: () => { },
    signUp: () => { }
});

const AuthProvider = ({ children }: ProviderProps) => {
    const [isLogged, setLogged] = useState(false);

    const guardar_sesion = async (token: string) => {
        await SecureStore.setItemAsync("token", token);
        setLogged(true);
    }

    const destruir_sesion = async () => {
        setLogged(false);
    }

    return (
        <AuthContext.Provider value={{ isLogged, guardar_sesion, destruir_sesion, signUp }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

const signUp = () => { }

export { AuthProvider, signUp, useAuth };

