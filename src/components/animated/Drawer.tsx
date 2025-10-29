import { BamvDark, BamvLight } from "@/scripts/themes";
import { ThemeColors } from "@/scripts/types";
import { useTheme } from "@/src/components/context-provider/Theme";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View
} from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

export const Drawer = () => {

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const drawerWidth = Math.min(420, width - insets.left - 8);

    const { theme, setTheme } = useTheme();
    const [slideAnim] = useState(() => new Animated.Value(0));
    const backgroundColor = theme.colors.card;

    const styles = stylesFunc(drawerWidth, theme.colors, insets);

    const toggleDrawer = () => {
        Animated.timing(slideAnim, {
            toValue: isDrawerOpen ? 0 : 1,
            duration: 280,
            useNativeDriver: true,
        }).start();
        setIsDrawerOpen(!isDrawerOpen);
    };

    const translateX = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-drawerWidth * 0.7, 0],
    });

    const overlayOpacity = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    //  Función para cambiar tema
    const toggleTheme = () => setTheme(theme.dark ? BamvLight : BamvDark);

    return (
        <View
            style={StyleSheet.absoluteFillObject}
            pointerEvents={isDrawerOpen ? "auto" : "box-none"}
        >
            {/* Botón hamburguesa */}
            < Pressable
                style={styles.menuButton}
                onPress={toggleDrawer}
            >
                <FontAwesome name="bars" size={28} color={theme.dark ? "#fff" : "#121212"} />
            </Pressable >

            {/* Overlay para cerrar al tocar fuera  NO QUITAR!!!!!!!*/}
            {
                isDrawerOpen && (
                    <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
                        <Pressable
                            style={StyleSheet.absoluteFill}
                            onPress={toggleDrawer}
                        />
                    </Animated.View>
                )
            }

            {/* Drawer superpuesto  AGREGAR "NOW" EN EL MEDIO??*/}
            <Animated.View
                style={[styles.drawer, { transform: [{ translateX }], backgroundColor }]}
            >
                <Pressable style={styles.drawerItem} onPress={toggleTheme}>
                    <Text style={styles.drawerText}>
                        TEMA
                    </Text>
                </Pressable>

                <Pressable style={styles.drawerItem} onPress={toggleDrawer}>
                    <Text style={styles.drawerText}>
                        MIS EVENTOS
                    </Text>
                </Pressable>

                <Pressable style={styles.drawerItem} onPress={toggleDrawer}>
                    <Text style={styles.drawerText}>
                        SOPORTE
                    </Text>
                </Pressable>

                <Pressable style={styles.drawerItem} onPress={toggleDrawer}>
                    <Text style={styles.drawerText}>
                        CERRAR SESIÓN
                    </Text>
                </Pressable>
            </Animated.View>
        </View>
    )
}

const stylesFunc = (width: number, colors: ThemeColors, insets: EdgeInsets) => StyleSheet.create({
    menuButton: {
        position: "absolute",
        top: Math.max(16, insets.top + 8),
        left: 16,
        width: 44,
        height: 44,
        zIndex: 10,
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: 10,
        alignItems: "center",
        elevation: 10,
        backgroundColor: colors.card
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.2)",
        position: "absolute",
        zIndex: 5,
    },
    drawer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        width: width * 0.7,
        paddingTop: insets.top + 64,
        paddingLeft: insets.left + 16,
        paddingBottom: insets.bottom + 16,
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
        color: colors.text
    },
});