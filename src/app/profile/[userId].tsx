import React, { useCallback, useMemo, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    ScrollView,
    ActivityIndicator,
    LayoutAnimation,
    useWindowDimensions,
    Animated,
} from "react-native";
import { useLocalSearchParams, useFocusEffect, useRouter } from "expo-router";
import { URL_BACKEND } from "../../config";
import { useAuth } from "@/src/hooks/auth-hooks";
import { avatarMap } from "@/assets/constants/avatarMap";
import PostPopUp from "@/src/components/Post/PostPopUp";
import { Theme } from "@react-navigation/native";
import { useTheme } from "@/src/hooks/theme-hooks";
import Post from "@/src/components/Post/Post";


type Evento = {
    id: number;
    titulo: string;
    fecha: string;
    [key: string]: any;
};

export default function UserProfile() {
    const { token } = useAuth();
    const { theme } = useTheme();
    const { width, height } = useWindowDimensions();
    const styles = stylesFn(theme, width, height);
    const { userId } = useLocalSearchParams();
    const router = useRouter();

    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<Evento | null>(null);
    const [openVigentes, setOpenVigentes] = useState(true);
    const [openPasados, setOpenPasados] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    const toggleSection = (
        setter: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setter((prev) => !prev);
    };

    const fetchProfile = async () => {
        try {
            setLoading(true);

            const res = await fetch(
                `${URL_BACKEND}/users/${userId}/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();
            console.log("PROFILE DATA:", data);
            setProfile(data);

            setProfile(data);
        } catch (err) {
            console.error("Error fetching profile:", err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [userId])
    );

    const toggleFollow = async () => {
        if (!profile || followLoading) return;

        try {
            setFollowLoading(true);

            const method = profile.isFollowing ? "DELETE" : "POST";

            // Optimistic update
            setProfile((prev: any) => ({
                ...prev,
                isFollowing: !prev.isFollowing,
                followersCount: prev.isFollowing
                    ? prev.followersCount - 1
                    : prev.followersCount + 1,
            }));

            await fetch(`${URL_BACKEND}/users/${userId}/follow`, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (err) {
            console.error("Error toggling follow:", err);
            fetchProfile(); // rollback
        } finally {
            setFollowLoading(false);
        }
    };

    const posts: Evento[] = profile?.eventos ?? [];

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const { postsVigentes, postsPasados } = useMemo(() => {
        const now = new Date();

        return {
            postsVigentes: posts.filter(
                (post) => new Date(post.fechaInicio) >= now
            ),
            postsPasados: posts.filter(
                (post) => new Date(post.fechaInicio) < now
            ),
        };
    }, [posts]);

    const openPopup = (item: any) => {
        setSelectedPost(item);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };
    const renderPost = (item: any) => {

        const imagenesMapeadas = item.imagenes?.map((img: { url: string }) => {
            if (!img.url) return null;

            let uri = img.url;

            if (uri.startsWith("http")) {
                uri = uri.replace("localhost", URL_BACKEND.replace(/^https?:\/\//, ""));
                return { uri };
            }

            uri = uri.startsWith("/")
                ? `${URL_BACKEND}${uri}`
                : `${URL_BACKEND}/uploads/${uri}`;

            return { uri };
        }).filter(Boolean);

        return (
            <Post
                key={item.id}
                id={item.id}
                titulo={item.titulo ?? ""}
                descripcion={item.descripcion ?? ""}
                imagenes={imagenesMapeadas}
                fechaInicio={item.fechaInicio ? new Date(item.fechaInicio) : new Date()}
                fechaFin={item.fechaFin ? new Date(item.fechaFin) : new Date()}
                ubicacion={item.ubicacion ?? null}
                direccion={item.ubicacion?.direccion ?? ""}
                creador={item.creador}
                onSingleTap={() => openPopup(item)}
            />
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={styles.center}>
                <Text style={{ color: theme.colors.text }}>
                    No se pudo cargar el perfil
                </Text>
            </View>
        );
    }

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.listaContenido}
                showsVerticalScrollIndicator={false}
            >
                {/* BACK BUTTON */}
                <Pressable
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backArrow}>←</Text>
                </Pressable>
                {/* HEADER */}
                <View style={styles.userRow}>
                    <View style={styles.avatarBox}>
                        <Image
                            source={avatarMap[profile.numeroAvatar ?? 1]}
                            style={styles.avatarImage}
                        />
                    </View>

                    <View style={styles.userInfo}>
                        <Text style={styles.name}>{profile.nombre}</Text>

                        <View style={styles.followRow}>
                            <Text style={styles.followTextInfo}>
                                {profile.followersCount} Followers
                            </Text>
                            <Text style={styles.followTextInfo}>
                                {profile.followingCount} Following
                            </Text>
                        </View>

                        <Pressable
                            style={[
                                styles.followButton,
                                profile.isFollowing && styles.unfollowButton,
                                followLoading && { opacity: 0.6 },
                            ]}
                            onPress={toggleFollow}
                            disabled={followLoading}
                        >
                            <Text style={styles.followText}>
                                {profile.isFollowing ? "Dejar de seguir" : "Seguir"}
                            </Text>
                        </Pressable>
                    </View>
                </View>

                {/* Mis Publicaciones */}
                <Text style={styles.name}>Publicaciones</Text>

                {/* VIGENTES */}
                <Pressable
                    style={styles.sectionHeader}
                    onPress={() => toggleSection(setOpenVigentes)}
                >
                    <Text style={styles.sectionHeaderText}>
                        Eventos Futuros ({postsVigentes.length})
                    </Text>

                    <Text
                        style={[
                            styles.arrow,
                            { transform: [{ rotate: openVigentes ? "90deg" : "0deg" }] }
                        ]}
                    >
                        ▶
                    </Text>
                </Pressable>

                {openVigentes &&
                    (postsVigentes.length > 0
                        ? postsVigentes.map(renderPost)
                        : <Text style={styles.emptyText}>No hay eventos futuros</Text>)
                }

                {/* PASADOS */}
                <Pressable
                    style={styles.sectionHeader}
                    onPress={() => toggleSection(setOpenPasados)}
                >
                    <Text style={styles.sectionHeaderText}>
                        Eventos Pasados ({postsPasados.length})
                    </Text>

                    <Text
                        style={[
                            styles.arrow,
                            { transform: [{ rotate: openPasados ? "90deg" : "0deg" }] }
                        ]}
                    >
                        ▶
                    </Text>
                </Pressable>

                {openPasados &&
                    (postsPasados.length > 0
                        ? postsPasados.map(renderPost)
                        : <Text style={styles.emptyText}>No hay eventos pasados</Text>)
                }
            </ScrollView>

            {selectedPost && (
                <PostPopUp
                    post={selectedPost}
                    visible={true}
                    onClose={() => setSelectedPost(null)}
                />
            )}
        </>
    );
}

const stylesFn = (theme: Theme, width: number, height: number) => {
    const scale = Math.min(width / 400, 1.3);

    return StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: 20,
        },
        center: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        userRow: {
            flexDirection: "row",
            marginVertical: 25,
        },
        avatarBox: {
            marginRight: 20,
        },
        avatarImage: {
            width: 100,
            height: 100,
            borderRadius: 50,
        },
        userInfo: {
            flex: 1,
            justifyContent: "center",
        },
        name: {
            fontSize: 22 * scale,
            fontWeight: "bold",
            color: theme.colors.text,
        },
        followRow: {
            flexDirection: "row",
            gap: 15,
            marginVertical: 8,
        },
        followTextInfo: {
            fontSize: 14 * scale,
            color: theme.colors.text,
        },
        followButton: {
            backgroundColor: theme.colors.primary,
            paddingVertical: 8,
            paddingHorizontal: 15,
            borderRadius: 8,
            marginTop: 5,
            alignSelf: "flex-start",
        },
        unfollowButton: {
            backgroundColor: "#ef4444",
        },
        followText: {
            color: "white",
            fontWeight: "bold",
        },
        sectionHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 25,
            marginBottom: 10,
        },
        sectionHeaderText: {
            fontSize: 18 * scale,
            fontWeight: "bold",
            color: theme.colors.text,
        },
        arrow: {
            fontSize: 18 * scale,
            color: theme.colors.text,
        },
        postCard: {
            padding: 15,
            borderRadius: 12,
            marginBottom: 12,
            backgroundColor: theme.dark ? "#1f1f1f" : "#f3f4f6",
        },
        postTitle: {
            fontWeight: "bold",
            fontSize: 15 * scale,
            color: theme.colors.text,
        },
        postDate: {
            marginTop: 4,
            fontSize: 13 * scale,
            color: theme.colors.text,
            opacity: 0.7,
        },
        emptyText: {
            marginBottom: 10,
            color: theme.colors.text,
            opacity: 0.6,
        },
        listaContenido: {
            paddingBottom: 120 * scale,
        },
        backButton: {
            marginTop: '15%',          // más top
            marginBottom: 20,
            alignSelf: "flex-start",
            width: 44,
            height: 44,
            borderRadius: 22,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.dark ? "#1f1f1f" : "#e5e7eb",
        },

        backArrow: {
            fontSize: 22 * scale,
            color: theme.colors.text,
            textAlign: "center",
            includeFontPadding: false,
        },
    });
};