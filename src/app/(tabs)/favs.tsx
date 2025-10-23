import Favs from "@/src/screens/Favs";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavsIndex() {
  return (
    <SafeAreaView style={styles.pestaña}>
      <Favs />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pestaña: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});