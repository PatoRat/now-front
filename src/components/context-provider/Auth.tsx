import { AuthContextProps, Fav, ProviderProps, UserData } from "@/scripts/types";
import { URL_BACKEND } from "@/src/config";
import { useQuery } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextProps>({
    isLogged: {} as boolean,
    usuario: {} as UserData,
    isFetching: false,
    guardar_sesion: () => { },
    destruir_sesion: () => { },
    signUp: () => { }
});

const AuthProvider = ({ children }: ProviderProps) => {
    const [token, setToken] = useState("");
    const [isLogged, setLogged] = useState(false);
    const [usuario, setUsuario] = useState<UserData>({
        id: 0,
        nombre: "guest",
        numeroAvatar: 0,
        favs: {} as Fav[]
    });

    const fetchUser = async (token: string) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const response = await fetch(`${URL_BACKEND}/my-user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            throw new Error("Error al obtener la información del usuario");
        }

        return response.json() as Promise<UserData>
    }

    const { isFetching, data, } = useQuery({
        queryKey: ["user", token],
        enabled: !!token,
        queryFn: () => fetchUser(token)
    });

    useEffect(() => {
        (async () => {
            try {
                const storedLogged = await SecureStore.getItemAsync('isLogged');
                const tokenSaved = await SecureStore.getItemAsync('token');
                if (storedLogged === 'true') {
                    setLogged(true);
                } else {
                    setLogged(false);
                }
                if (tokenSaved) {
                    setToken(tokenSaved);
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);

    const guardar_sesion = async (token: string) => {
        setLogged(true);
        await SecureStore.setItemAsync('isLogged', 'true').catch(() => { });
        await SecureStore.setItemAsync("token", token).catch(() => { });
    }

    const destruir_sesion = async () => {
        setLogged(false);
        await SecureStore.setItemAsync('isLogged', 'false').catch(() => { });
        await SecureStore.deleteItemAsync('token').catch(() => { });
    }

    return (
        <AuthContext.Provider value={{ isLogged, usuario: data ? data : usuario, guardar_sesion, destruir_sesion, signUp, isFetching }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

const signUp = () => { }

export { AuthProvider, signUp, useAuth };

