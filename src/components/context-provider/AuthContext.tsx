import { AuthContextProps, UserData } from "@/scripts/types";
import { createContext } from "react";

const AuthContext = createContext<AuthContextProps>({
    isLogged: {} as boolean,
    usuario: {} as UserData,
    token: "",
    login: () => { },
    destruir_sesion: () => { },
    registrarse: () => { }
});

export { AuthContext };
