import * as ImagePicker from "expo-image-picker";
import { ImageSourcePropType, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";

type ImageSelectorButtonProps = {
    onSelect: React.Dispatch<React.SetStateAction<ImageSourcePropType[]>>;
};

const ImageSelectorButton = ({ onSelect }: ImageSelectorButtonProps) => {
    const [count, setCount] = useState(0); // contador de imágenes seleccionadas

    const seleccionarImagen = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled && result.assets) {
            const uris = result.assets.map((asset) => ({ uri: asset.uri }));
            setCount((prev) => prev + uris.length); // actualizar contador
            onSelect((prev) => [...prev, ...uris]);
        }
    };

    return (
        <Pressable
            onPress={seleccionarImagen}
            style={({ pressed }) => [
                styles.outlinedBtn,
                pressed && styles.outlinedBtnPressed,
            ]}
            android_ripple={{ color: "rgba(59,130,246,0.15)", borderless: false }}
            hitSlop={8}
        >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Text style={styles.outlinedBtnText}>Seleccionar Imagen</Text>
                {count > 0 && (
                    <Text style={[styles.outlinedBtnText, { fontWeight: "500" }]}>
                        ({count})
                    </Text>
                )}
            </View>
        </Pressable>
    );
};

export default ImageSelectorButton;

const styles = StyleSheet.create({
    outlinedBtn: {
        borderColor: "#3B82F6",
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: "transparent",
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
