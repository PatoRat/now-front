import { useTheme } from "@/src/hooks/theme-hooks";
import { Theme } from "@react-navigation/native";
import React, { useCallback, useRef, useState, useContext } from "react";
import { Animated, FlatList, ScrollView, StyleSheet, Text, useWindowDimensions, View, ActivityIndicator, RefreshControl } from "react-native";
import PostPopUp from "../components/PostPopUp/PostPopUp";
import Post from "../components/Post";
import { useFocusEffect } from "expo-router";
import { AuthContext } from "../components/context-provider/AuthContext";
import { getFavs } from "../api/event.route";
import { URL_BACKEND } from "../config";

export default function Favs() {
    const { theme } = useTheme();
    const { width } = useWindowDimensions();
    const styles = stylesFn(theme, width);

    const { token } = useContext(AuthContext);

    const [posts, setPosts] = useState<any[]>([]);
    const [selectedPost, setSelectedPost] = useState<null | any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const cargarFavs = async () => {
        setRefreshing(true);
        setError(null);
        try {
            if (!token) throw new Error("No hay token de usuario");

            const favs = await getFavs(token);
            setPosts(favs);

        } catch (err: any) {
            console.error("Error al traer favoritos:", err);
            setError(err.message || "Error desconocido");
        } finally {
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            cargarFavs().finally(() => setLoading(false));
        }, [token])
    );

    const openPopup = (item: any) => {
        setSelectedPost(item);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={posts}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => {

                    // PARA VER EN EL LOG LO QUE SE RECIBE
                    // console.log("Evento:", item);
                    // console.log(
                    // 	"Imagenes del evento:",
                    // 	item.imagenes?.map((img: { id: number; eventId: number; url: string }) => img.url)
                    // );

                    const imagenesMapeadas = item.imagenes?.map((img: { url: string }) => {
                        if (!img.url) return null;

                        let uri = img.url;

                        // Caso 1: empieza con http
                        if (uri.startsWith("http")) {
                            // Reemplazamos localhost si lo contiene
                            uri = uri.replace("localhost", URL_BACKEND.replace(/^https?:\/\//, ""));
                            return { uri };
                        }

                        // Caso 2: ruta relativa o nombre de archivo
                        uri = uri.startsWith("/") ? `${URL_BACKEND}${uri}` : `${URL_BACKEND}/uploads/${uri}`;
                        return { uri };
                    }).filter(Boolean); // elimina nulls

                    return (
                        <Post
                            id={item.id}
                            titulo={item.titulo ?? ""}
                            descripcion={item.descripcion ?? ""}
                            imagenes={imagenesMapeadas}
                            fechaInicio={item.fechaInicio ? new Date(item.fechaInicio) : new Date()}
                            fechaFin={item.fechaFin ? new Date(item.fechaFin) : new Date()}
                            ubicacion={item.ubicacion ?? null}
                            direccion={item.ubicacion?.direccion ?? ""}
                            creador={item.creador ?? "Anónimo"}
                            onSingleTap={() => openPopup(item)}
                        />
                    );
                }}
                contentContainerStyle={styles.listaContenido}
                showsVerticalScrollIndicator={false}
                
            />
        </View>
    );
}

const stylesFn = (theme: Theme, width: number) =>
    StyleSheet.create({
        listaContenido: {
            paddingBottom: 100,
        },
        texto: {
            color: theme.colors.text,
            alignSelf: "center",
            marginBottom: 8,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.colors.text,
            marginBottom: 10
        },
        container: {
            flex: 1,
            backgroundColor: theme.colors.background
        },
    });
