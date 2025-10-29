import { Drawer } from "@/src/components/animated/Drawer";
import Favs from "@/src/screens/Favs";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavsIndex() {

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <SafeAreaView style={styles.pestaña}>
      <Drawer
        isDrawerOpen={isDrawerOpen}
        onPress={setIsDrawerOpen}
      />
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