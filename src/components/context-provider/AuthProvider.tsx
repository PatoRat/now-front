import { Fav, ProviderProps, UserData } from "@/scripts/types";
import { userGet, userLogin, userRegister } from "@/src/app/api/user.route";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }: ProviderProps) => {
    const usuarioDefault = {
        id: 0,
        nombre: "guest",
        numeroAvatar: 0,
        favs: {} as Fav[]
    };

    const [token, setToken] = useState("");
    const [isLogged, setLogged] = useState(false);
    const [usuario, setUsuario] = useState<UserData>(usuarioDefault);

    useEffect(() => {
        (async () => {
            try {
                const tokenSaved = await SecureStore.getItemAsync('token');
                console.log(`useEffect, con token: ${tokenSaved}`);
                if (tokenSaved) {
                    setLogged(true);
                    setToken(tokenSaved);
                    setUsuario(await userGet(tokenSaved));
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
        setUsuario(await userGet(tokenAuth));

        await SecureStore.setItemAsync("token", tokenAuth).catch(() => { });
    }

    const destruir_sesion = async () => {
        setLogged(false);
        setToken("");
        setUsuario(usuarioDefault);

        await SecureStore.deleteItemAsync('token').catch(() => { });
    }

    const login = async (email: string, contrasenia: string) => {
        try {
            // const tokenSaved = await SecureStore.getItemAsync('token');
            // console.log("token", tokenSaved);

            const tokenAuth = await userLogin(email, contrasenia);

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
            const tokenAuth = await userRegister(nombre, email, contrasenia, numeroAvatar);

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

export { AuthProvider };

