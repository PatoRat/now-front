import { StyleSheet, Text } from "react-native";

export default function Profile() {
    return (<Text style={styles.texto}>Este va a ser el Profile.</Text>);
}

const styles = StyleSheet.create({
    texto: {
        color: "white",
        alignSelf: "center",
        marginBottom: 8,
    },
});