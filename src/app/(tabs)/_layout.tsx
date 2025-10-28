import { Drawer } from "@/src/components/animated/Drawer";
import { ThemeContext } from "@/src/components/context-provider/Theme";
import { FontAwesome } from "@expo/vector-icons";
import { DarkTheme } from "@react-navigation/native";
import { Tabs } from "expo-router";
import { useContext, useState } from "react";
import {
  View
} from "react-native";

export default function TabLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  //  Colores según el tema
  const { theme } = useContext(ThemeContext);
  const backgroundColor = (theme === DarkTheme) ? "#121212" : "#f0f2f5";

  return (
    <View style={{ flex: 1, backgroundColor }}>

      <Drawer
        isDrawerOpen={isDrawerOpen}
        onPress={setIsDrawerOpen}
        backgroundColor={backgroundColor}
      />

      {/* Tabs (contenido principal) */}
      <Tabs screenOptions={{ animation: "shift" }} initialRouteName="index">
        <Tabs.Screen
          name="index"
          options={{
            title: "Discover",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="search" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favs"
          options={{
            title: "Favs",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="star" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="male" color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
