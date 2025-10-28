import { Drawer } from "@/src/components/animated/Drawer";
import { ThemeContext } from "@/src/components/context-provider/Theme";
import Discover from "@/src/screens/Discover";
import { DarkTheme } from "@react-navigation/native";
import { useContext, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function DiscoverIndex() {
  //  Colores según el tema
  const { theme } = useContext(ThemeContext);
  const backgroundColor = (theme === DarkTheme) ? "#121212" : "#f0f2f5";

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <SafeAreaView style={styles.pestaña}>
      <Drawer
        isDrawerOpen={isDrawerOpen}
        onPress={setIsDrawerOpen}
        backgroundColor={backgroundColor}
        width={width}
      />
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