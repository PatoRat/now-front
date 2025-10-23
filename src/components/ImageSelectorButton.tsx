import * as ImagePicker from "expo-image-picker";
import { ImageSourcePropType, Pressable, StyleSheet, Text } from "react-native";


type ImageSelectorButtonProps = {
    onSelect: React.Dispatch<React.SetStateAction<ImageSourcePropType[]>>;
};

const ImageSelectorButton = ({ onSelect }: ImageSelectorButtonProps) => {

    const seleccionarImagen = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images", "videos"],
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled && result.assets) {
            const uris = result.assets.map((asset) => ({ uri: asset.uri }));
            onSelect(uris);
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
            <Text style={styles.outlinedBtnText}>Seleccionar Imagen</Text>
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
    },
});
