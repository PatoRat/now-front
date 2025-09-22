import DATA from "@/assets/databases/data";
import { Router } from "expo-router";
import { useState } from "react";
import {
    ImageSourcePropType,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const PostInputsHandler = (props: {router: Router}) => {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagenes, setImagenes] = useState<ImageSourcePropType[]>([]);

    const publicarPosteo = () => {
        DATA.unshift({
            id: (DATA.length + 1).toString(),
            titulo,
            descripcion,
            imagenes,
        });
        props.router.back();
    };

    return (
        <View style={styles.card}>
            <View style={styles.section}>
                <TextInput
                    style={styles.input}
                    placeholder="Titulo"
                    placeholderTextColor="#8a8a8a"
                    onChangeText={setTitulo}
                    value={titulo}
                    returnKeyType="next"
                />
            </View>

            <View style={styles.section}>
                <TextInput
                    style={[styles.input, styles.inputMultiline]}
                    placeholder="Descripcion"
                    placeholderTextColor="#8a8a8a"
                    multiline
                    onChangeText={setDescripcion}
                    value={descripcion}
                    textAlignVertical="top"
                />
            </View>

            <View style={styles.buttonsRow}>
                {/**
                 * <ImageSelectorButton onPress={setImagenes} />
                 * de momento no veo que funcione bien, lo saco y despues consulto
                 */}
                
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
                <Text style={styles.helperText}>{imagenes.length}{"imagen(es) seleccionada(s)"}</Text>
            )}
        </View>
    );
};

export default PostInputsHandler;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1e1e1e",
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
        backgroundColor: "#2a2a2a",
        borderColor: "#3a3a3a",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: "#fff",
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
});
