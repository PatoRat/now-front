import { Drawer } from "@/src/components/animated/Drawer";
import { ThemeContext } from "@/src/components/context-provider/Theme";
import Postear from "@/src/screens/Postear";
import { DarkTheme } from "@react-navigation/native";
import { useContext, useState } from "react";
import {
  Dimensions,
  StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function PostScreen() {

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
