export type Coordenadas = {
  lat: number;
  lon: number;
};

export type Filtros = {
  fechaInicio: Date | null;
  fechaFin: Date | null;
  distanciaMin: number;
  distanciaMax: number;
  lugar: Coordenadas | null;
};