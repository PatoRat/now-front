import DATA from "@/assets/databases/data";
import Post from "@/src/components/Post";
import { useTheme } from "@/src/hooks/theme-hooks";
import { Theme, useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import {
	Animated,
	Dimensions,
	FlatList,
	Image, Modal,
	Pressable,
	StyleSheet,
	Text,
	View,
	useWindowDimensions
} from "react-native";
import { getMyEvents } from "../api/event.route";
import PostPopUp from "../components/PostPopUp/PostPopUp";
import { URL_BACKEND } from "../config";
import { useAuth } from "../hooks/auth-hooks";


export default function ProfileGamified() {
	//Referencia para que te lleve a un lugar directo de tu perfil
	const postsRef = useRef<View>(null);
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
	const { width } = useWindowDimensions();
	const styles = stylesFn(theme, width);
	const [imagenes, setImagenes] = useState<string[]>([]);
	const { token, usuario } = useAuth();

	const [posts, setPosts] = useState<any[]>([]);

	const [avatar, setAvatar] = useState(1); // Avatar actual
	const [modalVisible, setModalVisible] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	// Modal de detalle de trofeo
	const [selectedBadge, setSelectedBadge] = useState<{
		type: "asistencia" | "organizador";
		index: number;
	} | null>(null);

	// Datos del usuario (simulados)
	const user = {
		name: "Mateo Villanueva",
		email: "mateo@email.com",
		createdEvents: 3,
		attendedEvents: 5,
	};

	const maxEvents = 5;

	// Para abrir pop-up
	const openPopup = (item: typeof DATA[number]) => {
		setSelectedPost(item);
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 250,
			useNativeDriver: true,
		}).start();
	};

	// Estado del pop-up
	const [selectedPost, setSelectedPost] = useState<null | (typeof DATA[number])>(null);
	const fadeAnim = useRef(new Animated.Value(0)).current;


	const cargarEventos = async () => {
		setRefreshing(true);
		try {
			// console.log("llegue a userloc: ", userLocation);
			const eventos = await getMyEvents(token);
			setPosts(eventos);
		} catch (error) {
			console.log("Error al traer eventos:", error);
		} finally {
			setRefreshing(false);
		}
	};

	const closePopup = () => {
		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: 200,
			useNativeDriver: true,
		}).start(() => setSelectedPost(null));
	};

	// Arrays de trofeos
	const asistenciaImages = [
		require("@/assets/images/trofeos/Asistencia-1.png"),
		require("@/assets/images/trofeos/Asistencia-2.png"),
		require("@/assets/images/trofeos/Asistencia-3.png"),
		require("@/assets/images/trofeos/Asistencia-4.png"),
		require("@/assets/images/trofeos/Asistencia-5.png"),
	];

	const organizadorImages = [
		require("@/assets/images/trofeos/Organizador-1.png"),
		require("@/assets/images/trofeos/Organizador-2.png"),
		require("@/assets/images/trofeos/Organizador-3.png"),
		require("@/assets/images/trofeos/Organizador-4.png"),
		require("@/assets/images/trofeos/Organizador-5.png"),
	];

	// Función renderizada de trofeos
	const renderBoxes = (count: number, type: "asistencia" | "organizador") => {
		const boxes = [];
		const images = type === "asistencia" ? asistenciaImages : organizadorImages;

		for (let i = 0; i < maxEvents; i++) {
			boxes.push(
				<View
					key={i}
					style={[styles.badgeBox, { opacity: i < count ? 1 : 0.3 }]}
				>
					<Pressable onPress={() => setSelectedBadge({ type, index: i })}>
						<Image source={images[i]} style={styles.badgeImage} />
					</Pressable>
				</View>
			);
		}
		return boxes;
	};
	
	useFocusEffect(
		useCallback(() => {
			cargarEventos(); // ejecuta la función al entrar en foco
		}, []) // vacío porque no depende de ninguna variable
	);

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

			{/* <View style={styles.gamification}>
					<Text style={styles.sectionTitle}>Trofeos de Organizador</Text>
					<View style={styles.badgesRow}>{renderBoxes(user.createdEvents, "organizador")}</View>

					<Text style={styles.sectionTitle}>Trofeos de Asistencia</Text>
					<View style={styles.badgesRow}>{renderBoxes(user.attendedEvents, "asistencia")}</View>
				</View> */}

			{/* Mis Publicaciones */}
			<Text style={styles.name}>Mis Publicaciones</Text>
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


			<PostPopUp visible={!!selectedPost} post={selectedPost} onClose={closePopup} />

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
											setAvatar(index + 1);
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

			{/* {selectedBadge && (
					<Modal
						animationType="fade"
						transparent={true}
						visible={!!selectedBadge}
						onRequestClose={() => setSelectedBadge(null)}
					>
						<View style={styles.modalBackground}>
							<View style={styles.detailModalContainer}>
								<Text style={styles.detailTitle}>
									{selectedBadge?.type === "asistencia"
										? `Trofeo Asistencia ${selectedBadge.index + 1}`
										: `Trofeo Organizador ${selectedBadge.index + 1}`}
								</Text>
								<Image
									source={
										selectedBadge
											? selectedBadge.type === "asistencia"
												? asistenciaImages[selectedBadge.index]
												: organizadorImages[selectedBadge.index]
											: null
									}
									style={styles.detailImage}
								/>

								<Text style={styles.detailTitle}>
									{selectedBadge
										? selectedBadge.type === "asistencia"
											? `Trofeo Asistencia ${selectedBadge.index + 1}`
											: `Trofeo Organizador ${selectedBadge.index + 1}`
										: ""}
								</Text>

								<View style={styles.progressBarBackground}>
									<View
										style={[
											styles.progressBarFill,
											{
												width: selectedBadge
													? `${((selectedBadge.index + 1) / maxEvents) * 100}%`
													: "0%",
											},
										]}
									/>
								</View>


								<Pressable
									style={[styles.closeButton, { marginTop: 20 }]}
									onPress={() => setSelectedBadge(null)}
								>
									<Text style={styles.closeButtonText}>Cerrar</Text>
								</Pressable>
							</View>
						</View>
					</Modal>
				)} */}

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
		container: {
			flex: 1,
			top: 50,
			backgroundColor: theme.colors.background
		},
		userRow: {
			flexDirection: "row",
			alignItems: "center",
			marginBottom: 30,
			marginHorizontal: 0, // se pega a los lados
			paddingHorizontal: 0, // si había padding heredado
		},

		avatarBox: {
			width: 120,
			height: 120,
			backgroundColor: "#ccc",
			borderWidth: 4,
			borderColor: "#888",
			justifyContent: "center",
			alignItems: "center",
			marginRight: 20,
		},
		avatarImage: {
			width: 100,
			height: 100,
			resizeMode: "contain"
		},
		userInfo: {
			flex: 1
		},
		name: {
			fontSize: 24,
			fontWeight: "bold",
			color: theme.colors.text
		},
		email: {
			fontSize: 16,
			color: theme.colors.text,
			marginTop: 5
		},
		gamification: {
			marginTop: 10
		},
		sectionTitle: {
			fontSize: 18,
			fontWeight: "bold",
			color: theme.colors.text,
			marginBottom: 10
		},
		badgesRow: {
			flexDirection: "row",
			flexWrap: "wrap",
			marginBottom: 20,
		},
		badgeBox: {
			width: "30%",
			height: 90,
			borderRadius: 12,
			justifyContent: "center",
			alignItems: "center",
			margin: 5,
		},
		badgeImage: { width: 80, height: 80, resizeMode: "contain" },
		modalBackground: {
			flex: 1,
			backgroundColor: "rgba(0,0,0,0.5)",
			justifyContent: "center",
			alignItems: "center",
		},
		modalContainer: {
			width: "90%",
			backgroundColor: theme.colors.background,
			borderRadius: 12,
			padding: 20,
			alignItems: "center",
		},
		modalTitle: {
			fontSize: 20,
			fontWeight: "bold",
			color: theme.colors.text,
			marginBottom: 15
		},
		modalAvatarBoxColumn: {
			width: '48%',
			height: 140,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: "#eee",
			borderRadius: 12,
		},
		modalAvatarImageColumn: {
			width: 100, height: 100,
			resizeMode: "center",
		},
		closeButtonText: {
			fontWeight: "bold",
			textAlign: "center"
		},
		detailModalContainer: {
			width: "80%",
			backgroundColor: theme.colors.background,
			borderRadius: 12,
			padding: 20,
			alignItems: "center",
		},
		detailTitle: { fontSize: 22, fontWeight: "bold", color: theme.colors.text, marginBottom: 15, textAlign: "center" },
		detailImage: { width: 150, height: 150, resizeMode: "contain", marginBottom: 15 },
		detailSubtitle: { fontSize: 16, color: theme.colors.text, marginBottom: 15, textAlign: "center" },
		progressBarBackground: { width: "100%", height: 15, backgroundColor: "#ddd", borderRadius: 8, overflow: "hidden" },
		progressBarFill: { height: "100%", backgroundColor: "#52e4f5ff", borderRadius: 8 },
	});

