import Profile from "@/src/screens/Profile";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileIndex() {
  return (
    <SafeAreaView style={styles.pestaña}>
      <Profile />
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