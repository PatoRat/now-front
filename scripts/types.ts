import { Theme } from "@react-navigation/native";
import { ImageSourcePropType } from "react-native";

type ThemeContextProps = {
    theme: Theme,
    setTheme: (theme: Theme) => void
};

type AuthContextProps = {
    usuario: string,
    // contrasenia: string,
    isLogged: boolean,
    logear: (usuario: string, contrasenia: string) => void,
    signUp: () => void
};

type PostType = {
    id: string,
    titulo: string,
    descripcion: string,
    imagenes: ImageSourcePropType[]
    fechaInicio : Date
    fechaFin : Date
    ubicacion : {
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

type ThemeColors = {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
}

export {
    AuthContextProps, ImageSelectorButtonProps,
    PostType, ProviderProps, ThemeColors, ThemeContextProps
};

