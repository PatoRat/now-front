import { Drawer } from "@/src/components/animated/Drawer";
import Postear from "@/src/screens/Postear";
import { useState } from "react";
import {
  StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PostScreen() {

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <SafeAreaView style={styles.pestaña}>
      <Drawer
        isDrawerOpen={isDrawerOpen}
        onPress={setIsDrawerOpen}
      />
      <Postear />

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
