import { UserData } from "@/scripts/types";
import { createContext } from "react";

type AuthContextProps = {
    isLogged: boolean,
    isFetching: boolean,
    usuario: UserData,
    token: string | null,
    login: (email: string, contrasenia: string) => Promise<void>,
    destruir_sesion: () => Promise<void>,
    registrarse: (
        nombre: string,
        email: string,
        contrasenia: string,
        numeroAvatar: number
    ) => Promise<void>
};

const AuthContext = createContext<AuthContextProps>({
    isLogged: false,
    isFetching: true,
    usuario: {} as UserData,
    token: null,
    login: async () => {},
    destruir_sesion: async () => { },
    registrarse: async () => { }
});

export { AuthContext };

