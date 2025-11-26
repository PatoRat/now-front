import Post from "@/src/components/Post/Post";
import { URL_BACKEND } from "@/src/config";
import { useTheme } from "@/src/hooks/theme-hooks";
import { Theme } from "@react-navigation/native";
import * as Location from "expo-location";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    Image,
    Pressable,
    RefreshControl,
    StyleSheet,
    View,
    useWindowDimensions
} from "react-native";
import { getAllEvents, getEvents, getFavs } from "../api/event.route";
import { useLikes } from "../components/context-provider/LikeContext";
import CustomAlert from "../components/CustomAlert";
import PostPopUp from "../components/Post/PostPopUp";
import { useAlertState } from "../hooks/alert-hooks";
import { useAuth } from "../hooks/auth-hooks";


export default function Discover() {

    const { theme } = useTheme();
    const { width } = useWindowDimensions();
    const { token } = useAuth();
    const styles = stylesFn(theme, width);
    const router = useRouter();

    const [posts, setPosts] = useState<any[]>([]);
    const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

    // Pop-up
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Refresh
    const [refreshing, setRefreshing] = useState(false);

    const { visible, mensaje, success } = useAlertState();

    const nuevoPost = () => router.push({ pathname: "../postear" });

    const openPopup = (item: any) => {
        setSelectedPost(item);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };

    const closePopup = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => setSelectedPost(null));
    };
    
    // Carga de los likes del usuario a una const global

    const { setAllLikes } = useLikes();
    const cargarFavoritos = async () => {
    try {
        const favsData = await getFavs(token);
        const favs: number[] = favsData.map((f: any) => f.id);

        const likeMap: Record<number, boolean> = {};

        favs.forEach((id: number) => {
            likeMap[id] = true;
        });

        setAllLikes(likeMap);

    } catch (error) {
        console.log("Error cargando favoritos:", error);
    }
};

    const distancia = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const ordenarPorCercaniaConArray = (eventos: any[], pos: { lat: number; lon: number }) => {
        const conUbicacion = eventos.filter(e => e.ubicacion?.latitud != null && e.ubicacion?.longitud != null);
        const sinUbicacion = eventos.filter(e => !e.ubicacion?.latitud || !e.ubicacion?.longitud);

        const ordenados = conUbicacion.sort((a, b) => {
            const distA = distancia(pos.lat, pos.lon, a.ubicacion.latitud, a.ubicacion.longitud);
            const distB = distancia(pos.lat, pos.lon, b.ubicacion.latitud, b.ubicacion.longitud);
            return distA - distB;
        });

        setPosts([...ordenados, ...sinUbicacion]);
    };

    const cargarEventos = async () => {
        setRefreshing(true);
        try {
            if (userLocation) {
                // console.log("llegue a userloc: ", userLocation);
                const eventos = await getEvents(token, userLocation);
                ordenarPorCercaniaConArray(eventos, userLocation);
            } else {
                const eventos = await getAllEvents(token);
                setPosts(eventos);
            }
        } catch (error) {
            // console.log("Error al traer eventos:", error);
            mensaje.set(`Error al traer eventos: ${error}`);
            success.set(false);
            visible.set(true);

        } finally {
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (userLocation) cargarEventos();
        }, [userLocation])
    );

    // Ubicación
    useEffect(() => {
        (async () => {
            await cargarFavoritos();
            
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Permisos de ubicación denegados");
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const pos = { lat: location.coords.latitude, lon: location.coords.longitude };
            setUserLocation(pos);

            // Carga inicial
            await cargarEventos();
        })();
    }, []);

    const onRefresh = () => cargarEventos();

    if (!posts.length && !userLocation) {
        return (
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.colors.background,
            }}>
                {/* Logo arriba */}
                <Image
                    source={require("@/assets/images/NOW-LOGO.png")}
                    style={{ width: 150, height: 150, resizeMode: "contain", marginBottom: 50 }}
                />

                {/* Spinner abajo */}
                <ActivityIndicator
                    size="large"
                    color="#52E4F5"
                    style={{ position: "absolute", bottom: 100 }}
                />
            </View>
        );
    }
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
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#52E4F5"
                        colors={["#52E4F5"]}
                        progressBackgroundColor="#ffffff00"
                    />
                }
            />

            <Pressable style={styles.botonContainer} onPress={nuevoPost}>
                <Image
                    source={require("@/assets/images/new-post.png")}
                    style={styles.nuevoPosteo}
                    resizeMode="contain"
                />
            </Pressable>


            <PostPopUp visible={!!selectedPost} post={selectedPost} onClose={closePopup} />
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
        botonContainer: {
            position: "absolute",
            bottom: 20,
            right: 20,
            padding: 10,
            borderRadius: 50,
        },
        nuevoPosteo: {
            width: width * 0.16,
            height: width * 0.16,
        },
        overlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0,0,0,0.5)",
        },
        popupContainer: {
            position: "absolute",
            bottom: Dimensions.get("window").height * 0.25,
            alignSelf: "center",
            width: "85%",
            backgroundColor: theme.colors.background,
            borderRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.4,
            shadowRadius: 10,
            elevation: 8,
        },
        popupTitle: {
            fontSize: 20,
            fontWeight: "bold",
            color: theme.colors.text,
            marginBottom: 10,
            textAlign: "center",
        },
        popupDesc: {
            color: theme.colors.text,
            fontSize: 15,
            marginBottom: 15,
            textAlign: "center",
        },
        closeButton: {
            alignSelf: "flex-end",
            backgroundColor: "#007AFF",
            paddingVertical: 8,
            paddingHorizontal: 15,
            borderRadius: 10,
        },
        carousel: {
            width: "100%",
            height: 200,
            marginBottom: 15,
        },
        popupImage: {
            width: Dimensions.get("window").width * 0.85,
            height: 200,
            borderRadius: 15,
            marginRight: 5,
        },
        direccionContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
        },
        fechasContainer: {
            marginTop: 10,
        },
        fechaText: {
            color: theme.colors.text,
            fontSize: 14,
            textAlign: "center",
            marginBottom: 10,
        },
        direccionIcon: {
            marginRight: 6,
            fontSize: 16,
        },
        direccionText: {
            fontSize: 14,
            color: theme.colors.text,
            flexShrink: 1,
        },
    });
