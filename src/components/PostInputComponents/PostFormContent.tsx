import { eventCreate } from "@/src/api/event.route";
import { useAuth } from "@/src/hooks/auth-hooks";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { ImageSourcePropType, Pressable, Text, TextInput, View } from "react-native";
import ImageSelectorButton from "./ImageSelectorButton";
import PostMapSelector from "./PostMapSelector";


const PostFormContent = ({ theme, styles, router }: any) => {
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
	const [mostrarPickerDuracion, setMostrarPickerDuracion] = useState(false);
	// 🔹 Calculamos fechaFin automáticamente cuando cambian fechaInicio o duración
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
			alert("Por favor completa todos los campos, incluyendo la ubicación.");
			return;
		}

		const ubicacionEvento = {
			latitud: ubicacion.latitude,
			longitud: ubicacion.longitude,
			direccion: direccion
		};

		await eventCreate(
			titulo,
			descripcion,
			imagenes,
			fechaInicio,
			fechaFin,
			ubicacionEvento,
			token
		);

		// DATA.unshift({
		//   id: (DATA.length + 1).toString(),// vuela
		//   titulo,
		//   descripcion,
		//   imagenes,
		//   fechaInicio,
		//   fechaFin,
		//   ubicacion: {
		//     latitud: ubicacion.latitude,
		//     longitud: ubicacion.longitude,
		//     direccion,
		//   },
		//   creador: 'Mateo Villanueva',
		// });

		router.back();
	};

	return (
		<>
			{/* Título */}
			<View style={styles.section}>
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
				<Pressable style={styles.input} onPress={() => setMostrarPicker(true)}>
					<Text style={{ color: theme.colors.text }}>
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
				<Pressable style={styles.input} onPress={() => setMostrarHoraPicker(true)}>
					<Text style={{ color: theme.colors.text }}>
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
		</>
	);
};

export const stylesFn = (theme: any, width: number) => ({
	card: {
		backgroundColor: theme.colors.card,
		borderRadius: 12,
		padding: 16,
		gap: 12,
		shadowColor: "#000",
		shadowOpacity: 0.2,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
		elevation: 3,
	},
	section: { gap: 6 },
	input: {
		backgroundColor: theme.colors.background,
		borderColor: theme.colors.border,
		borderWidth: 1,
		borderRadius: 10,
		paddingHorizontal: 14,
		paddingVertical: 12,
		color: theme.colors.card,
		fontSize: 14,
	},
	inputMultiline: { minHeight: 110, lineHeight: 20 },
	buttonsRow: { flexDirection: "row", gap: 12, justifyContent: "flex-end", alignItems: "center", marginTop: 4 },
	primaryBtn: { backgroundColor: "#3B82F6", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
	primaryBtnText: { color: "#fff", fontWeight: "700", letterSpacing: 0.2 },
	labelText: { color: theme.colors.text, fontSize: 14 },
});

export default PostFormContent;
