import { useTheme } from "@/src/hooks/theme-hooks";
import React, { useState } from "react";
import { Pressable, Text, StyleSheet, useWindowDimensions } from "react-native";
import MapModal from "./MapModal";

type Props = {
  value?: { latitude: number; longitude: number } | null;
  direccion?: string | null;
  onChange: (coord: { latitude: number; longitude: number }, direccion: string) => void;
};

const PostMapSelector = ({ value, direccion, onChange }: Props) => {
  const { theme } = useTheme();
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const { width } = useWindowDimensions();

  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.outlinedBtn,
          pressed && styles.outlinedBtnPressed
        ]}
        onPress={() => setMostrarMapa(true)}
      >
        <Text style={styles.outlinedBtnText}>
          {value ? `Ubicación seleccionada: ${direccion}` : "Seleccionar ubicación"}
        </Text>
      </Pressable>

      {mostrarMapa && (
        <MapModal
          theme={theme}
          value={value}
          direccion={direccion}
          onSelect={onChange}
          onClose={() => setMostrarMapa(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  outlinedBtn: {
    borderColor: "#3B82F6",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  outlinedBtnPressed: {
    opacity: 0.9,
  },
  outlinedBtnText: {
    color: "#3B82F6",
    fontWeight: "700",
    letterSpacing: 0.2,
    textAlign: "center",
  },
});

export default PostMapSelector;
