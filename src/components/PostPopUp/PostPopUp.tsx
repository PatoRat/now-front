import { BlurView } from "expo-blur";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Linking,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Theme } from "@react-navigation/native";
import { useTheme } from "@/src/hooks/theme-hooks";

interface PostPopUpProps {
    visible: boolean;
    post: any;
    onClose: () => void;
}

export default function PostPopUp({ visible, post, onClose}: PostPopUpProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [currentIndex, setCurrentIndex] = useState(0);
    const width = Dimensions.get("window").width;
	const { theme } = useTheme();
	const styles = stylesFn(theme, width);

    useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    if (!post) return null;

    const formatoFecha = (fecha: Date) => {
        if (!fecha) return "";
        const date = new Date(fecha);
        return date.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const abrirEnMaps = (lat: number, lng: number) => {
        const url = Platform.select({
            ios: `maps:0,0?q=${lat},${lng}`,
            android: `geo:${lat},${lng}?q=${lat},${lng}`,
            default: `https://www.google.com/maps?q=${lat},${lng}`,
        });
        url && Linking.openURL(url);
    };

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            <BlurView intensity={80} style={StyleSheet.absoluteFill}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
            </BlurView>

            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                <Pressable style={styles.overlay} onPress={onClose} />
            </Animated.View>

            <Animated.View
                style={[
                    styles.popupContainer,
                    {
                        opacity: fadeAnim,
                        transform: [
                            { translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) },
                            { scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) },
                            { rotateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: ["15deg", "0deg"] }) },
                        ],
                    },
                ]}
            >
                {/* Carrusel de imágenes */}
                {post.imagenes?.length > 0 && (
                    <>
                        <FlatList
                            data={post.imagenes}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(_, i) => i.toString()}
                            onScroll={(e) => {
                                const index = Math.round(e.nativeEvent.contentOffset.x / (width * 0.85));
                                setCurrentIndex(index);
                            }}
                            scrollEventThrottle={16}
                            renderItem={({ item }) => (
                                <View style={{
                                    width: width * 0.85,
                                    height: 200,
                                    marginRight: 10,
                                    borderRadius: 15,
                                    overflow: "hidden",
                                    shadowColor: "#000",
                                    shadowOpacity: 0.3,
                                    shadowRadius: 10,
                                    elevation: 5,
                                }}>
                                    <Image source={item} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                                </View>
                            )}
                            contentContainerStyle={{ paddingHorizontal: width * 0.075 / 2 }}
                        />

                        {/* Dots de paginación */}
                        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10, marginBottom: 5 }}>
                            {post.imagenes.map((_: any, i: React.Key | null | undefined) => (
                                <View key={i} style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 4,
                                    marginHorizontal: 4,
                                    backgroundColor: i === currentIndex ? "#007AFF" : "#ccc",
                                }} />
                            ))}
                        </View>
                    </>
                )}

                <Text style={styles.popupTitle}>{post.titulo}</Text>
                {!!post.descripcion && <Text style={styles.popupDesc}>{post.descripcion}</Text>}

                <Text style={styles.fechaText}>Inicio: {formatoFecha(post.fechaInicio)}</Text>
                <Text style={styles.fechaText}>Fin: {formatoFecha(post.fechaFin)}</Text>

                <View style={{ alignItems: "center", marginTop: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: theme.colors.text }}>
                        Creado por: {post.creador}
                    </Text>
                </View>

                {post.ubicacion && (
                    <Pressable
                        onPress={() => abrirEnMaps(post.ubicacion.latitud, post.ubicacion.longitud)}
                        android_ripple={{ color: "rgba(255,255,255,0.2)" }}
                        style={({ pressed }) => [{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 10 }, pressed && { opacity: 0.6 }]}
                    >
                        <FontAwesome style={{ marginRight: 6, fontSize: 16 }} size={24} name="map-marker" color="red" />
                        <Text style={{ fontSize: 14, color: theme.colors.text, flexShrink: 1 }}>
                            {post.ubicacion.direccion}
                        </Text>
                    </Pressable>
                )}

                <Pressable onPress={onClose} style={({ pressed }) => [
                    { position: "absolute", top: 10, right: 10, padding: 10, borderRadius: 20, backgroundColor: "rgba(0,0,0,0.3)" },
                    pressed && { backgroundColor: "rgba(0,0,0,0.6)" }
                ]}>
                    <FontAwesome name="close" size={20} color="white" />
                </Pressable>
            </Animated.View>
        </Modal>
    );
}

const stylesFn = (theme: Theme, width: number) =>
	StyleSheet.create({
		listaContenido: {
			paddingBottom: 100,
		},
		botonContainer: {
			position: "absolute",
			bottom: 20,
			right: 20,
		},
		nuevoPosteo: {
			width: Dimensions.get("window").width * 0.16,
			height: Dimensions.get("window").width * 0.16,
		},
		overlay: {
			...StyleSheet.absoluteFillObject,
			backgroundColor: "rgba(0,0,0,0.5)",
		},
		popupContainer: {
			position: "absolute",
			bottom: Dimensions.get("window").height * 0.25,
			alignSelf: "center",
			width: "85%",
			backgroundColor: theme.colors.background,
			borderRadius: 20,
			padding: 20,
			shadowColor: "#000",
			shadowOpacity: 0.4,
			shadowRadius: 10,
			elevation: 8,
		},

		popupTitle: {
			fontSize: 20,
			fontWeight: "bold",
			color: theme.colors.text,
			marginBottom: 10,
			textAlign: "center",
		},
		popupDesc: {
			color: theme.colors.text,
			fontSize: 15,
			marginBottom: 15,
			textAlign: "center",
		},
		closeButton: {
			alignSelf: "flex-end",
			backgroundColor: "#007AFF",
			paddingVertical: 8,
			paddingHorizontal: 15,
			borderRadius: 10,
		},
		carousel: {
			width: "100%",
			height: 200,
			marginBottom: 15,
		},
		popupImage: {
			width: Dimensions.get("window").width * 0.85,
			height: 200,
			borderRadius: 15,
			marginRight: 5,
		},
		direccionContainer: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			marginBottom: 10,
		},
		fechasContainer: {
			marginTop: 10,
		},
		fechaText: {
			color: theme.colors.text,
			fontSize: 14,
			textAlign: "center",
			marginBottom: 10,
		},

		direccionIcon: {
			marginRight: 6,
			fontSize: 16,
		},

		direccionText: {
			fontSize: 14,
			color: theme.colors.text,
			flexShrink: 1,
		},

	});
