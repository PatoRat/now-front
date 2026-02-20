import Post from "@/src/components/Post/Post";
import { useTheme } from "@/src/hooks/theme-hooks";
import { Theme, useFocusEffect } from "@react-navigation/native";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useState } from "react";
import {
	Animated,
	FlatList,
	Image, Modal,
	Pressable,
	StyleSheet,
	Text,
	View,
	useWindowDimensions,
	LayoutAnimation,
	Platform,
	UIManager,
	ScrollView
} from "react-native";
import { getMyEvents } from "../api/event.route";
import { cambiarAvatar } from "../api/user.route";
import CustomAlert from "../components/CustomAlert";
import PostPopUp from "../components/Post/PostPopUp";
import { URL_BACKEND } from "../config";
import { useAlertState } from "../hooks/alert-hooks";
import { useAuth } from "../hooks/auth-hooks";

export default function ProfileGamified() {
	//Referencia para que te lleve a un lugar directo de tu perfil
	// const postsRef = useRef<View>(null);

	// Array de rutas estáticas
	const avatarImages = [
		require("@/assets/images/avatars/Avatar-1.png"),
		require("@/assets/images/avatars/Avatar-2.png"),
		require("@/assets/images/avatars/Avatar-3.png"),
		require("@/assets/images/avatars/Avatar-4.png"),
		require("@/assets/images/avatars/Avatar-5.png"),
		require("@/assets/images/avatars/Avatar-6.png"),
		require("@/assets/images/avatars/Avatar-7.png"),
		require("@/assets/images/avatars/Avatar-8.png"),
		require("@/assets/images/avatars/Avatar-9.png"),
		require("@/assets/images/avatars/Avatar-10.png"),
	];

	const { theme } = useTheme();
	const { width, height } = useWindowDimensions();
	const styles = stylesFn(theme, width, height);
	const { token, usuario } = useAuth();

	const { visible, mensaje, success } = useAlertState();


	// Estado del pop-up
	const [selectedPost, setSelectedPost] = useState<any>(null);
	const fadeAnim = useRef(new Animated.Value(0)).current;


	const [posts, setPosts] = useState<any[]>([]);
	const [openVigentes, setOpenVigentes] = useState(false);
	const [openPasados, setOpenPasados] = useState(false);

	const [modalVisible, setModalVisible] = useState(false);
	// const [refreshing, setRefreshing] = useState(false);

	// Modal de detalle de trofeo
	// const [selectedBadge, setSelectedBadge] = useState<{
	// 	type: "asistencia" | "organizador";
	// 	index: number;
	// } | null>(null);

	const queryClient = useQueryClient();

	const { mutate: cambiarNumeroAvatarMute } = useMutation({
		mutationFn: (newAvatarIndex: number) => {
			return cambiarAvatar(token, newAvatarIndex);
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
			mensaje.set("¡Avatar cambiado correctamente!");
			success.set(true);
			visible.set(true);

		},

		onError: (error) => {
			console.error("Error al cambiar el avatar:", error);
			mensaje.set("Error al cambiar el avatar");
			success.set(false);
			visible.set(true);
		}
	});

	const cambiarNumeroAvatar = (index: number) => {

		const newAvatarIndex = index + 1;
		cambiarNumeroAvatarMute(newAvatarIndex);
	};

	// const maxEvents = 5;

	// Para abrir pop-up
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

	const cargarEventos = async () => {
		// setRefreshing(true); // no se usa
		try {
			// console.log("llegue a userloc: ", userLocation);
			const eventos = await getMyEvents(token);
			setPosts(eventos);
		} catch (error) {
			console.log("Error al traer eventos:", error);
		} finally {
			// setRefreshing(false); // no se usa
		}
	};

	/* Ver draft/Profile Pedazo 1 */

	useFocusEffect(
		useCallback(() => {
			cargarEventos(); // ejecuta la función al entrar en foco
		}, []) // vacío porque no depende de ninguna variable
	);

	// Para filtrar eventos vigentes y pasados
	const now = new Date();

	const postsFiltrados = posts.filter(p => !p.estaEliminado);

	const postsVigentes = postsFiltrados
		.filter(p => new Date(p.fechaFin) >= now)
		.sort((a, b) =>
			new Date(a.fechaInicio).getTime() -
			new Date(b.fechaInicio).getTime()
		);

	const postsPasados = postsFiltrados
		.filter(p => new Date(p.fechaFin) < now)
		.sort((a, b) =>
			new Date(b.fechaFin).getTime() -
			new Date(a.fechaFin).getTime()
		);
	const toggleSection = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setter(prev => !prev);
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
				creador={item.creador ?? "Anónimo"}
				onSingleTap={() => openPopup(item)}
			/>
		);
	};

	return (
		<View style={styles.container}>
			{/* Info del usuario con avatar */}
			<View style={styles.userRow}>
				<Pressable
					onPress={() => setModalVisible(true)}
					style={styles.avatarBox}
				>
					<Image
						source={avatarImages[usuario.numeroAvatar - 1]}
						style={styles.avatarImage}
					/>
				</Pressable>

				<View style={styles.userInfo}>
					<Text style={styles.name}>{usuario.nombre}</Text>
					<Text style={styles.email}>{usuario.email}</Text>
				</View>
			</View>

			{/* Trofeos */}

			{/* Ver draft/Profile Pedazo 2 */}

			{/* Mis Publicaciones */}
			<Text style={styles.name}>Mis Publicaciones</Text>
			<Text style={styles.name}>Mis Publicaciones</Text>

			<ScrollView
				contentContainerStyle={styles.listaContenido}
				showsVerticalScrollIndicator={false}
			>

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
					postsVigentes.map(item => renderPost(item))
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
					postsPasados.map(item => renderPost(item))
				}

			</ScrollView>


			<PostPopUp
				visible={!!selectedPost}
				post={selectedPost}
				onClose={closePopup}
			/>

			{/* Modal de selección de avatar */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalBackground}>
					<View style={styles.modalContainer}>
						<Text style={styles.modalTitle}>Selecciona tu avatar</Text>

						<View style={{ maxHeight: 400, width: '100%' }}>
							<FlatList
								data={avatarImages}
								keyExtractor={(_, index) => index.toString()}
								numColumns={2}
								columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 15 }}
								contentContainerStyle={{ paddingVertical: 10 }}
								renderItem={({ item, index }) => (
									<Pressable
										onPress={() => {
											cambiarNumeroAvatar(index);
											setModalVisible(false);
										}}
										style={styles.modalAvatarBoxColumn}
									>
										<Image source={item} style={styles.modalAvatarImageColumn} />
									</Pressable>
								)}
							/>
						</View>

						<Pressable
							style={[styles.closeButton, { backgroundColor: "#52e4f5ff" }]}
							onPress={() => setModalVisible(false)}
						>
							<Text style={styles.closeButtonText}>Cerrar</Text>
						</Pressable>
					</View>
				</View>
			</Modal>

			{/*Modal de detalle de trofeo  */}

			{/* Ver draft/Profile Pedazo 3 */}

			<CustomAlert
				visible={visible.get()}
				message={mensaje.get()}
				isSuccessful={success.get()}
				onClose={() => visible.set(false)}
			/>

		</View>
	);
}

const stylesFn = (theme: Theme, width: number, height: number) => {
	const scale = Math.min(width / 400, 1.3);

	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.colors.background,
			paddingTop: 40 * scale,
			paddingHorizontal: 20 * scale,
		},

		userRow: {
			flexDirection: "row",
			alignItems: "center",
			marginBottom: 30 * scale,
			width: "100%",
		},

		avatarBox: {
			width: 130 * scale,
			height: 130 * scale,
			borderRadius: 12 * scale,
			backgroundColor: "#eee",
			overflow: "hidden",
			marginRight: 20 * scale,
			borderWidth: 3,
			borderColor: "#bbb",
		},

		avatarImage: {
			width: "120%",
			height: "110%",
			position: 'absolute',
			resizeMode: "cover",
			top: -10,
			left: -10,
		},



		userInfo: {
			flex: 1,
		},

		name: {
			fontSize: 26 * scale,
			fontWeight: "bold",
			color: theme.colors.text,
		},

		email: {
			fontSize: 16 * scale,
			color: "#666",
			marginTop: 4 * scale,
		},

		// Trofeos
		gamification: {
			marginVertical: 20 * scale,
			width: "100%",
		},

		sectionTitle: {
			fontSize: 18 * scale,
			fontWeight: "bold",
			color: theme.colors.text,
			marginBottom: 10 * scale,
		},

		badgesRow: {
			flexDirection: "row",
			flexWrap: "wrap",
			justifyContent: "space-between",
			marginBottom: 20 * scale,
		},

		badgeBox: {
			width: "30%",
			height: 90 * scale,
			borderRadius: 12 * scale,
			justifyContent: "center",
			alignItems: "center",
			marginBottom: 10 * scale,
			backgroundColor: "#f5f5f5",
		},

		badgeImage: {
			width: 80 * scale,
			height: 80 * scale,
			resizeMode: "contain",
		},

		// Lista de posts
		listaContenido: {
			paddingBottom: 120 * scale,
			width: "100%",
		},

		// Modal general
		modalBackground: {
			flex: 1,
			backgroundColor: "rgba(0,0,0,0.6)",
			justifyContent: "center",
			alignItems: "center",
			padding: 20 * scale,
		},

		modalContainer: {
			width: "90%",
			backgroundColor: theme.colors.card,
			borderRadius: 20 * scale,
			padding: 20 * scale,
			alignItems: "center",
		},

		modalTitle: {
			fontSize: 22 * scale,
			fontWeight: "bold",
			color: theme.colors.text,
			marginBottom: 15 * scale,
			textAlign: "center",
		},

		modalAvatarBoxColumn: {
			width: "48%",
			height: 140 * scale,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: "#eee",
			borderRadius: 12 * scale,
			marginBottom: 15 * scale,
		},

		modalAvatarImageColumn: {
			width: 120 * scale,
			height: 120 * scale,
			resizeMode: "contain",
			borderRadius: 10 * scale, // bordes suavizados
		},

		closeButton: {
			marginTop: 15 * scale,
			backgroundColor: "#3B82F6",
			paddingVertical: 10 * scale,
			paddingHorizontal: 25 * scale,
			borderRadius: 12 * scale,
			alignSelf: "center",
		},

		closeButtonText: {
			color: "#fff",
			fontWeight: "bold",
			fontSize: 16 * scale,
			textAlign: "center",
		},

		// Detalle de trofeo
		detailModalContainer: {
			width: "80%",
			backgroundColor: theme.colors.card,
			borderRadius: 20 * scale,
			padding: 20 * scale,
			alignItems: "center",
		},

		detailTitle: {
			fontSize: 22 * scale,
			fontWeight: "bold",
			color: theme.colors.text,
			marginBottom: 15 * scale,
			textAlign: "center",
		},

		detailImage: {
			width: 150 * scale,
			height: 150 * scale,
			resizeMode: "contain",
			marginBottom: 15 * scale,
		},

		progressBarBackground: {
			width: "100%",
			height: 15 * scale,
			backgroundColor: "#ddd",
			borderRadius: 8 * scale,
			overflow: "hidden",
			marginBottom: 15 * scale,
		},

		progressBarFill: {
			height: "100%",
			backgroundColor: "#52e4f5ff",
			borderRadius: 8 * scale,
		},
		sectionHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			paddingVertical: 12 * scale,
			borderBottomWidth: 1,
			borderColor: "#ddd",
			marginTop: 15 * scale,
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
	});
};
