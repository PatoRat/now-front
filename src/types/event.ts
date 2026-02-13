export type Coordenadas = {
    lat: number;
    lon: number;
};

export type Ubicacion = {
    lat: number;
    lon: number;
    direccion?: string;
};

export type ImagenDeEvento = {
    id: number;
    url: string;
};

export type Evento  = {
    id: number;
    titulo: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    estaEliminado: boolean;
    ubicacion: {
        lat: number;
        lon: number;
    } | null;
};
