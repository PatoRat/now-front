import { AuthContextProps, Fav, ProviderProps, UserData } from "@/scripts/types";
import { URL_BACKEND } from "@/src/config";
import { useQuery } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextProps>({
    isLogged: {} as boolean,
    usuario: {} as UserData,
    isFetching: false,
    token: "",
    login: () => { },
    destruir_sesion: () => { },
    registrarse: () => { }
});

const AuthProvider = ({ children }: ProviderProps) => {
    const [token, setToken] = useState("");
    const [isLogged, setLogged] = useState(false);
    const [usuario] = useState<UserData>({
        id: 0,
        nombre: "guest",
        numeroAvatar: 0,
        favs: {} as Fav[]
    });

    const fetchUser = async (tokenAuth: string) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const response = await fetch(`${URL_BACKEND}/my-user`, {
            headers: {
                'Authorization': `Bearer ${tokenAuth}`,
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

    const guardar_sesion = async (tokenAuth: string) => {
        setLogged(true);
        setToken(tokenAuth);
        await SecureStore.setItemAsync('isLogged', 'true').catch(() => { });
        await SecureStore.setItemAsync("token", tokenAuth).catch(() => { });
    }

    const destruir_sesion = async () => {
        setLogged(false);
        await SecureStore.setItemAsync('isLogged', 'false').catch(() => { });
        await SecureStore.deleteItemAsync('token').catch(() => { });
    }

    const login = async (email: string, contrasenia: string) => {
        try {
            const response = await fetch(`${URL_BACKEND}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ email: email, password: contrasenia })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }

            const tokenAuth = await response.json();

            await guardar_sesion(tokenAuth);

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    const registrarse = async (
        nombre: string,
        email: string,
        contrasenia: string,
        numeroAvatar: number
    ) => {
        try {
            const response = await fetch(`${URL_BACKEND}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nombre: nombre,
                    email: email,
                    password: contrasenia,
                    numeroAvatar: numeroAvatar
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }

            const tokenAuth = await response.json();

            await guardar_sesion(tokenAuth);

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return (
        <AuthContext.Provider value={{ isLogged, usuario: data ? data : usuario, token, login, destruir_sesion, registrarse, isFetching }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };

