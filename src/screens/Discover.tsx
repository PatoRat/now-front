import Post from "@/src/components/Post";
import { useTheme } from "@/src/hooks/theme-hooks";
import { Theme } from "@react-navigation/native";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    View,
    useWindowDimensions,
    RefreshControl
} from "react-native";
import PostPopUp from "../components/PostPopUp/PostPopUp";
import * as Location from "expo-location";
import { useAuth } from "@/src/hooks/auth-hooks";
import { URL_BACKEND } from "@/src/config";

export const getEvents = async () => {
	try {
		const res = await fetch(`${URL_BACKEND}/events/all`);
		if (!res.ok) throw new Error(`Error ${res.status}`);
		const data = await res.json();
		return data; // Array de eventos
	} catch (error) {
		console.error("Error fetching events:", error);
		throw error;
	}
};

	
export default function Discover() {
    const { theme } = useTheme();
    const { width } = useWindowDimensions();
    const styles = stylesFn(theme, width);
    const router = useRouter();
	
	const [imagenes, setImagenes] = useState<string[]>([]);

    const [posts, setPosts] = useState<any[]>([]);
    const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

    // Pop-up
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Refresh
    const [refreshing, setRefreshing] = useState(false);

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
			const eventos = await getEvents();
			if (userLocation) {
				ordenarPorCercaniaConArray(eventos, userLocation);
			} else {
				setPosts(eventos);
			}
		} catch (error) {
			console.log("Error al traer eventos:", error);
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

    return (
        <View style={{ flex: 1 }}>
            <FlatList
				data={posts}
				keyExtractor={item => item.id.toString()}
				renderItem={({ item }) => (
					<Post
					titulo={item.titulo ?? ""}
					descripcion={item.descripcion ?? ""}
					imagenes={item.imagenes?.length ? item.imagenes.map((i: string) => ({ uri: i })) : []}
					fechaInicio={item.fechaInicio ? new Date(item.fechaInicio) : new Date()}
					fechaFin={item.fechaFin ? new Date(item.fechaFin) : new Date()}
					ubicacion={item.ubicacion ?? null}
					direccion={item.ubicacion?.direccion ?? ""}
					creador={item.creador ?? "Anónimo"}
					onSingleTap={() => openPopup(item)}
					/>
				)}
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


            <View style={styles.botonContainer}>
                <Pressable onPress={nuevoPost}>
                    <Image
                        source={require("@/assets/images/new-post.png")}
                        style={styles.nuevoPosteo}
                        resizeMode="contain"
                    />
                </Pressable>
            </View>

            <PostPopUp visible={!!selectedPost} post={selectedPost} onClose={closePopup} />
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
