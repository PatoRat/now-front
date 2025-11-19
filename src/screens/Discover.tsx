import DATA from "@/assets/databases/data";
import Post from "@/src/components/Post";
import { useTheme } from "@/src/hooks/theme-hooks";
import { Theme } from "@react-navigation/native";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    View,
    useWindowDimensions
} from "react-native";
import PostPopUp from "../components/PostPopUp/PostPopUp";
import { RefreshControl } from "react-native";


export default function Discover() {
	const { theme } = useTheme();
	const { width } = useWindowDimensions();
	const styles = stylesFn(theme, width);
	const router = useRouter();
	const [posts, setPosts] = useState(DATA);

	// Estado del pop-up
	const [selectedPost, setSelectedPost] = useState<null | (typeof DATA[number])>(null);
	const fadeAnim = useRef(new Animated.Value(0)).current;

	// Estado de refresco
	const [refreshing, setRefreshing] = useState(false);

	useFocusEffect(
		useCallback(() => {
			setPosts([...DATA]);
		}, [])
	);

	// Simula carga desde backend
	const onRefresh = () => {
		setRefreshing(true);

		setTimeout(() => {
			setPosts([...DATA]); // acá pedir datos al backend
			setRefreshing(false);
		}, 800);
	};

	const nuevoPost = () => router.push({ pathname: "../postear" });

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
