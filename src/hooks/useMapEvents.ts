import { PostType } from "@/scripts/types";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../api/event.route";

type UseMapEventsParams = {
    token: string | null;
    lat: number | null;
    lon: number | null;
    rangoMin?: number;
    rangoMax?: number;
};

export const useMapEvents = ({
    token,
    lat,
    lon,
    rangoMin = 0,
    rangoMax = 20,
}: UseMapEventsParams) => {
    return useQuery<PostType[]>({
        queryKey: ["map-events", lat, lon, rangoMin, rangoMax],
        queryFn: () =>
            getEvents(token, { lat: lat!, lon: lon! }, rangoMin, rangoMax),
        enabled: !!token && lat !== null && lon !== null,
    });
};

