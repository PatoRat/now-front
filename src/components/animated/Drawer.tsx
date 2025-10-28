import { ThemeContext } from "@/src/components/context-provider/Theme";
import { FontAwesome } from "@expo/vector-icons";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useContext, useState } from "react";
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

export const Drawer = (props: {
    isDrawerOpen: boolean,
    onPress: React.Dispatch<React.SetStateAction<boolean>>,
    backgroundColor: "#121212" | "#f0f2f5",
    width: number
}) => {

    const { theme, setTheme } = useContext(ThemeContext);
    const [slideAnim] = useState(() => new Animated.Value(0));
    const textColor = (theme === DarkTheme) ? "#fff" : "#000";
    const menuButtonColor = (theme === DarkTheme) ? "#121212" : "#121212";
    const overlayColor = "rgba(0,0,0,0.2)";
    const backgroundColor = props.backgroundColor;

    const styles = stylesFunc(props.width);

    const toggleDrawer = () => {
        Animated.timing(slideAnim, {
            toValue: props.isDrawerOpen ? 0 : 1,
            duration: 280,
            useNativeDriver: true,
        }).start();
        props.onPress(!props.isDrawerOpen);
    };

    const translateX = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-props.width * 0.7, 0],
    });

    //  Función para cambiar tema
    const toggleTheme = () => {
        setTheme(theme === DarkTheme ? DefaultTheme : DarkTheme);
    };
    return (
        <View
            style={StyleSheet.absoluteFillObject}
            pointerEvents={props.isDrawerOpen ? "auto" : "box-none"}
        >
            {/* Botón hamburguesa */}
            < Pressable
                style={[styles.menuButton, { backgroundColor: menuButtonColor }]}
                onPress={toggleDrawer}
            >
                <FontAwesome name="bars" size={28} color="#fff" />
            </Pressable >

            {/* Overlay para cerrar al tocar fuera  NO QUITAR!!!!!!!*/}
            {
                props.isDrawerOpen && (
                    <Pressable
                        style={[styles.overlay, { backgroundColor: overlayColor }]}
                        onPress={toggleDrawer}
                    />
                )
            }

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
        </View>
    )
}

const stylesFunc = (width: number) => StyleSheet.create({
    menuButton: {
        top: 45,
        left: 20,
        zIndex: 10,
        padding: 10,
        borderRadius: 8,
        elevation: 10
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        position: "absolute",
        zIndex: 5,
    },
    drawer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        width: width * 0.7,
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