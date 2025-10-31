import { Drawer } from "@/src/components/animated/Drawer";
import { useTheme } from "@/src/components/context-provider/Theme";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Image, View } from "react-native";

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      {/* Drawer superpuesto */}
      <Drawer />

      {/* Tabs principales */}
      <Tabs
        screenOptions={{
          animation: "shift",
          headerTitleAlign: "center",
          tabBarStyle: { backgroundColor: theme.colors.background },
          tabBarInactiveBackgroundColor: theme.colors.background,
          tabBarActiveBackgroundColor: theme.colors.card,
          headerStyle: { backgroundColor: theme.colors.card },
          headerTintColor: "black",
          headerTitle: () => (
            <Image
              source={require("@/assets/images/NOW-LOGO.png")}
              style={{ width: 120, height: 110, resizeMode: "contain" }}
            />
          ),
        }}
        initialRouteName="index"
      >
        <Tabs.Screen
          name="favs"
          options={{
            title: "FAVS",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="star" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: "DISCOVER",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="search" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "PROFILE",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="male" color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
