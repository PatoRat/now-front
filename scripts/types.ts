
type AuthContextProps = {
    isLogged: boolean,
    usuario: UserData,
    token: string,
    login: (email: string, contrasenia: string) => void,
    destruir_sesion: () => void,
    registrarse: (nombre: string, email: string, contrasenia: string, numeroAvatar: number) => void
};

type ProviderProps = {
    children: React.ReactNode;
};

type UserData = {
    id: number,
    nombre: string,
    numeroAvatar: number,
    favs: Fav[]
};

type Fav = ({
    ubicacion: {
        eventId: number;
        latitud: number;
        longitud: number;
        direccion: string;
    } | null;
    imagenes: {
        id: number;
        eventId: number;
        url: string;
    }[];
} & {
    id: number;
    titulo: string;
    descripcion: string;
    fechaInicio: Date;
    fechaFin: Date;
    userId: number | null;
})

type ThemeColors = {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
}

export {
    AuthContextProps, Fav,
    ProviderProps, ThemeColors,
    UserData
};

