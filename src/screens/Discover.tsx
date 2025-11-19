import DATA from "@/assets/databases/data";
import Post from "@/src/components/Post";
import { useTheme } from "@/src/hooks/theme-hooks";
import { Theme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
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
import PostPopUp from "../components/PostPopUp/PostPopUp";

import { Filtros, Ubicacion } from "@/scripts/types";
import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { eventGet } from "../api/event.route";
import { useAuth } from "../hooks/auth-hooks";

export default function Discover() {
	const { theme } = useTheme();
	const { width } = useWindowDimensions();
	const styles = stylesFn(theme, width);
	const router = useRouter();
	const { token } = useAuth();
	// const [posts, setPosts] = useState(DATA);
	const [filtros, setFiltros] = useState<Filtros>({ ubicacion: null });
	// const [userLocation, setUserLocation] = useState<Filtros>(null);

	// Estado del pop-up
	const [selectedPost, setSelectedPost] = useState<null | (typeof DATA[number])>(null);
	const fadeAnim = useRef(new Animated.Value(0)).current;

	// Estado de refresco
	const [refreshing, setRefreshing] = useState(false);

	const { data: posts, isLoading, isError } = useQuery({
		queryKey: ["posts", filtros],
		queryFn: () => eventGet(filtros, token)
	});

	const obtenerUbicacionActual = async (): Promise<Omit<Ubicacion, "direccion"> | null> => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			console.log("Permisos de ubicación denegados");
			return null;
		}

		const location = await Location.getCurrentPositionAsync({});
		const lat = location.coords.latitude;
		const lon = location.coords.longitude;

		return {
			latitud: lat,
			longitud: lon
		};
	}

	const onRefresh = async () => {
		setRefreshing(true);
		try {
			const ubicacion = await obtenerUbicacionActual();

			if (ubicacion) {
				setFiltros((prev) => ({ ...prev, ubicacion }));
			}
		}
		finally {
			setRefreshing(false);
		}
	};

	const nuevoPost = () => router.push({ pathname: "../postear" });

	//Abrir y cerrar Pop Up
	const openPopup = (item: typeof DATA[number]) => {
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
	///////////////////////////////////////////////////
	//Funciones para FILTRAR POR CERCANIA
	useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				console.log("Permisos de ubicación denegados");
				return;
			}

			const location = await Location.getCurrentPositionAsync({});
			const lat = location.coords.latitude;
			const lon = location.coords.longitude;

			setUserLocation({ lat, lon });

			// Orden inicial
			ordenarPorCercania({ lat, lon });
		})();
	}, []);
	////////////////////////////////


	const distancia = (lat1: number, lon1: number, lat2: number, lon2: number) => {
		const R = 6371; // km
		const dLat = ((lat2 - lat1) * Math.PI) / 180;
		const dLon = ((lon2 - lon1) * Math.PI) / 180;

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(lat1 * Math.PI / 180) *
			Math.cos(lat2 * Math.PI / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c; // distancia en km
	};
	const ordenarPorCercania = (pos: { lat: number; lon: number }) => {
		const ordenados = [...DATA].sort((a, b) => {
			const distA = distancia(
				pos.lat,
				pos.lon,
				a.ubicacion?.latitud ?? 0,
				a.ubicacion?.longitud ?? 0
			);

			const distB = distancia(
				pos.lat,
				pos.lon,
				b.ubicacion?.latitud ?? 0,
				b.ubicacion?.longitud ?? 0
			);

			return distA - distB;
		});

		setPosts(ordenados);
	};




	return (
		<View style={{ flex: 1 }}>
			<FlatList
				data={posts}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<Post
						titulo={item.titulo}
						descripcion={item.descripcion}
						imagenes={item.imagenes}
						fechaInicio={item.fechaInicio}
						fechaFin={item.fechaFin}
						ubicacion={item.ubicacion}
						direccion={item.ubicacion?.direccion}
						creador={item.creador}
						onSingleTap={() => openPopup(item)}
					/>
				)}

				contentContainerStyle={styles.listaContenido}
				showsVerticalScrollIndicator={false}

				// RefreshControl personalizado
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor="#52E4F5"      // iOS
						colors={["#52E4F5"]}      // Android
						progressBackgroundColor="#ffffff00"
					/>
				}
			/>

			{/* Botón nuevo post */}
			<View style={styles.botonContainer}>
				<Pressable onPress={nuevoPost}>
					<Image
						source={require("@/assets/images/new-post.png")}
						style={styles.nuevoPosteo}
						resizeMode="contain"
					/>
				</Pressable>
			</View>

			<PostPopUp
				visible={!!selectedPost}
				post={selectedPost}
				onClose={closePopup}
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
		},
		nuevoPosteo: {
			width: Dimensions.get("window").width * 0.16,
			height: Dimensions.get("window").width * 0.16,
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
