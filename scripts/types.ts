import { ImageSourcePropType } from "react-native";
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

type PostType = {
    id: number,
    titulo: string,
    descripcion: string,
    imagenes: ImageSourcePropType[]
    fechaInicio: Date
    fechaFin: Date
    ubicacion: Ubicacion,
    creador: {
        id: number,
        nombre: string,
        numeroAvatar: number
    },
    likesCont: number
};

type Ubicacion = {
    latitud: number,
    longitud: number,
    direccion: string
};
type BackendEvent = {
    id: number;
    titulo: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    ubicacion: {
        latitud: number;
        longitud: number;
        direccion: string;
    } | null;
};

type BackendUbicacion = {
    latitud: number;
    longitud: number;
    direccion: string;
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
    BackendEvent,
    BackendUbicacion, Coordenadas, Fav,
    Filtros, LoginInput,
    PostType,
    RegisterInput,
    ThemeColors,
    ThemeName,
    Ubicacion,
    UserData
};

