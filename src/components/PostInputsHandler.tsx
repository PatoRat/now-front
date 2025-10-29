import DATA from "@/assets/databases/data";
import { useContextApp } from "@/src/components/context-provider/Theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Theme } from "@react-navigation/native";
import * as Location from 'expo-location';
import { Router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ImageSourcePropType,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";
import MapView, { Marker } from 'react-native-maps';
import ImageSelectorButton from "./ImageSelectorButton";

const PostInputsHandler = (props: { router: Router }) => {
    const [titulo, setTitulo] = useState("");
    const { theme } = useContextApp();
    const { width } = useWindowDimensions();
    const styles = stylesFn(theme, width);
    const [descripcion, setDescripcion] = useState("");
    const [imagenes, setImagenes] = useState<ImageSourcePropType[]>([]);
    const [mostrarHoraPicker, setMostrarHoraPicker] = useState(false);
    const [fechaInicio, setFechaInicio] = useState<Date>(new Date());
    const [duracion, setDuracion] = useState("");
    const [fechaFin, setFechaFin] = useState<Date | null>(null);
    const [mostrarPickerDuracion, setMostrarPickerDuracion] = useState(false);
    const [mostrarPicker, setMostrarPicker] = useState(false);
    const [ubicacion, setUbicacion] = useState<{ latitude: number; longitude: number } | null>(null);
    const [mostrarMapa, setMostrarMapa] = useState(false);
    const [direccion, setDireccion] = useState<string | null>(null);
  /// Cuando el usuario selecciona en el mapa:
    const seleccionarUbicacion = async (coord: { latitude: number; longitude: number }) => {
        setUbicacion(coord);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return alert("Se necesitan permisos de ubicación");

            const [dir] = await Location.reverseGeocodeAsync(coord);

            // Formateamos solo calle, número y ciudad
            const direccionFormateada = `${dir.street || ""} ${dir.name || ""}, ${dir.city || ""}`.trim();
            setDireccion(direccionFormateada || "Dirección no disponible");
        } catch (e) {
            console.error("Error al obtener dirección:", e);
            setDireccion("Dirección no disponible");
        }
    };


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


    const publicarPosteo = () => {
        if (!fechaInicio || !fechaFin || !ubicacion || !direccion) {
            alert("Por favor completa todos los campos, incluyendo la ubicación.");
            return;
        }

        DATA.unshift({
            id: (DATA.length + 1).toString(),
            titulo,
            descripcion,
            imagenes,
            fechaInicio,
            fechaFin,
            ubicacion: {
            latitude: ubicacion.latitude,
            longitude: ubicacion.longitude,
            direccion: direccion,
            },
        });

    props.router.back();


  };

  return (
    <View style={styles.card}>
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
                <Text style={{ color: theme.colors.text}}>
                    {fechaInicio
                    ? fechaInicio.toLocaleString("es-AR", {
                        dateStyle: "short",
                        })
                    : "Seleccionar fecha de inicio"}
                </Text>
                </Pressable>

                {mostrarPicker && (
                    <DateTimePicker
                        value={fechaInicio ?? new Date()}
                        mode="date"
                        display="calendar"
                        onChange={(event, selectedDate) => {
                            setMostrarPicker(false);
                            if (selectedDate) {
                            setFechaInicio(selectedDate);
                            // si querés calcular fechaFin automáticamente:
                            const fechaFinCalculada = new Date(selectedDate);
                            fechaFinCalculada.setDate(fechaFinCalculada.getDate());
                            setFechaFin(fechaFinCalculada);
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
                        ? fechaInicio.toLocaleTimeString("es-AR", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                        : "Seleccionar hora de inicio"}
                    </Text>
                </Pressable>

                {mostrarHoraPicker && (
                    <DateTimePicker
                    value={fechaInicio ?? new Date()}
                    mode="time"
                    is24Hour={true}
                    display="spinner"
                    onChange={(event, selectedTime) => {
                        setMostrarHoraPicker(false);
                        if (selectedTime) {
                        // actualizamos la hora sin cambiar la fecha
                        const nuevaFecha = new Date(fechaInicio);
                        nuevaFecha.setHours(selectedTime.getHours());
                        nuevaFecha.setMinutes(selectedTime.getMinutes());
                        setFechaInicio(nuevaFecha);
                        }
                    }}
                    />
                )}
            </View>

        {/* Duración (en horas) */}
            <View style={styles.section}>
                <Text style={{ color: theme.colors.text, marginBottom: 4 }}>
                    Seleccionar duración
                </Text>

                <View
                    style={{
                    backgroundColor: theme.colors.background, // fondo según el tema
                    borderRadius: 10,
                    overflow: "hidden", // para que las ruedas no se corten
                    }}
                >
                    <Picker
                    mode="dropdown" // en lugar de 'dialog'
                    selectedValue={duracion}
                    onValueChange={(value) => setDuracion(value.toString())}
                    style={{ color: theme.colors.text, backgroundColor : theme.colors.background }}
                    dropdownIconColor={theme.colors.text} // para Android
                    >
                    {[...Array(73).keys()].map((hora) => (
                        <Picker.Item
                        key={hora}
                        label={`${hora} h`}
                        value={hora}
                        color={theme.colors.text}
                        />
                    ))}
                    </Picker>
                </View>
            </View>




        {/* Mostrar fecha fin calculada */}
            {fechaFin && (
                <View style={styles.section}>
                <Text style={styles.labelText}>
                    Fecha fin:{" "}
                    <Text style={{ color: "#3B82F6", fontWeight: "bold" }}>
                    {fechaFin.toLocaleString("es-AR", {
                        dateStyle: "short",
                        timeStyle: "short",
                    })}
                    </Text>
                </Text>
                </View>
            )}\

        {/* Ubicación */}
            <View style={styles.section}>
            <Pressable
                style={styles.input}
                onPress={() => setMostrarMapa(true)}
            >
                <Text style={{ color: theme.colors.text }}>
                    {ubicacion
                        ? `Ubicación seleccionada: ${direccion}`
                        : 'Seleccionar ubicación'}
                </Text>
            </Pressable>
            </View>
            {mostrarMapa && (
                <Modal animationType="slide" transparent={false}>
                    <View style={{ flex: 1 }}>
                    <MapView
                        style={{ flex: 1 }}
                        initialRegion={{
                        latitude: ubicacion?.latitude || -34.6037,
                        longitude: ubicacion?.longitude || -58.3816,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                        }}
                        onPress={(e) => seleccionarUbicacion(e.nativeEvent.coordinate)}
                    >
                        {ubicacion && <Marker coordinate={ubicacion} />}
                    </MapView>

                    {/* Contenedor inferior para mostrar dirección y botones */}
                    <View
                        style={{
                        backgroundColor: theme.colors.card,
                        padding: 16,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        }}
                    >
                        <Text style={{ color: theme.colors.text, marginBottom: 8 }}>
                        {direccion
                            ? `📍 ${direccion}`
                            : ubicacion
                            ? "Obteniendo dirección..."
                            : "Toca el mapa para seleccionar una ubicación"}
                        </Text>

                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Pressable
                            style={[
                            styles.primaryBtn,
                            { backgroundColor: "#999", flex: 1, marginRight: 8 },
                            ]}
                            onPress={() => setMostrarMapa(false)}
                        >
                            <Text style={styles.primaryBtnText}>Cancelar</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.primaryBtn, { flex: 1 }]}
                            onPress={() => {
                            if (!ubicacion) {
                                alert("Seleccioná una ubicación antes de confirmar.");
                                return;
                            }
                            setMostrarMapa(false);
                            }}
                        >
                            <Text style={styles.primaryBtnText}>Confirmar</Text>
                        </Pressable>
                        </View>
                    </View>
                    </View>
                </Modal>
            )}



        {/* Botones */}
            <View style={styles.buttonsRow}>
                <ImageSelectorButton onSelect={setImagenes} />

                <Pressable
                onPress={publicarPosteo}
                style={({ pressed }) => [
                    styles.primaryBtn,
                    pressed && styles.primaryBtnPressed,
                ]}
                android_ripple={{ color: "rgba(255,255,255,0.08)" }}
                >
                <Text style={styles.primaryBtnText}>Publicar</Text>
                </Pressable>
            </View>

        {imagenes.length > 0 && (
            <Text style={styles.helperText}>
            {imagenes.length} imagen(es) seleccionada(s)
            </Text>
        )}
    </View>
  );
};

export default PostInputsHandler;

const stylesFn = (
    theme: Theme,
    width: number
) => StyleSheet.create({
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
  section: {
    gap: 6,
  },
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
  inputMultiline: {
    minHeight: 110,
    lineHeight: 20,
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
  },
  primaryBtn: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  primaryBtnPressed: {
    opacity: 0.9,
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  helperText: {
    color: "#aaa",
    fontSize: 12,
    marginTop: -4,
    alignSelf: "flex-end",
  },
  labelText: {
    color: theme.colors.text,
    fontSize: 14,
  },
});
