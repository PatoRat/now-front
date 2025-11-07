import { Theme } from "@react-navigation/native";
import { ImageSourcePropType } from "react-native";

type ThemeContextProps = {
    theme: Theme,
    setTheme: (theme: Theme) => void
};

type AuthContextProps = {
    isLogged: boolean,
    isFetching: boolean,
    usuario: UserData,
    guardar_sesion: (token: string) => void,
    destruir_sesion: () => void,
    signUp: () => void
};

type PostType = {
    id: string,
    titulo: string,
    descripcion: string,
    imagenes: ImageSourcePropType[]
    fechaInicio: Date
    fechaFin: Date
    ubicacion: {
        latitud: number,
        longitud: number,
        direccion: string
    }
    creador: string,
};

type ImageSelectorButtonProps = {
    onSelect: React.Dispatch<React.SetStateAction<ImageSourcePropType[]>>;
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
    AuthContextProps, Fav, ImageSelectorButtonProps,
    PostType, ProviderProps, ThemeColors, ThemeContextProps,
    UserData
};

