import { PostType } from "@/scripts/types";
import { FontAwesome } from "@expo/vector-icons";
import { Theme } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import {
	Animated,
	Image,
	StyleSheet,
	Text,
	useWindowDimensions,
	View
} from "react-native";
import { GestureDetector, GestureHandlerRootView, Gesture } from "react-native-gesture-handler";
import { agregarFavs, quitarFavs } from "../../api/event.route";
import { useAlertState } from "../../hooks/alert-hooks";
import { useAuth } from "../../hooks/auth-hooks";
import { useTheme } from "../../hooks/theme-hooks";
import { useLikes } from "../context-provider/LikeContext";
import CustomAlert from "../CustomAlert";

const Post = (
	{ id, titulo, descripcion, imagenes, fechaInicio, fechaFin, direccion, onSingleTap }:
		PostType & { direccion?: string, onSingleTap?: () => void }
) => {

	const { theme } = useTheme();
	const { width } = useWindowDimensions();
	const styles = stylesFn(theme, width);
	const { token } = useAuth();


	const heartAnim = useRef(new Animated.Value(0)).current;

	const { likes, toggleLike } = useLikes();
	const showHeart = likes[Number(id)] || false;

	const { visible, mensaje, success } = useAlertState();

	const handleDoubleTap = async () => {
		const nuevoLike = !showHeart; // <-- ESTE es el valor real que queda después del tap

		if (nuevoLike) {
			try {
				await agregarFavs(token, id);
				toggleLike(Number(id), true);
			} catch (error) {
				mensaje.set(`Error al intentar agregar a favoritos: ${error}`);
				success.set(false);
				visible.set(true);
			}
		} else {
			try {
				await quitarFavs(token, id);
				toggleLike(Number(id), false);
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
			handleDoubleTap();
		});


	const postDoubleTap = Gesture.Tap()
		.numberOfTaps(2)
		.runOnJS(true)
		.onEnd(() => {
			handleDoubleTap();
		});

	const postSingleTap = Gesture.Tap()
		.numberOfTaps(1)
		.maxDelay(250)
		.runOnJS(true)
		.onEnd(() => {
			onSingleTap?.();
		});

	const postTapGesture = Gesture.Exclusive(postDoubleTap, postSingleTap);

	const formatoFecha = (fecha: Date) =>
		fecha.toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });

	useEffect(() => {
		Animated.timing(heartAnim, {
			toValue: showHeart ? 1 : 0,
			duration: 0, // sin animación, solo para sincronizar
			useNativeDriver: true,
		}).start();
	}, [showHeart]);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<GestureDetector gesture={postTapGesture}>
				<Animated.View style={{ position: "relative" }}>

					<GestureDetector gesture={heartTapGesture}>
						{/* Corazón animado */}
						<Animated.View style={{ position: "absolute", top: 10, left: 10, zIndex: 20 }}>
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
						</Animated.View>
					</GestureDetector>

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

	}
	);
