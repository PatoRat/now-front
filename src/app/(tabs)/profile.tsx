import { ThemeColors } from "@/scripts/types";
import { useTheme } from "@/src/hooks/theme-hooks";
import { useState } from "react";
import {
    FlatList,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileGamified() {
	const { theme } = useTheme();
	const styles = stylesFn(theme.colors);

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

				{/* Gamificación */}
				<View style={styles.gamification}>
					<Text style={styles.sectionTitle}>Trofeos de Organizador</Text>
					<View style={styles.badgesRow}>{renderBoxes(user.createdEvents, "organizador")}</View>

					<Text style={styles.sectionTitle}>Trofeos de Asistencia</Text>
					<View style={styles.badgesRow}>{renderBoxes(user.attendedEvents, "asistencia")}</View>
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

const stylesFn = (colors: ThemeColors) =>
	StyleSheet.create({
		container: { flex: 1, backgroundColor: colors.background },
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
		name: { fontSize: 24, fontWeight: "bold", color: colors.text },
		email: { fontSize: 16, color: colors.text, marginTop: 5 },
		gamification: { marginTop: 10 },
		sectionTitle: { fontSize: 18, fontWeight: "bold", color: colors.text, marginBottom: 10 },
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
			backgroundColor: colors.background,
			borderRadius: 12,
			padding: 20,
			alignItems: "center",
		},
		modalTitle: { fontSize: 20, fontWeight: "bold", color: colors.text, marginBottom: 15 },
		modalAvatarBoxColumn: {
			width: '48%',
			height: 140,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: "#eee",
			borderRadius: 12,
		},
		modalAvatarImageColumn: { width: 100, height: 100, resizeMode: "contain" },
		closeButton: { marginTop: 15, padding: 10, borderRadius: 8, alignItems: "center", width: "50%" },
		closeButtonText: { fontWeight: "bold", textAlign: "center" },
		detailModalContainer: {
			width: "80%",
			backgroundColor: colors.background,
			borderRadius: 12,
			padding: 20,
			alignItems: "center",
		},
		detailTitle: { fontSize: 22, fontWeight: "bold", color: colors.text, marginBottom: 15, textAlign: "center" },
		detailImage: { width: 150, height: 150, resizeMode: "contain", marginBottom: 15 },
		detailSubtitle: { fontSize: 16, color: colors.text, marginBottom: 15, textAlign: "center" },
		progressBarBackground: { width: "100%", height: 15, backgroundColor: "#ddd", borderRadius: 8, overflow: "hidden" },
		progressBarFill: { height: "100%", backgroundColor: "#52e4f5ff", borderRadius: 8 },
	});
