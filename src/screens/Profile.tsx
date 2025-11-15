import { ThemeColors } from "@/scripts/types";
import { useTheme } from "@/src/hooks/useTheme";
import { StyleSheet, Text } from "react-native";

export default function Profile() {
    const {theme} = useTheme();
    const styles = stylesFn(theme.colors);
    
    return (<Text style={styles.texto}>Este va a ser el Profile.</Text>);
}

const stylesFn = (colors: ThemeColors) => StyleSheet.create({
    texto: {
        color: colors.text,
        alignSelf: "center",
        marginBottom: 8,
    },
});