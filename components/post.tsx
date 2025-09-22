import { PostType } from "@/scripts/types";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View
} from "react-native";

const Post = ({titulo, descripcion, imagenes }: Omit<PostType, "id">) => (
    <View>
        <Text>{titulo}</Text>

        {imagenes.length > 0 && (
            <View style={styles.imagenContainer}>
                <Image
                    source={imagenes[0]}
                    style={styles.imagen}
                    resizeMode="cover"
                />
                {imagenes.length > 1 && (
                    <View style={styles.overlay}>
                        <Text style={styles.overlayText}>+{imagenes.length - 1}</Text>
                    </View>
                )}
            </View>
        )}
        
        <Text>{descripcion}</Text>
    </View>
);

export default Post;

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: "#1e1e1e", // fondo tipo card
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        width: Dimensions.get("window").width * 0.9,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    titulo: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 8,
    },
    imagenContainer: {
        width: "100%",
        aspectRatio: 1.5, // altura proporcional a la anchura
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#333", // placeholder si no hay imagen
    },
    imagen: {
        width: "100%",
        height: "100%",
    },
    overlay: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(0,0,0,0.5)",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
    },
    overlayText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    descripcion: {
        fontSize: 14,
        color: "#ccc",
    },
});