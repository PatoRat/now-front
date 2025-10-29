import { useTheme } from "@/src/components/context-provider/Theme";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabLayout() {
  //  Colores según el tema
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>

      {/* Tabs (contenido principal) */}
      <Tabs screenOptions={{ animation: "shift" }} initialRouteName="login">
        <Tabs.Screen
          name="login"
          options={{
            title: "Login",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="lock" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="register"
          options={{
            title: "Register",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="registered" color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
