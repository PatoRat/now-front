import { PostType } from "@/scripts/types";
import { ThemeContext } from "@/src/components/context-provider/Theme";
import { Theme } from "@react-navigation/native";
import { useContext } from "react";
import {
    Image,
    StyleSheet,
    Text,
    useWindowDimensions,
    View
} from "react-native";

const Post = ({ titulo, descripcion, imagenes }: Omit<PostType, "id">) => {
    const { theme } = useContext(ThemeContext);
    const { width } = useWindowDimensions();

    const styles = stylesFn(theme, width);

    return (
        <View style={styles.postContainer}>
            <Text style={styles.titulo}>{titulo}</Text>

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

            {!!descripcion && <Text style={styles.descripcion}>{descripcion}</Text>}
        </View>
    );
};

export default Post;

const stylesFn = (
    theme: Theme,
    width: number
) => StyleSheet.create({
    postContainer: {
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        width: Math.round(width * 0.9),
        alignSelf: "center",
        shadowColor: "#000",
        shadowOpacity: theme.dark ? 0.2 : 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    titulo: {
        fontSize: 18,
        fontFamily: theme.fonts.bold.fontFamily,
        fontWeight: theme.fonts.bold.fontWeight,
        color: theme.colors.text,
        marginBottom: 12,
    },
    imagenContainer: {
        width: "100%",
        aspectRatio: 1.5,
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.border,
    },
    imagen: {
        width: "100%",
        height: "100%",
    },
    overlay: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(0,0,0,0.55)",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
    },
    overlayText: {
        color: "#fff",
        fontWeight: theme.fonts.bold.fontWeight,
        fontSize: 14,
    },
    descripcion: {
        fontSize: 14,
        color: theme.colors.text,
    },
});