import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileIndex() {
  return (
    <SafeAreaView style={styles.pestaña}>


      <Text style={styles.texto}>Este va a ser el Profile.</Text>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pestaña: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  texto: {
    color: "white",
    alignSelf: "center",
    marginBottom: 8,
  },
});