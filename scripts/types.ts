import { ImageSourcePropType } from "react-native";

type PostType = {
    id: string,
    titulo: string,
    descripcion: string,
    imagenes: ImageSourcePropType[]
    fechaInicio: Date
    fechaFin: Date
    ubicacion: Ubicacion,
    creador: string,
};

type Ubicacion = {
    latitud: number,
    longitud: number,
    direccion: string
};

type Coordenadas = {
    lat: number;
    lon: number;
};

type Filtros = {
    fechaInicio: Date | null;
    fechaFin: Date | null;
    distanciaMin: number;
    distanciaMax: number;
    lugar: Coordenadas | null;
};
type RegisterInput = {
    nombre: string,
    email: string,
    contrasenia: string,
    numeroAvatar: number
};

type LoginInput = Omit<RegisterInput, "nombre" | "numeroAvatar">;

type ThemeName = "dark" | "light";

type UserData = {
    id: number,
    email: string,
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
    Coordenadas,
    Filtros,
    Fav,
    LoginInput,
    PostType,
    RegisterInput,
    ThemeColors,
    ThemeName,
    Ubicacion,
    UserData
};

