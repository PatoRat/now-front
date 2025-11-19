import DATA from "@/assets/databases/data";
import Post from "@/src/components/Post";
import { useTheme } from "@/src/hooks/theme-hooks";
import { FontAwesome } from "@expo/vector-icons";
import { Theme } from "@react-navigation/native";
import { BlurView } from 'expo-blur';
import { useRef, useState } from "react";
import {
	Animated,
	Dimensions,
	FlatList,
	Image, Linking, Modal,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
	useWindowDimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


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
	const [posts] = useState(DATA);

	const [avatar, setAvatar] = useState(1); // Avatar actual
	const [modalVisible, setModalVisible] = useState(false);

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

	const formatoFecha = (fecha: Date) => {
		if (!fecha) return "";
		const date = new Date(fecha);
		return date.toLocaleDateString("es-AR", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	};
	// Para abrir el maps con el link y coordenadas (para cualquier app)
	const abrirEnMaps = (lat: number, lng: number) => {
		const url = Platform.select({
			ios: `maps:0,0?q=${lat},${lng}`,
			android: `geo:${lat},${lng}?q=${lat},${lng}`,
			default: `https://www.google.com/maps?q=${lat},${lng}`,
		});
		Linking.openURL(url!);
	};
	const [currentIndex, setCurrentIndex] = useState(0);

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

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				{/* Info del usuario con avatar */}
				<View style={styles.userRow}>
					<Pressable
						onPress={() => setModalVisible(true)}
						style={styles.avatarBox}
					>
						<Image
							source={avatarImages[avatar - 1]}
							style={styles.avatarImage}
						/>
					</Pressable>

					<View style={styles.userInfo}>
						<Text style={styles.name}>{user.name}</Text>
						<Text style={styles.email}>{user.email}</Text>
					</View>
				</View>

				{/* Trofeos */}
				<View style={styles.gamification}>
					<Text style={styles.sectionTitle}>Trofeos de Organizador</Text>
					<View style={styles.badgesRow}>{renderBoxes(user.createdEvents, "organizador")}</View>

					<Text style={styles.sectionTitle}>Trofeos de Asistencia</Text>
					<View style={styles.badgesRow}>{renderBoxes(user.attendedEvents, "asistencia")}</View>
				</View>
				{/* Mis Publicaciones */}
				<View ref={postsRef} style={{ marginTop: 30 }}>
					<Text style={[styles.sectionTitle, { fontSize: 20 }]}>Tus Publicaciones</Text>

					{/* Lista de posts*/}
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
						/>

						{/* Pop-up del post */}
						<Modal
							visible={!!selectedPost}
							transparent
							animationType="none"
							onRequestClose={closePopup}
						>
							<BlurView intensity={80} style={StyleSheet.absoluteFill}>
								<Pressable style={StyleSheet.absoluteFill} onPress={closePopup} />
							</BlurView>
							<Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
								<Pressable style={styles.overlay} onPress={closePopup} />
							</Animated.View>

							{selectedPost && (
								<Animated.View
									style={[
										styles.popupContainer,
										{
											opacity: fadeAnim,
											transform: [
												{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) },
												{ scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) },
												{ rotateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: ['15deg', '0deg'] }) },
											]

										},
									]}
								>
									{/* Carrusel de imágenes */}
									{selectedPost.imagenes?.length > 0 && (
										<>
											<FlatList
												data={selectedPost.imagenes}
												horizontal
												pagingEnabled
												showsHorizontalScrollIndicator={false}
												keyExtractor={(_, i) => i.toString()}
												onScroll={(e) => {
													const index = Math.round(
														e.nativeEvent.contentOffset.x / (width * 0.85)
													);
													setCurrentIndex(index);
												}}
												scrollEventThrottle={16}
												renderItem={({ item }) => (
													<View
														style={{
															width: width * 0.85,
															height: 200,
															marginRight: 10,
															borderRadius: 15,
															overflow: "hidden",
															shadowColor: "#000",
															shadowOpacity: 0.3,
															shadowRadius: 10,
															elevation: 5,
														}}
													>
														<Image
															source={item}
															style={{ width: "100%", height: "100%" }}
															resizeMode="cover"
														/>
													</View>
												)}
												contentContainerStyle={{ paddingHorizontal: width * 0.075 / 2 }}
											/>

											{/* Dots de paginación */}
											<View
												style={{
													flexDirection: "row",
													justifyContent: "center",
													marginTop: 10,
													marginBottom: 5,
												}}
											>
												{selectedPost.imagenes.map((_, i) => (
													<View
														key={i}
														style={{
															width: 8,
															height: 8,
															borderRadius: 4,
															marginHorizontal: 4,
															backgroundColor: i === currentIndex ? "#007AFF" : "#ccc",
														}}
													/>
												))}
											</View>
										</>
									)}

									{/*  Título */}
									<Text style={styles.popupTitle}>{selectedPost.titulo}</Text>

									{/*  Descripción */}
									{!!selectedPost.descripcion && (
										<Text style={styles.popupDesc}>{selectedPost.descripcion}</Text>
									)}

									{/*  Fechas */}
									<Text style={styles.fechaText}>
										Inicio: {selectedPost.fechaInicio ? formatoFecha(selectedPost.fechaInicio) : ""}
									</Text>
									<Text style={styles.fechaText}>
										Fin: {selectedPost.fechaFin ? formatoFecha(selectedPost.fechaFin) : ""}
									</Text>
									{/* Creador del post */}
									<View style={{ alignItems: "center", marginTop: 10 }}>
										<Text style={{ fontSize: 16, fontWeight: "bold", color: theme.colors.text }}>
											Creado por: {selectedPost.creador}
										</Text>
									</View>


									{/*  Ubicación */}
									{selectedPost.ubicacion && (
										<Pressable
											onPress={() =>
												abrirEnMaps(
													selectedPost.ubicacion.latitud,
													selectedPost.ubicacion.longitud
												)
											}
											android_ripple={{ color: "rgba(255,255,255,0.2)" }}
											style={({ pressed }) => [
												styles.direccionContainer,
												pressed && { opacity: 0.6 },
											]}
										>
											<FontAwesome
												style={styles.direccionIcon}
												size={24}
												name="map-marker"
												color="red"
											/>
											<Text style={styles.direccionText}>
												{selectedPost.ubicacion.direccion}
											</Text>
										</Pressable>

									)}



									{/* Botón cerrar */}
									<Pressable onPress={closePopup} style={({ pressed }) => [
										{ position: 'absolute', top: 10, right: 10, padding: 10, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)' },
										pressed && { backgroundColor: 'rgba(0,0,0,0.6)' }
									]}>

										<FontAwesome name="close" size={20} color="white" />
									</Pressable>

								</Animated.View>
							)}

						</Modal>
					</View>
				</View>

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

				{/* Modal de detalle de trofeo */}
				{selectedBadge && (
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
				)}
			</ScrollView>
		</SafeAreaView>
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
		container: { flex: 1, backgroundColor: theme.colors.background },
		scrollContainer: { padding: 20 },
		userRow: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
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
		avatarImage: { width: 100, height: 100, resizeMode: "contain" },
		userInfo: { flex: 1 },
		name: { fontSize: 24, fontWeight: "bold", color: theme.colors.text },
		email: { fontSize: 16, color: theme.colors.text, marginTop: 5 },
		gamification: { marginTop: 10 },
		sectionTitle: { fontSize: 18, fontWeight: "bold", color: theme.colors.text, marginBottom: 10 },
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
		modalTitle: { fontSize: 20, fontWeight: "bold", color: theme.colors.text, marginBottom: 15 },
		modalAvatarBoxColumn: {
			width: '48%',
			height: 140,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: "#eee",
			borderRadius: 12,
		},
		modalAvatarImageColumn: { width: 100, height: 100, resizeMode: "contain" },
		closeButtonText: { fontWeight: "bold", textAlign: "center" },
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
