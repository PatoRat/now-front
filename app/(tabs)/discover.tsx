import { StyleSheet, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function DiscoverIndex() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.pestaña}>


        <Text style={styles.texto}>Este va a ser el Discover.</Text>


      </SafeAreaView>
    </SafeAreaProvider>
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
  },
});