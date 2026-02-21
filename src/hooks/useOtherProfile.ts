import { useQuery } from "@tanstack/react-query";
import { PostType, UserData } from "@/scripts/types";
import { otherEvents } from "../api/event.route";
import { getUser } from "../api/user.route";

type UseOtherProfileParams = {
    token: string | null;
    userId: number;
};

export const useOtherProfile = ({ token, userId }: UseOtherProfileParams) => {
    // Query para traer datos del usuario
    const userQuery = useQuery<UserData>({
        queryKey: ["other-user", userId],
        queryFn: () => getUser(String(userId)),
        enabled: !!token,
        staleTime: 1000 * 60 * 5, // 5 min cache
    });

    // Query para traer eventos del usuario
    const eventsQuery = useQuery<PostType[]>({
        queryKey: ["other-user-events", userId],
        queryFn: () => otherEvents(String(token), userId),
        enabled: !!token,
        staleTime: 1000 * 60 * 2, // 2 min cache
    });

    return {
        usuario: userQuery.data ?? null,
        eventos: eventsQuery.data ?? [],
        loading: userQuery.isLoading || eventsQuery.isLoading,
        error: userQuery.error ?? eventsQuery.error,
        refetch: () => {
            userQuery.refetch();
            eventsQuery.refetch();
        },
    };
};