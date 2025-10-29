import { ThemeColors } from "@/scripts/types";
import { Drawer } from "@/src/components/animated/Drawer";
import { useContextApp } from "@/src/components/context-provider/Theme";
import Discover from "@/src/screens/Discover";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DiscoverIndex() {
  const {theme} = useContextApp();
  const styles = stylesFn(theme.colors);

  return (
    <SafeAreaView style={styles.pestaña}>
      <Drawer />
      <Discover />
    </SafeAreaView>
  );
}

const stylesFn = (colors: ThemeColors) => StyleSheet.create({
  pestaña: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  }
});