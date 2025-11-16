import { LoginInput, RegisterInput, UserData } from "@/scripts/types";
import { UseMutationResult } from "@tanstack/react-query";
import { createContext } from "react";

type AuthContextProps = {
    isLogged: boolean,
    isFetching: boolean,
    usuario: UserData,
    token: string | null,
    login: UseMutationResult<any, Error, LoginInput, unknown>,
    destruir_sesion: () => Promise<void>,
    registrarse: UseMutationResult<any, Error, RegisterInput, unknown>
};

const AuthContext = createContext<AuthContextProps>({
    isLogged: false,
    isFetching: true,
    usuario: {} as UserData,
    token: null,
    login: {} as UseMutationResult<any, Error, LoginInput, unknown>,
    destruir_sesion: async () => { },
    registrarse: {} as UseMutationResult<any, Error, RegisterInput, unknown>
});

export { AuthContext };

