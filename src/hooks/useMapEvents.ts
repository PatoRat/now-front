import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../api/event.route";

type UseMapEventsParams = {
    token: string | null;
    lat: number;
    lon: number;
};

export const useMapEvents = ({ token, lat, lon }: UseMapEventsParams) => {
    return useQuery({
        queryKey: ["map-events", lat, lon],
        queryFn: () =>
            getEvents(token, { lat, lon }, 0, 20),
        enabled: !!lat && !!lon,
    });
};
