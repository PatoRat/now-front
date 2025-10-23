import Discover from "@/src/screens/Discover";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DiscoverIndex() {
  return (
    <SafeAreaView style={styles.pestaña}>
      <Discover />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pestaña: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    paddingTop: 8,
  }
});