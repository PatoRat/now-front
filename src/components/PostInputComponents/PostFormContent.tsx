import { eventCreate, guardarImagenes } from "@/src/api/event.route";
import { useAlertState } from "@/src/hooks/alert-hooks";
import { useAuth } from "@/src/hooks/auth-hooks";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Theme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import CustomAlert from "../CustomAlert";
import ImageSelectorButton from "./ImageSelectorButton";
import PostMapSelector from "./PostMapSelector";


const PostFormContent = ({ theme, router }: any) => {
	const [titulo, setTitulo] = useState("");
	const [descripcion, setDescripcion] = useState("");
	const [fechaInicio, setFechaInicio] = useState(new Date());
	const [fechaFin, setFechaFin] = useState<Date | null>(null);
	const { token } = useAuth();
	const [duracion, setDuracion] = useState("");
	const [mostrarHoraPicker, setMostrarHoraPicker] = useState(false);
	const [mostrarPicker, setMostrarPicker] = useState(false);
	const [ubicacion, setUbicacion] = useState<{ latitude: number; longitude: number } | null>(null);
	const [direccion, setDireccion] = useState<string | null>(null);
	const [imagenes, setImagenes] = useState<ImageSourcePropType[]>([]);
	const styles = stylesFn(theme);
	//ALERTS
	const { visible, mensaje, success } = useAlertState();


	useEffect(() => {
		if (fechaInicio && duracion) {
			const fin = new Date(fechaInicio);
			fin.setHours(fin.getHours() + parseInt(duracion));
			setFechaFin(fin);
		} else {
			setFechaFin(null);
		}
	}, [duracion, fechaInicio]);

	// 🔹 Función para publicar
	const publicarPosteo = async () => {
		if (!fechaInicio || !fechaFin || !ubicacion || !direccion) {
			mensaje.set("Por favor completa todos los campos, incluyendo la ubicación.");
			success.set(false);
			visible.set(true);
			return;
		}

		const ubicacionEvento = {
			latitud: ubicacion.latitude,
			longitud: ubicacion.longitude,
			direccion: direccion
		};

		try {
			const eventId = await eventCreate(
				titulo,
				descripcion,
				fechaInicio,
				fechaFin,
				ubicacionEvento,
				token
			);

			if (imagenes.length > 0) {
				await guardarImagenes(imagenes, eventId, token);
			}
			// mensaje.set("Publicacion exitosa");
			// success.set(true);
			// visible.set(true);

			router.back();

		} catch (error) {
			mensaje.set(`Ocurrio un error: ${error}`);
			success.set(false);
			visible.set(true);
		}
	};

	return (
		<>
			<ScrollView
				contentContainerStyle={{ paddingVertical: 40 }}
				keyboardShouldPersistTaps="handled"
			>
				{/* Título */}
				<View style={styles.section}>
					<Text style={styles.labelText}>Título</Text>
					<TextInput
						style={[styles.input, { color: theme.colors.text }]}
						placeholder="Título"
						placeholderTextColor="#8a8a8a"
						onChangeText={setTitulo}
						value={titulo}
					/>
				</View>

				{/* Descripción */}
				<View style={styles.section}>
					<Text style={styles.labelText}>Descripción</Text>
					<TextInput
						style={[styles.input, styles.inputMultiline, { color: theme.colors.text }]}
						placeholder="Descripción"
						placeholderTextColor="#8a8a8a"
						multiline
						onChangeText={setDescripcion}
						value={descripcion}
						textAlignVertical="top"
					/>
				</View>

				{/* Fecha de inicio */}
				<View style={styles.section}>
					<Text style={styles.labelText}>Fecha de inicio</Text>
					<Pressable style={styles.input} onPress={() => setMostrarPicker(true)}>
						<Text style={{ color: "#8a8a8a" }}>
							{fechaInicio
								? fechaInicio.toLocaleDateString("es-AR")
								: "Seleccionar fecha de inicio"}
						</Text>
					</Pressable>

					{mostrarPicker && (
						<DateTimePicker
							value={fechaInicio}
							mode="date"
							display="calendar"
							onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
								setMostrarPicker(false); // cerramos siempre
								if (event.type === "set" && selectedDate) {
									const nuevaFecha = new Date(fechaInicio);
									nuevaFecha.setFullYear(selectedDate.getFullYear());
									nuevaFecha.setMonth(selectedDate.getMonth());
									nuevaFecha.setDate(selectedDate.getDate());
									setFechaInicio(nuevaFecha);
								}
							}}
						/>
					)}
				</View>

				{/* Hora de inicio */}
				<View style={styles.section}>
					<Text style={styles.labelText}>Hora de inicio</Text>
					<Pressable style={styles.input} onPress={() => setMostrarHoraPicker(true)}>
						<Text style={{ color: "#8a8a8a" }}>
							{fechaInicio
								? fechaInicio.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
								: "Seleccionar hora de inicio"}
						</Text>
					</Pressable>

					{mostrarHoraPicker && (
						<DateTimePicker
							value={fechaInicio}
							mode="time"
							is24Hour={true}
							display="spinner"
							onChange={(event: DateTimePickerEvent, selectedTime?: Date) => {
								setMostrarHoraPicker(false); // cerramos siempre
								if (event.type === "set" && selectedTime) {
									const nuevaFecha = new Date(fechaInicio);
									nuevaFecha.setHours(selectedTime.getHours());
									nuevaFecha.setMinutes(selectedTime.getMinutes());
									nuevaFecha.setSeconds(selectedTime.getSeconds());
									setFechaInicio(nuevaFecha);
								}
							}}
						/>
					)}

				</View>
				{/* Duración */}
				<View style={styles.section}>
					<Text style={styles.labelText}>Duración (horas)</Text>
					<TextInput
						style={styles.input}
						placeholder="Ingrese la duración en horas"
						placeholderTextColor="#aaa"
						keyboardType="numeric"
						value={duracion}
						onChangeText={setDuracion}
					/>
				</View>

				{/* Ubicación */}
				<View style={styles.section}>
					<Text style={styles.labelText}>Ubicación</Text>
					<PostMapSelector
						value={ubicacion}
						direccion={direccion}
						onChange={(coord, dir) => {
							setUbicacion(coord);
							setDireccion(dir);
						}}
					/>
				</View>

				{/* Selección de imágenes */}
				<View style={styles.section}>
					<Text style={styles.labelText}>Imágenes</Text>
					<ImageSelectorButton onSelect={setImagenes} />
				</View>

				{/* Botón publicar */}
				<View style={styles.buttonsRow}>
					<Pressable style={styles.primaryBtn} onPress={publicarPosteo}>
						<Text style={styles.primaryBtnText}>Publicar</Text>
					</Pressable>
				</View>


			</ScrollView>
			{/* Alert */}
			<CustomAlert
				visible={visible.get()}
				message={mensaje.get()}
				isSuccessful={success.get()}
				onClose={() => visible.set(false)}
			/>

		</>
	);
};

const stylesFn = (theme: Theme) =>
	StyleSheet.create({
		// Contenedor de la tarjeta principal
		card: {
			backgroundColor: theme.colors.card,
			borderRadius: 12,
			top: 100,
			padding: 12, // reducido
			gap: 8,      // reducido
			shadowColor: "#000",
			shadowOpacity: 0.2,
			shadowRadius: 4,
			shadowOffset: { width: 0, height: 2 },
			elevation: 3,
		},

		// Secciones internas
		section: {
			gap: 3,          // reducido
		},

		// Inputs generales
		input: {
			backgroundColor: theme.colors.background,
			borderColor: theme.colors.border,
			borderWidth: 1,
			borderRadius: 8,      // un poco más compacto
			paddingHorizontal: 10,
			paddingVertical: 8,
			color: "#8a8a8a",
			fontSize: 14,
			minHeight: 40, // reducido
		},
		inputMultiline: {
			minHeight: 100, // reducido
			lineHeight: 18,
			textAlignVertical: "top",
			color: "#8a8a8a",
		},

		// Labels
		labelText: {
			color: theme.colors.text,
			fontSize: 14,
			left: '2%',
			fontWeight: "500",
		},

		// Botones
		buttonsRow: {
			flexDirection: "row",
			gap: 8,        // reducido
			justifyContent: "center",
			alignItems: "center",
			marginTop: 4,
		},
		primaryBtn: {
			backgroundColor: "#3B82F6",
			borderRadius: 10, // reducido
			paddingHorizontal: 12,
			paddingVertical: 8, // reducido
			alignItems: "center",
			justifyContent: "center",
		},
		primaryBtnText: {
			color: "#fff",
			fontWeight: "700",
			letterSpacing: 0.2,
			fontSize: 14,
		},

		// Pressables interactivos (fecha, hora, ubicación)
		pressableInput: {
			backgroundColor: theme.colors.background,
			borderColor: theme.colors.border,
			borderWidth: 1,
			borderRadius: 8,
			paddingHorizontal: 10,
			paddingVertical: 8,
			justifyContent: "center",
		},
		pressableText: {
			color: "#3B82F6",
			fontSize: 14,
		},

		// Contenedor de imágenes
		imageContainer: {
			flexDirection: "row",
			flexWrap: "wrap",
			gap: 6, // reducido
		},

		// Map selector
		mapContainer: {
			height: 180, // un poco más compacto
			borderRadius: 8,
			overflow: "hidden",
			borderWidth: 1,
			borderColor: theme.colors.border,
		},

		// Placeholder (inputs vacíos)
		placeholderText: {
			color: "#8a8a8a",
		},
	});



export default PostFormContent;
