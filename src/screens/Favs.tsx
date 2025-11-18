import { ThemeColors } from "@/scripts/types";
import { useTheme } from "@/src/hooks/theme-hooks";
import { StyleSheet, Text } from "react-native";

export default function Favs() {
    const {theme} = useTheme();
    const styles = stylesFn(theme.colors);

    return (<Text style={styles.texto}>Este va a ser el Favs.</Text>);
}

const stylesFn = (colors: ThemeColors) => StyleSheet.create({
    texto: {
        color: colors.text,
        alignSelf: "center",
        marginBottom: 8,
    },
});