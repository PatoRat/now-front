import { getEventById } from "@/src/api/event.route";
import PostPopUp from "@/src/components/Post/PostPopUp";
import { useAuth } from "@/src/hooks/auth-hooks";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, View } from "react-native";

export default function PostRoute() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { token } = useAuth();

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const closePopup = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => router.back());
    };

    const fetchPost = async () => {
        if (typeof id !== "string") {
            throw new Error("ID invalida");
        }

        const stringId = id;

        const event = await getEventById(token, stringId);
        setPost(event);
        setLoading(false);
    }

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
        }).start();
        // console.log(id);

        if (id) fetchPost();

    }, [id]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!post) {
        return null;
    }

    return (
        <PostPopUp
            visible={true}
            post={post}
            onClose={closePopup}
        />
    );
}