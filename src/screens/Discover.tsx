import { distancia } from "@/scripts/functions";
import { Filtros, PostType } from "@/scripts/types";
import Post from "@/src/components/Post/Post";
import { URL_BACKEND } from "@/src/config";
import { useTheme } from "@/src/hooks/theme-hooks";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import { Theme } from "@react-navigation/native";
import * as Location from "expo-location";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
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
import FilterModal from "../components/Filter/Filter";
import FilterContent from "../components/Filter/FilterContent";
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

    // Refresh
    const [refreshing, setRefreshing] = useState(false);


    const { visible, mensaje, success } = useAlertState();

    const nuevoPost = () => router.push({ pathname: "../postear" });

    const openPopup = (item: any) => {
        router.push({
            pathname: "../post/[id]",
            params: { id: String(item.id) },
        });
    };



    //FILTER



    const [filtros, setFiltros] = useState<Filtros>({
        fechaInicio: new Date(),
        fechaFin: null,
        distanciaMin: 0,
        distanciaMax: 50,
        lugar: null,
    });

    useEffect(() => {
        if (userLocation) {
            setFiltros(prev => ({
                ...prev,
                lugar: userLocation,
            }));
        }
    }, [userLocation]);

    const [filterVisible, setFilterVisible] = useState(false);

    const aplicarFiltros = (f: Filtros) => {
        const filtrosFinales: Filtros = {
            ...f,
            lugar: f.lugar ?? userLocation,
        };

        setFiltros(filtrosFinales);
        setFilterVisible(false);
        cargarEventos(filtrosFinales);
    };

    const onDelete = (id: string) => {
        setPosts(prev => prev.filter(event => Number(event.id) !== Number(id)));
    }

    // Carga de los likes del usuario a una const global

    const { setAllLikes, setAllLikesCont } = useLikes();
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

    const setearLikeContPorEvento = (eventos: PostType[]) => {
        const likeContMap: Record<number, number> = {};

        eventos.forEach((evento: PostType) => {
            likeContMap[Number(evento.id)] = evento.likesCont;
        });

        setAllLikesCont(likeContMap);
    }

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

    const cargarEventos = async (filtrosActivos?: Filtros) => {
        setRefreshing(true);

        const filtrosAUsar = filtrosActivos ?? filtros;

        try {
            const location = filtrosAUsar.lugar ?? userLocation;

            if (location) {
                const eventos = await getEvents(
                    token,
                    location,
                    filtrosAUsar.distanciaMin,
                    filtrosAUsar.distanciaMax
                );

                const eventosFiltrados = eventos.filter((evento) => {
                    const fechaEvento = new Date(evento.fechaInicio);

                    // Filtro fechaInicio
                    if (
                        filtrosAUsar.fechaInicio &&
                        fechaEvento < filtrosAUsar.fechaInicio
                    ) {
                        return false;
                    }

                    // Filtro fechaFin
                    if (
                        filtrosAUsar.fechaFin &&
                        fechaEvento > filtrosAUsar.fechaFin
                    ) {
                        return false;
                    }

                    return true;
                });

                setearLikeContPorEvento(eventosFiltrados);

                ordenarPorCercaniaConArray(eventosFiltrados, location);
            } else {
                const eventos = await getAllEvents(token);
                setearLikeContPorEvento(eventos);
                setPosts(eventos);
            }
        } catch (error) {
            mensaje.set(`Error al traer eventos: ${error}`);
            success.set(false);
            visible.set(true);
        } finally {
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (userLocation) {
                cargarEventos();
            }
        }, [userLocation, filtros])
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

            <Pressable
                style={styles.filtroButton}
                onPress={() => setFilterVisible(true)}
            >
                <MaterialIcons
                    name="filter-list"
                    size={26}
                    color="#000"
                />
            </Pressable>

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
                            onDelete={onDelete}
                            posicionActual={userLocation}
                        />
                    );
                }}
                ListHeaderComponent={<View style={{ height: 70 }} />}
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



            {/* Boton de Filtros */}
            <FilterModal
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
            >

                <FilterContent onApply={aplicarFiltros} />
            </FilterModal>



            <Pressable style={styles.botonContainer} onPress={nuevoPost}>
                <Image
                    source={require("@/assets/images/new-post.png")}
                    style={styles.nuevoPosteo}
                    resizeMode="contain"
                />
            </Pressable>

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

const stylesFn = (theme: Theme, width: number) => {
    const scale = Math.min(width / 400, 1.3);

    return StyleSheet.create({
        filtroButton: {
            position: "absolute",
            top: 20,
            left: 20,
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "#52E4F5",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
            elevation: 5, // Android
        },
        filtroIcon: {
            width: 24,
            height: 24,
            tintColor: "#000",
        },
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
        input: {
            borderWidth: 1,
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
            borderRadius: 16 * scale,
            paddingVertical: 14 * scale,
            paddingHorizontal: 18 * scale,
            fontSize: 20 * scale,
            color: theme.colors.text,
            marginBottom: 16 * scale,
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
}