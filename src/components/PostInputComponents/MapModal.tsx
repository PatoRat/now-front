import { Theme } from "@react-navigation/native";
import * as Location from "expo-location";
import React, { useRef, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

type Props = {
	theme: Theme;
	value?: { latitude: number; longitude: number } | null;
	direccion?: string | null;
	onSelect: (coord: { latitude: number; longitude: number }, direccion: string) => void;
	onClose: () => void;
};

const MapModal = ({ theme, value, direccion, onSelect, onClose }: Props) => {
	const [inputDireccion, setInputDireccion] = useState(direccion || "");
	const mapRef = useRef<MapView | null>(null);

	const seleccionarUbicacion = async (coord: { latitude: number; longitude: number }) => {
		try {
			mapRef.current?.animateToRegion(
				{
					latitude: coord.latitude,
					longitude: coord.longitude,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01,
				},
				800
			);
		} catch { }

		try {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				alert("Se necesitan permisos de ubicación");
				return;
			}

			const [dir] = await Location.reverseGeocodeAsync(coord);
			const direccionFormateada = `${dir.street || ""} ${dir.name || ""}, ${dir.city || ""}`.trim();
			onSelect(coord, direccionFormateada || "Dirección no disponible");
			setInputDireccion(direccionFormateada);
		} catch (e) {
			console.error("Error al obtener dirección:", e);
			onSelect(coord, "Dirección no disponible");
			setInputDireccion("Dirección no disponible");
		}
	};

	return (
		<Modal animationType="slide" transparent={false}>
			<View style={{ flex: 1 }}>
				{/* Buscador */}
				<View style={{
					position: "absolute", top: 40, left: 10, right: 10,
					backgroundColor: theme.colors.card, borderRadius: 10,
					padding: 8, elevation: 4, zIndex: 1, flexDirection: "row", alignItems: "center"
				}}>
					<TextInput
						style={{ flex: 1, backgroundColor: theme.colors.background, color: theme.colors.text, paddingHorizontal: 10, borderRadius: 8 }}
						placeholder="Buscar dirección..."
						placeholderTextColor="#aaa"
						value={inputDireccion}
						onChangeText={setInputDireccion}
					/>

					<Pressable
						style={{ marginLeft: 8, backgroundColor: "#3B82F6", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}
						onPress={async () => {
							if (!inputDireccion) return alert("Ingresá una dirección para buscar.");
							try {
								const resultados = await Location.geocodeAsync(inputDireccion);
								if (resultados.length > 0) {
									seleccionarUbicacion({ latitude: resultados[0].latitude, longitude: resultados[0].longitude });
								} else {
									alert("No se encontró esa dirección.");
								}
							} catch (err) {
								console.error(err);
								alert("Error al buscar la dirección.");
							}
						}}
					>
						<Text style={{ color: "white", fontWeight: "bold" }}>Buscar</Text>
					</Pressable>
				</View>

				{/* Mapa */}
				<MapView
					ref={mapRef}
					style={{ flex: 1 }}
					initialRegion={{
						latitude: value?.latitude || -34.6037,
						longitude: value?.longitude || -58.3816,
						latitudeDelta: 0.01,
						longitudeDelta: 0.01,
					}}
					onPress={(e) => seleccionarUbicacion(e.nativeEvent.coordinate)}
				>
					{value && <Marker coordinate={value} />}
				</MapView>

				{/* Pie modal */}
				<View style={{ backgroundColor: theme.colors.card, padding: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
					<Text style={{ color: theme.colors.text, marginBottom: 8 }}>
						{inputDireccion ? `📍 ${inputDireccion}` : value ? "Obteniendo dirección..." : "Toca el mapa para seleccionar una ubicación"}
					</Text>

					<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
						<Pressable
							style={{ backgroundColor: "#999", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, flex: 1, marginRight: 8 }}
							onPress={onClose}
						>
							<Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>Cancelar</Text>
						</Pressable>

						<Pressable
							style={{ backgroundColor: "#3B82F6", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, flex: 1 }}
							onPress={onClose}
						>
							<Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>Confirmar</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</Modal>
	);
};

export default MapModal;
