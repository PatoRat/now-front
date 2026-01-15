import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    useWindowDimensions,
} from "react-native";
import { useTheme } from "@/src/hooks/theme-hooks";
import { Theme } from "@react-navigation/native";

export default function FilterContent() {
    const { theme } = useTheme();
    const { width } = useWindowDimensions();
    const styles = stylesFn(theme, width);
    const [fechaInicio, setFechaInicio] = useState(new Date());
    const [fechaFin, setFechaFin] = useState<Date | null>(null);
    const [mostrarPicker, setMostrarPicker] = useState(false);

    const [pickerVisible, setPickerVisible] = useState<"inicio" | "fin" | null>(null);


    return (
        <View style={styles.container}>

            {/* ===== DISTANCIA ===== */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Distancia (km)</Text>

                <View style={styles.row}>
                    <TextInput
                        placeholder="Mín"
                        keyboardType="numeric"
                        placeholderTextColor="#999"
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Máx"
                        keyboardType="numeric"
                        placeholderTextColor="#999"
                        style={styles.input}
                    />
                </View>
            </View>


            {/* ===== FECHAS ===== */}
            {/* ===== FECHAS ===== */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Fecha</Text>

                <View style={styles.dateRow}>
                    <Text style={styles.dateLabel}>Del</Text>

                    <Pressable
                        style={styles.dateInputInline}
                        onPress={() => setPickerVisible("inicio")}
                    >
                        <MaterialIcons
                            name="event"
                            size={18}
                            color={theme.colors.text}
                        />
                        <Text style={styles.dateText}>
                            {fechaInicio
                                ? fechaInicio.toLocaleDateString("es-AR")
                                : "Fecha inicio"}
                        </Text>
                    </Pressable>

                    <Text style={styles.dateLabel}>al</Text>

                    <Pressable
                        style={styles.dateInputInline}
                        onPress={() => setPickerVisible("fin")}
                    >
                        <MaterialIcons
                            name="event"
                            size={18}
                            color={theme.colors.text}
                        />
                        <Text style={styles.dateText}>
                            {fechaFin
                                ? fechaFin.toLocaleDateString("es-AR")
                                : "Fecha fin"}
                        </Text>
                    </Pressable>
                </View>

                {pickerVisible && (
                    <DateTimePicker
                        value={
                            pickerVisible === "inicio"
                                ? fechaInicio ?? new Date()
                                : fechaFin ?? new Date()
                        }
                        mode="date"
                        display="calendar"
                        onChange={(event, selectedDate) => {
                            if (event.type === "set" && selectedDate) {
                                if (pickerVisible === "inicio") {
                                    setFechaInicio(selectedDate);
                                } else {
                                    setFechaFin(selectedDate);
                                }
                            }
                            setPickerVisible(null);
                        }}
                    />
                )}
            </View>






            {/* ===== LUGAR ===== */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Lugar</Text>

                <TextInput
                    placeholder="Ciudad, barrio o dirección"
                    placeholderTextColor="#999"
                    style={styles.inputFull}
                />
            </View>


            {/* ===== ACCIONES ===== */}
            <View style={styles.actions}>
                <Pressable style={styles.clearButton}>
                    <Text style={styles.clearText}>Limpiar</Text>
                </Pressable>

                <Pressable style={styles.applyButton}>
                    <Text style={styles.applyText}>Aplicar filtros</Text>
                </Pressable>
            </View>


        </View>
    );
}

const stylesFn = (theme: Theme, width: number) => {

    return StyleSheet.create({
        container: {
            padding: 16,
            gap: 20,
        },

        section: {
            gap: 8,
        },

        sectionTitle: {
            fontSize: 16,
            color: theme.colors.text,
            fontWeight: "600",
        },

        row: {
            flexDirection: "row",
            gap: 12,
        },

        input: {
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
        },

        inputFull: {
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
        },

        dateInput: {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 12,
        },

        dateText: {
            fontSize: 14,
            color: "#8a8a8a",
        },

        actions: {
            marginTop: 30,
            flexDirection: "row",
            justifyContent: "space-between",
        },

        clearButton: {
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#d0d0d0", // gris claro
            backgroundColor: "transparent",
        },

        clearText: {
            color: "#888",
        },
        
        dateInputInline: {
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#ddd",
            backgroundColor: "#f8f8f8",
        },

        applyButton: {
            backgroundColor: "#52E4F5",
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 12,
        },

        applyText: {
            fontWeight: "600",
        },

        dateRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginTop: 8,
        },

        inlineLabel: {
            fontSize: 14,
            color: "#8a8a8a",
        },

        dateButtonInline: {
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
        },

        dateLabel: {
            fontSize: 14,
            color: "#666",
        },
        dateButton: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            padding: 12,
        },
    });
}
