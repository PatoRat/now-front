import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../api/event.route";

export const useEventsQuery = (
    tokenAuth: string | null,
    location: { lat: number; lon: number },
    distanciaMin: number,
    distanciaMax: number,
    filtrosExtra?: {
        fechaInicio?: Date | null;
        fechaFin?: Date | null;
    }
) => {

    return useQuery({
        queryKey: [
            "events",
            location,
            distanciaMin,
            distanciaMax,
            filtrosExtra?.fechaInicio?.toISOString(),
            filtrosExtra?.fechaFin?.toISOString()
        ],
        queryFn: () =>
            getEvents(
                tokenAuth,
                location!,
                distanciaMin,
                distanciaMax,
                filtrosExtra
            ),
        enabled: !!location && !!tokenAuth, // evita ejecutar si no hay datos
        staleTime: 1000 * 60 * 5 // 5 minutos cache
    });
};