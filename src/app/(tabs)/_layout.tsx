import { ThemeContext } from "@/src/components/context-provider/Theme";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useContext } from "react";
import {
  View
} from "react-native";

export default function TabLayout() {
  //  Colores según el tema
  const { theme } = useContext(ThemeContext);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>

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
