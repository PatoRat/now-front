import React, { useState, useContext } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  useColorScheme,
} from "react-native";

const { width } = Dimensions.get("window");

export default function TabLayout() {
  const systemScheme = useColorScheme(); // "light" | "dark"
  const [isDarkMode, setIsDarkMode] = useState(systemScheme === "dark");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0];

  //  Colores según el tema
  const backgroundColor = isDarkMode ? "#121212" : "#f0f2f5";
  const textColor = isDarkMode ? "#fff" : "#000";
  const menuButtonColor = isDarkMode ? "#121212" : "#121212";
  const overlayColor = "rgba(0,0,0,0.2)";

  //  Animación drawer 
  const toggleDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: isDrawerOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsDrawerOpen(!isDrawerOpen);
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.4, 0],
  });

  //  Función para cambiar tema
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <View style={{ flex: 1, backgroundColor }}>
      {/* Botón hamburguesa */}
      <Pressable
        style={[styles.menuButton, { backgroundColor: menuButtonColor }]}
        onPress={toggleDrawer}
      >
        <FontAwesome name="bars" size={28} color="#fff" />
      </Pressable>

      {/* Overlay para cerrar al tocar fuera  NO QUITAR!!!!!!!*/}
      {isDrawerOpen && (
        <Pressable
          style={[styles.overlay, { backgroundColor: overlayColor }]}
          onPress={toggleDrawer}
        />
      )}

      {/* Drawer superpuesto  AGREGAR "NOW" EN EL MEDIO??*/}
      <Animated.View
        style={[styles.drawer, { transform: [{ translateX }], backgroundColor }]}
      >
        <Pressable style={styles.drawerItem} onPress={toggleTheme}>
          <Text style={[styles.drawerText, { color: textColor }]}>
            TEMA
          </Text>
        </Pressable>

        <Pressable style={styles.drawerItem} onPress={toggleDrawer}>
          <Text style={[styles.drawerText, { color: textColor }]}>
            MIS EVENTOS
          </Text>
        </Pressable>

        <Pressable style={styles.drawerItem} onPress={toggleDrawer}>
          <Text style={[styles.drawerText, { color: textColor }]}>
            SOPORTE
          </Text>
        </Pressable>

        <Pressable style={styles.drawerItem} onPress={toggleDrawer}>
          <Text style={[styles.drawerText, { color: textColor }]}>
            CERRAR SESIÓN
          </Text>
        </Pressable>
      </Animated.View>

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

const styles = StyleSheet.create({
  menuButton: {
    position: "absolute",
    top: 45,
    left: 20,
    zIndex: 10,
    padding: 10,
    borderRadius: 8,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  drawer: {
    position: "absolute",
    top: 10,
    left: 0,
    width: width * 0.4,
    height: "100%",
    paddingTop: 80,
    paddingHorizontal: 15,
    zIndex: 6,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 3, height: 0 },
  },
  drawerItem: {
    paddingVertical: 12,
  },
  drawerText: {
    fontSize: 16,
  },
});
