import { PostType } from "@/scripts/types";
import { useTheme } from "@/src/hooks/theme-hooks";
import { FontAwesome } from "@expo/vector-icons";
import { Theme } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
	Animated,
	Image,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	useWindowDimensions,
	View
} from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { agregarFavs, quitarFavs } from "../../api/event.route";
import { useAlertState } from "../../hooks/alert-hooks";
import { useAuth } from "../../hooks/auth-hooks";
import { useLikes } from "../context-provider/LikeContext";
import CustomAlert from "../CustomAlert";

const Post = (
	{ id, titulo, descripcion, imagenes, fechaInicio, fechaFin, direccion, onSingleTap, likesCont }:
		PostType & { direccion?: string, onSingleTap?: () => void, likesCont: number }
) => {

	const { theme } = useTheme();
	const { width } = useWindowDimensions();
	const styles = stylesFn(theme, width);
	const { token } = useAuth();

	const menuButtonRef = useRef<View>(null);

	const [menuPosition, setMenuPosition] = useState<{
		x: number;
		y: number;
		width: number;
		height: number;
	} | null>(null);

	const heartAnim = useRef(new Animated.Value(0)).current;

	const { likes, toggleLike } = useLikes();
	const showHeart = likes[Number(id)] || false;

	const [currentLikes, setCurrentLikes] = useState(likesCont);

	const { visible, mensaje, success } = useAlertState();

	const handleLike = async () => {
		const nuevoLike = !showHeart; // <-- ESTE es el valor real que queda después del tap

		if (nuevoLike) {
			try {
				await agregarFavs(token, id);
				toggleLike(Number(id), true);
				setCurrentLikes(prev => prev + 1);
			} catch (error) {
				mensaje.set(`Error al intentar agregar a favoritos: ${error}`);
				success.set(false);
				visible.set(true);
			}
		} else {
			try {
				await quitarFavs(token, id);
				toggleLike(Number(id), false);
				setCurrentLikes(prev => prev - 1);
			} catch (error) {
				mensaje.set(`Error al intentar eliminar de favoritos: ${error}`);
				success.set(false);
				visible.set(true);
			}
		}

		// Usar el valor correcto para la animación
		Animated.timing(heartAnim, {
			toValue: nuevoLike ? 1 : 0,
			duration: 200,
			useNativeDriver: true,
		}).start();
	};


	const heartTapGesture = Gesture.Tap()
		.numberOfTaps(1)
		.runOnJS(true)
		.onEnd(() => {
			handleLike();
		});

	const [menuVisible, setMenuVisible] = useState(false);

	const postDoubleTap = Gesture.Tap()
		.numberOfTaps(2)
		.runOnJS(true)
		.onEnd(() => {
			handleLike();
		});

	const postSingleTap = Gesture.Tap()
		.numberOfTaps(1)
		.maxDelay(250)
		.runOnJS(true)
		.onEnd(() => {
			onSingleTap?.();
		});


	const openMenu = () => {
		menuButtonRef.current?.measureInWindow((x, y, width, height) => {
			setMenuPosition({ x, y, width, height });
			setMenuVisible(true);
		});
	};

	const menuTapGesture = Gesture.Tap()
		.runOnJS(true)
		.onEnd(() => {
			openMenu();
		});



	const postLongPress = Gesture.LongPress()
		.minDuration(500) // medio segundo, estándar UX
		.runOnJS(true)
		.onStart(() => {
			openMenu();
		});


	const postGesture = Gesture.Exclusive(
		postLongPress,
		Gesture.Exclusive(postDoubleTap, postSingleTap)
	);


	const formatoFecha = (fecha: Date) =>
		fecha.toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });

	useEffect(() => {
		Animated.timing(heartAnim, {
			toValue: showHeart ? 1 : 0,
			duration: 0, // sin animación, solo para sincronizar
			useNativeDriver: true,
		}).start();
	}, [heartAnim, showHeart]);


	useEffect(() => {
		setCurrentLikes(likesCont);
	}, [likesCont]);

	// ######################### COMPONENTES ##############################################################




	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<GestureDetector gesture={postGesture}>
				<Animated.View style={{ position: "relative" }}>

					<GestureDetector gesture={heartTapGesture}>
						{/* Corazón animado */}
						<Animated.View style={{
							position: "absolute",
							top: 10,
							left: 10,
							zIndex: 20,
							flexDirection: "row",
							alignItems: "center"
						}}>
							{/* Corazón que siempre se ve: vacío si no likeado, rojo si likeado */}
							<FontAwesome
								name={showHeart ? "heart" : "heart-o"}
								size={32}
								color={showHeart ? "red" : theme.colors.text}
							/>

							{/* Corazón animado solo al hacer doble tap */}
							<Animated.View
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									transform: [{ scale: heartAnim }],
								}}
							>
								<FontAwesome name="heart" size={32} color="red" />
							</Animated.View>

							{/* Cantidad de Likes */}
							<Text
								style={styles.textoLike}
							>
								{currentLikes}
							</Text>
						</Animated.View>
					</GestureDetector>


					{/* Opciones */}

					<GestureDetector gesture={menuTapGesture}>
						<View
							ref={menuButtonRef}
							style={{
								position: "absolute",
								top: 10,
								right: 10,
								zIndex: 30,
								padding: 8,
							}}
						>
							<FontAwesome name="ellipsis-v" size={32} color="#888" />
						</View>
					</GestureDetector>

					<Modal
						transparent
						visible={menuVisible}
						animationType="fade"
						onRequestClose={() => setMenuVisible(false)}
					>
						<Pressable
							style={StyleSheet.absoluteFill}
							onPress={() => setMenuVisible(false)}
						>
							{menuPosition && (
								<View
									style={[
										styles.menuContainer,
										{
											position: "absolute",
											top: menuPosition.y + menuPosition.height + 6,
											left: menuPosition.x - 140 + menuPosition.width,
										},
									]}
								>
									{/* ######################################################################################################### */}
									<Pressable style={styles.menuItem}>
										<Text style={styles.menuText}>Compartir</Text>
									</Pressable>

									<Pressable style={styles.menuItem}>
										<Text style={styles.menuText}>Reportar</Text>
									</Pressable>

									<Pressable style={styles.menuItem}>
										<Text style={[styles.menuText, { color: "red" }]}>
											Eliminar
										</Text>
									</Pressable>
									{/* ######################################################################################################### */}

								</View>
							)}
						</Pressable>
					</Modal>

					{/* Contenido del Post */}



					<View style={styles.postContainer}>

						<Text style={styles.titulo}>{titulo}</Text>

						{imagenes?.length > 0 && (
							<View style={styles.imagenContainer}>
								<Image source={imagenes[0]} style={styles.imagen} resizeMode="cover" />
								{imagenes.length > 1 && (
									<View style={styles.overlay}>
										<Text style={styles.overlayText}>+{imagenes.length - 1}</Text>
									</View>
								)}
							</View>
						)}

						{!!descripcion && <Text style={styles.descripcion}>{descripcion}</Text>}

						{direccion && (
							<View style={styles.direccionContainer}>
								<FontAwesome style={styles.direccionIcon} size={24} name="map-marker" color="red" />
								<Text style={styles.direccionText}>{direccion}</Text>
							</View>
						)}

						<View style={styles.fechasContainer}>
							<Text style={styles.fechaText}>Inicio: {formatoFecha(fechaInicio)}</Text>
							<Text style={styles.fechaText}>Fin: {formatoFecha(fechaFin)}</Text>
						</View>

					</View>
					{/* Alert */}
					<CustomAlert
						visible={visible.get()}
						message={mensaje.get()}
						isSuccessful={success.get()}
						onClose={() => visible.set(false)}
					/>
				</Animated.View>
			</GestureDetector >
		</GestureHandlerRootView >
	);
};

export default Post;



const stylesFn = (theme: Theme, width: number) =>
	StyleSheet.create({
		postContainer: {
			backgroundColor: theme.colors.card,
			borderRadius: 12,
			padding: 16,
			marginVertical: 8,
			width: Math.round(width * 0.9),
			alignSelf: "center",
			shadowColor: "#000",
			shadowOpacity: theme.dark ? 0.2 : 0.08,
			shadowRadius: 6,
			shadowOffset: { width: 0, height: 4 },
			elevation: 3,
		},
		textoLike: {
			marginLeft: 6,
			fontSize: 16,
			fontWeight: "600",
			color: theme.colors.text,
		},
		titulo: {
			fontSize: 18,
			fontFamily: theme.fonts.bold.fontFamily,
			fontWeight: theme.fonts.bold.fontWeight,
			color: theme.colors.text,
			marginBottom: 12,
			textAlign: "center",
		},
		imagenContainer: {
			width: "100%",
			aspectRatio: 1.5,
			borderRadius: 12,
			overflow: "hidden",
			marginBottom: 12,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: theme.colors.border,
		},
		imagen: {
			width: "100%",
			height: "100%",
		},
		menuButton: {
			padding: 8,
		},
		headerRow: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
		},
		menuOverlay: {
			...StyleSheet.absoluteFillObject,
			backgroundColor: "rgba(0,0,0,0.2)",
			justifyContent: "flex-start",
			alignItems: "flex-end",
			paddingTop: 40,
			paddingRight: 12,
		},
		menuContainer: {
			position: "absolute",
			top: 40,
			right: 10,
			backgroundColor: theme.colors.border,
			borderRadius: 8,
			paddingVertical: 6,
			minWidth: 150,
			elevation: 5,
			shadowColor: "#000",
			shadowOpacity: 0.2,
			shadowRadius: 10,
		},
		menuItem: {
			paddingVertical: 10,
			paddingHorizontal: 16,
		},
		menuText: {
			fontSize: 14,
			color: theme.colors.text,
		},
		overlay: {
			position: "absolute",
			top: 8,
			right: 8,
			backgroundColor: "rgba(0,0,0,0.55)",
			paddingHorizontal: 6,
			paddingVertical: 2,
			borderRadius: 12,
		},
		overlayText: {
			color: "#fff",
			fontWeight: theme.fonts.bold.fontWeight,
			fontSize: 14,
		},
		fechasContainer: {
			flexDirection: "row",
			justifyContent: "space-between",
			backgroundColor: theme.colors.border,
			borderRadius: 8,
			padding: 8,
			marginBottom: 12,
		},
		fechaText: {
			fontSize: 12,
			color: theme.colors.text,
			fontWeight: "500",
		},
		descripcion: {
			fontSize: 14,
			color: theme.colors.text,
		},
		direccion: {
			color: theme.colors.text,
			fontSize: 14,
			marginTop: 4,
		},
		direccionContainer: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: theme.colors.border,
			paddingHorizontal: 10,
			paddingVertical: 6,
			borderRadius: 8,
			marginBottom: 12,
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
