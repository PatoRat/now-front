import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { URL_BACKEND } from "../../config";
import { useAuth } from "@/src/hooks/auth-hooks";
import { avatarMap } from "@/assets/constants/avatarMap";
import PostPopUp from "@/src/components/Post/PostPopUp";

export default function UserProfile() {
    const { token } = useAuth();
    const { userId } = useLocalSearchParams();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [openVigentes, setOpenVigentes] = useState(true);
    const [openPasados, setOpenPasados] = useState(false);

    const fetchProfile = async () => {
        try {


            const res = await fetch(
                `${URL_BACKEND}/users/${userId}/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
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
        try {

            if (profile.isFollowing) {
                await fetch(`${URL_BACKEND}/users/${userId}/follow`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                await fetch(`${URL_BACKEND}/users/${userId}/follow`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            fetchProfile();
        } catch (err) {
            console.error("Error toggling follow:", err);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={styles.center}>
                <Text>No se pudo cargar el perfil</Text>
            </View>
        );
    }

    const posts = profile?.eventos ?? [];

    const now = new Date();

    const postsVigentes = posts.filter(
        (post: any) => new Date(post.fecha) >= now
    );

    const postsPasados = posts.filter(
        (post: any) => new Date(post.fecha) < now
    );

    const renderPost = (post: any) => (
        <Pressable
            key={post.id}
            style={styles.postCard}
            onPress={() => setSelectedPost(post)}
        >
            <Text style={styles.postTitle}>{post.titulo}</Text>
            <Text>{new Date(post.fecha).toLocaleDateString()}</Text>
        </Pressable>
    );

    return (
        <>
            <ScrollView style={styles.container}>
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
                                Followers: {profile.followersCount}
                            </Text>
                            <Text style={styles.followTextInfo}>
                                Following: {profile.followingCount}
                            </Text>
                        </View>

                        <Pressable
                            style={[
                                styles.followButton,
                                profile.isFollowing && styles.unfollowButton,
                            ]}
                            onPress={toggleFollow}
                        >
                            <Text style={styles.followText}>
                                {profile.isFollowing ? "Dejar de seguir" : "Seguir"}
                            </Text>
                        </Pressable>
                    </View>
                </View>

                {/* EVENTOS VIGENTES */}
                <Pressable
                    onPress={() => setOpenVigentes(!openVigentes)}
                    style={styles.sectionHeader}
                >
                    <Text style={styles.sectionTitle}>Eventos Vigentes</Text>
                </Pressable>

                {openVigentes &&
                    (postsVigentes.length > 0 ? (
                        postsVigentes.map(renderPost)
                    ) : (
                        <Text style={styles.emptyText}>
                            No hay eventos vigentes
                        </Text>
                    ))}

                {/* EVENTOS PASADOS */}
                <Pressable
                    onPress={() => setOpenPasados(!openPasados)}
                    style={styles.sectionHeader}
                >
                    <Text style={styles.sectionTitle}>Eventos Pasados</Text>
                </Pressable>

                {openPasados &&
                    (postsPasados.length > 0 ? (
                        postsPasados.map(renderPost)
                    ) : (
                        <Text style={styles.emptyText}>
                            No hay eventos pasados
                        </Text>
                    ))}
            </ScrollView>

            {selectedPost && (
                <PostPopUp
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)} visible={false}                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    userRow: {
        flexDirection: "row",
        marginBottom: 30,
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
        fontSize: 22,
        fontWeight: "bold",
    },
    followRow: {
        flexDirection: "row",
        marginVertical: 8,
        gap: 15,
    },
    followTextInfo: {
        fontSize: 14,
    },
    followButton: {
        backgroundColor: "#4f46e5",
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
        marginTop: 20,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    postCard: {
        padding: 15,
        backgroundColor: "#f3f4f6",
        borderRadius: 10,
        marginBottom: 10,
    },
    postTitle: {
        fontWeight: "bold",
    },
    emptyText: {
        marginBottom: 10,
        color: "gray",
    },
});