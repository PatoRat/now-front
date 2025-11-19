import { Fav, LoginInput, RegisterInput, UserData } from "@/scripts/types";
import { userGet, userLogin, userRegister } from "@/src/api/user.route";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

const USUARIO_DEFAULT = {
    id: 0,
    nombre: "guest",
    numeroAvatar: 0,
    favs: {} as Fav[]
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const queryClient = useQueryClient();

    const [checkedStore, setChecked] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [isLogged, setLogged] = useState(false);
    const [usuario, setUsuario] = useState<UserData>(USUARIO_DEFAULT);


    useEffect(() => {
        (async () => {
            try {
                ///////////////////////////////////////////////////////////////
                // let tokenPrevio = await SecureStore.getItemAsync("token");
                // console.log("Token previo: ", tokenPrevio);
                // await SecureStore.deleteItemAsync('token').catch(() => { });
                // tokenPrevio = await SecureStore.getItemAsync("token");
                // SOLO PARA LIMPIAR CACHE DEL DISPOSITIVO
                // COMENTAR DURANTE USO NORMAL
                /////////////////////////////////////////////////////////////// 

                const tokenSaved = await SecureStore.getItemAsync("token");

                // console.log("Token previo: ", tokenSaved);

                if (tokenSaved) {
                    setToken(tokenSaved);
                }

            } catch (e) {
                console.error(e);

            } finally {
                setChecked(true);
            }
        })();
    }, []);

    const {
        data: usuarioQuery,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["auth", "me", token],
        queryFn: () => userGet(token!),
        enabled: checkedStore && !!token
    });

    useEffect(() => {
        if (!checkedStore) return;

        if (!token) {
            setLogged(false);
            setUsuario(USUARIO_DEFAULT);
            return;
        }

        if (isLoading) return;

        if (isError) {
            setLogged(false);
            setUsuario(USUARIO_DEFAULT);
            return;
        }

        if (usuarioQuery) {
            // console.log("UsuarioQuery: ", usuarioQuery);

            setLogged(true);
            setUsuario(usuarioQuery);
        }
    }, [checkedStore, token, isLoading, isError, usuarioQuery]);

    const guardar_sesion = async (tokenAuth: string) => {
        // console.log("llegue");

        setToken(tokenAuth);
        await SecureStore.setItemAsync("token", tokenAuth).catch(() => { });

        queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    }

    const destruir_sesion = async () => {
        setToken(null);
        setUsuario(USUARIO_DEFAULT);
        setLogged(false);

        await SecureStore.deleteItemAsync('token').catch(() => { });
        queryClient.removeQueries({ queryKey: ["auth", "me"] });
    }

    const login = useMutation({
        mutationFn: ({
            email,
            contrasenia
        }: LoginInput) => userLogin(email, contrasenia),

        onError: (error: Error) => console.error(error.message),

        onSuccess: async (token) => {
            await guardar_sesion(token);
        }
    });

    const registrarse = useMutation({
        mutationFn: ({
            nombre,
            email,
            contrasenia,
            numeroAvatar
        }: RegisterInput) => userRegister(nombre, email, contrasenia, numeroAvatar),

        onError: (error: Error) => console.error(error.message),

        onSuccess: async (token) => {
            await guardar_sesion(token);
        }
    });

    return (
        <AuthContext.Provider value={{
            isLogged,
            isFetching: checkedStore && !!token && isLoading,
            usuario,
            token,
            login,
            destruir_sesion,
            registrarse
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider };

