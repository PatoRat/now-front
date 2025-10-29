import { AuthContextProps, ProviderProps } from "@/scripts/types";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext<AuthContextProps>({
    usuario: {} as string,
    // contrasenia: {} as string,
    isLogged: {} as boolean,
    logear: () => { },
});

const AuthProvider = ({ children }: ProviderProps) => {
    const [usuario, setUsuario] = useState("guest");
    const [contrasenia, setContrasenia] = useState("");
    const [isLogged, setLogged] = useState(false);

    const logear = (usuario: string, contrasenia: string) => {
        setUsuario(usuario);
        setContrasenia(contrasenia);
        setLogged(true);
    }

    return (
        <AuthContext.Provider value={{ usuario, isLogged, logear }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };

