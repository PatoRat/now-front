import { AuthContextProps, Fav, ProviderProps, UserData } from "@/scripts/types";
import { URL_BACKEND } from "@/src/config";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextProps>({
    isLogged: {} as boolean,
    usuario: {} as UserData,
    token: "",
    login: () => { },
    destruir_sesion: () => { },
    registrarse: () => { }
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

    const fetchUser = async (tokenAuth: string) => {
        console.log("llegue al fetch", tokenAuth);

        const response = await fetch(`${URL_BACKEND}/my-user`, {
            headers: {
                'Authorization': `Bearer ${tokenAuth}`,
            }
        });

        if (!response.ok) {
            console.error(response.body);
            throw new Error("Error al obtener la información del usuario");
        }

        return response.json();
    }

    useEffect(() => {
        (async () => {
            try {
                const storedLogged = await SecureStore.getItemAsync('isLogged');
                const tokenSaved = await SecureStore.getItemAsync('token');
                console.log(`useEffect, con storedLogged: ${storedLogged} y token: ${tokenSaved}`);
                if (storedLogged === 'true') {
                    setLogged(true);
                } else {
                    setLogged(false);
                }
                if (tokenSaved) {
                    setToken(tokenSaved);
                    setUsuario(await fetchUser(tokenSaved));
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);

    const guardar_sesion = async (tokenAuth: string) => {
        console.log("llegue");
        setLogged(true);
        setToken(tokenAuth);
        await SecureStore.setItemAsync('isLogged', 'true').catch(() => { });
        await SecureStore.setItemAsync("token", tokenAuth).catch(() => { });
    }

    const destruir_sesion = async () => {
        setLogged(false);
        setToken("");
        await SecureStore.setItemAsync('isLogged', 'false').catch(() => { });
        await SecureStore.deleteItemAsync('token').catch(() => { });
    }

    const login = async (email: string, contrasenia: string) => {
        try {
            const storedLogged = await SecureStore.getItemAsync('isLogged');
            const tokenSaved = await SecureStore.getItemAsync('token');
            console.log("token", tokenSaved);
            console.log("esta loggeado", storedLogged);
            const response = await fetch(`${URL_BACKEND}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
        <AuthContext.Provider value={{ isLogged, usuario, token, login, destruir_sesion, registrarse }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };

