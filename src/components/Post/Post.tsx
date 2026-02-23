import { distancia } from "@/scripts/functions";
import { PostType } from "@/scripts/types";
import { crearReporte } from "@/src/api/report.route";
import { useTheme } from "@/src/hooks/theme-hooks";
import { FontAwesome } from "@expo/vector-icons";
import { Theme } from "@react-navigation/native";
import * as Linking from "expo-linking";
import React, { useEffect, useRef, useState } from "react";
import {
	Animated,
	Image,
	Modal,
	Pressable,
	Share,
	StyleSheet,
	Text,
	TextInput,
	useWindowDimensions,
	View
} from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { agregarFavs, eliminarEvento, quitarFavs } from "../../api/event.route";
import { useAlertState } from "../../hooks/alert-hooks";
import { useAuth } from "../../hooks/auth-hooks";
import { useLikes } from "../context-provider/LikeContext";
import CustomAlert from "../CustomAlert";

const Post = (
	{ id,
		titulo,
		descripcion,
		imagenes,
		fechaInicio,
		fechaFin,
		direccion,
		ubicacion,
		onSingleTap,
		onDelete,
		posicionActual
	}: Omit<PostType, "likesCont"> & {
		direccion?: string,
		onSingleTap?: () => void, onDelete: (id: string) => void,
		posicionActual: { lat: number; lon: number } | null
	}
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

	const { likes, toggleLike, currentLikes } = useLikes();
	const showHeart = likes[Number(id)] || false;

	const [modalVisible, setModalVisible] = useState(false);
	const [motivoSeleccionado, setMotivoSeleccionado] = useState<string | null>(null);
	const [descripcionReport, setDescripcionReport] = useState("");

	const { visible, mensaje, success } = useAlertState();

	const handleLike = async () => {
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

	const distanciaAcotada = () => {
		if (posicionActual) {
			const distanciaSinAcotar = distancia(
				ubicacion.latitud,
				ubicacion.longitud,
				posicionActual.lat,
				posicionActual.lon
			);
			return `A ${distanciaSinAcotar.toFixed(2)} km de distancia`;
		}
	}


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
		// console.log("Post ListaLikes: ", currentLikes);
		// console.log("Post eventID: ", Number(id));
		// console.log("Post Likes: ", currentLikes[Number(id)]);
	}, [heartAnim, showHeart]);

	const handleShare = async () => {
		try {

			const url = __DEV__
				? Linking.createURL(`/post/${id}`)
				: `now://post/${id}`;

			const mensaje = `Mirá este evento: ${titulo}\n
			${descripcion}\n\nDescubrí este evento en NOW: ${url}\n
			(Expo Go no lo abre correctamente)`;

			await Share.share({
				message: mensaje,
			});
		} catch (error) {
			mensaje.set(`Error al compartir: ${error}`);
			success.set(false);
			visible.set(true);
		}
	};

	const eliminar = async () => {
		// console.log("\n\n\n###############PRINCIPIO BUTTON###############\n\n\n");
		await eliminarEvento(id, token);
		onDelete(id);
	}

	const reportar = async (motivoSeleccionado: string | null, descripcionReport: string) => {
		if (!motivoSeleccionado || !descripcionReport) {
			mensaje.set("Por favor completa todos los campos.");
			success.set(false);
			visible.set(true);
			return;
		}

		try {
			await crearReporte(
				token,
				Number(id),
				motivoSeleccionado,
				descripcionReport,
				new Date(),
				"Pendiente"
			);

		} catch (error) {
			mensaje.set(`Ocurrio un error: ${error}`);
			success.set(false);
			visible.set(true);
		}
	};



	const MOTIVOS = [
		"Contenido inapropiado",
		"Información falsa",
		"Spam",
		"Otro"
	];


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
								{currentLikes[Number(id)] ?? 0}
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
								<View>
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
										<Pressable style={styles.menuItem} onPress={handleShare}>
											<Text style={styles.menuText}>Compartir</Text>
										</Pressable>

										<Pressable style={styles.menuItem} onPress={() => setModalVisible(true)}>
											<Text style={styles.menuText}>Reportar</Text>
										</Pressable>

										<Pressable style={styles.menuItem} onPress={eliminar}>
											<Text style={[styles.menuText, { color: "red" }]}>
												Eliminar
											</Text>
										</Pressable>
										{/* ######################################################################################################### */}

									</View>

									<Modal
										visible={modalVisible}
										transparent
										animationType="fade"
										onRequestClose={() => setModalVisible(false)}
									>
										<View style={styles.overlay}>
											<View style={styles.modalContainer}>

												<Text style={styles.title}>Reportar evento</Text>

												{/* Motivos */}
												{MOTIVOS.map((motivo) => (
													<Pressable
														key={motivo}
														style={[
															styles.motivoButton,
															motivoSeleccionado === motivo && styles.motivoSeleccionado
														]}
														onPress={() => setMotivoSeleccionado(motivo)}
													>
														<Text style={styles.motivoText}>{motivo}</Text>
													</Pressable>
												))}

												{/* Descripción */}
												<TextInput
													style={styles.input}
													placeholder="Describa el problema..."
													multiline
													value={descripcionReport}
													onChangeText={setDescripcionReport}
												/>

												{/* Botones */}
												<View style={styles.buttonsRow}>
													<Pressable
														style={styles.cancelButton}
														onPress={() => setModalVisible(false)}
													>
														<Text>Cancelar</Text>
													</Pressable>

													<Pressable
														style={styles.submitButton}
														disabled={!motivoSeleccionado}
														onPress={() => {
															if (!motivoSeleccionado) return;

															reportar(motivoSeleccionado, descripcionReport);
															setModalVisible(false);
															setMotivoSeleccionado(null);
															setDescripcionReport("");
														}}
													>
														<Text style={{ color: "white" }}>Enviar</Text>
													</Pressable>
												</View>

											</View>
										</View>
									</Modal>
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

						{ubicacion && posicionActual != null && (
							<View style={styles.direccionContainer}>
								<FontAwesome style={styles.direccionIcon} size={24} name="map-marker" color="red" />
								<Text style={styles.direccionText}>
									{distanciaAcotada()}
								</Text>
							</View>
						)}

						{direccion && posicionActual == null && (
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
		title: {
			fontSize: 18,
			fontWeight: "bold",
			marginBottom: 12
		},
		input: {
			borderWidth: 1,
			borderColor: "#ccc",
			borderRadius: 8,
			padding: 10,
			height: 80,
			marginTop: 10,
			textAlignVertical: "top"
		},
		buttonsRow: {
			flexDirection: "row",
			justifyContent: "space-between",
			marginTop: 15
		},
		cancelButton: {
			padding: 10
		},
		submitButton: {
			backgroundColor: "#007bff",
			padding: 10,
			borderRadius: 8
		},
		modalContainer: {
			width: "85%",
			backgroundColor: "white",
			borderRadius: 12,
			padding: 20
		},
		motivoButton: {
			padding: 10,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: "#ccc",
			marginBottom: 8
		},
		motivoSeleccionado: {
			backgroundColor: "#007bff22",
			borderColor: "#007bff"
		},
		motivoText: {
			fontSize: 14
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
