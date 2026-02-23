import { useTheme } from "@/src/hooks/theme-hooks";
import { Theme } from "@react-navigation/native";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useContext, useState } from "react";
import { FlatList, StyleSheet, useWindowDimensions, View } from "react-native";
import { getFavs } from "../api/event.route";
import { AuthContext } from "../components/context-provider/AuthContext";
import CustomAlert from "../components/CustomAlert";
import Post from "../components/Post/Post";
import { URL_BACKEND } from "../config";
import { useAlertState } from "../hooks/alert-hooks";

export default function Favs() {
    const { theme } = useTheme();
    const { width } = useWindowDimensions();
    const styles = stylesFn(theme, width);
    const router = useRouter();

    const { token } = useContext(AuthContext);

    const [posts, setPosts] = useState<any[]>([]);

    const { visible, mensaje, success } = useAlertState();

    const cargarFavs = async () => {
        // setRefreshing(true); // no se usa
        // setError(null); // no se usa
        try {
            // if (!token) throw new Error("No hay token de usuario");
            const favs = await getFavs(token);
            setPosts(favs);

        } catch (error: any) {
            // console.error("Error al traer favoritos:", error);
            mensaje.set(`Ocurrio un error trayendo los favoritos: ${error}`);
            success.set(false);
            visible.set(true);
            // setError(err.message || "Error desconocido"); // no se usa
        } finally {
            // setRefreshing(false); // no se usa
        }
    };

    useFocusEffect(
        useCallback(() => {
            // setLoading(true); // no se usa
            cargarFavs()/*.finally(() => setLoading(false))*/; // no se usa
        }, [token])
    );

    const openPopup = (item: any) => {
        router.push({
            pathname: "../post/[id]",
            params: { id: String(item.id) },
        });
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
                            likesCont={item.likesCont ?? 0}
                        />
                    );
                }}
                contentContainerStyle={styles.listaContenido}
                showsVerticalScrollIndicator={false}

            />

            {/* Alert */}
            <CustomAlert
                visible={visible.get()}
                message={mensaje.get()}
                isSuccessful={success.get()}
                onClose={() => visible.set(false)}
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
