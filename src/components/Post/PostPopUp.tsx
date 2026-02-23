import { URL_BACKEND } from "@/src/config";
import { useTheme } from "@/src/hooks/theme-hooks";
import { FontAwesome } from "@expo/vector-icons";
import { Theme } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    Linking,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useLikes } from "../context-provider/LikeContext";
import { useAuth } from "@/src/hooks/auth-hooks";
import { agregarFavs, quitarFavs } from "@/src/api/event.route";
import { useFollowing } from "@/src/hooks/useFollowing";
import { useAlertState } from "@/src/hooks/alert-hooks";
import { avatarMap } from "@/assets/constants/avatarMap";
import { followUser, unfollowUser } from "@/src/api/user.route";
import { router } from "expo-router";

type PostPopUpProps = {
    visible: boolean,
    post: any,
    onClose: () => void
};

type ImagenSource = { uri: string };

export default function PostPopUp({ visible, post, onClose }: PostPopUpProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const { token } = useAuth();
    const width = Dimensions.get("window").width;
    const { theme } = useTheme();
    const styles = stylesFn(theme, width);

    const { likes, currentLikes, toggleLike } = useLikes();
    const { followingIds } = useFollowing(token);
    const { mensaje, success } = useAlertState();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
        } else {
            Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
        }
    }, [visible]);

    useEffect(() => {
        if (post?.creador?.id) {
            setIsFollowing(followingIds.includes(post.creador.id));
        }
    }, [followingIds, post?.creador?.id]);
        // console.log("PostPopUp ListaLikes: ", currentLikes);
        // console.log("PostPopUp eventID: ", Number(post.id));
        // console.log("PostPopUp Likes: ", currentLikes[Number(post.id)]);
    }, [fadeAnim, visible]);

    if (!post) return null;

    const liked = likes[post.id] ?? false;
    const likeCount = currentLikes[post.id] ?? 0;

    const duracionEnHorasYMinutos = (fechaInicio: Date, fechaFin: Date): string => {
        const miliseg = Math.abs(new Date(fechaFin).getTime() - new Date(fechaInicio).getTime());

        const totalMinutos = Math.floor(miliseg / (1000 * 60));

        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60;

        let resultado = "";
        if (horas > 0) resultado += `${horas}h `;
        resultado += `${minutos}m`;

        return resultado;
    };

    const imagenesMapeadas: ImagenSource[] =
        post.imagenes?.map((img: { url: string }) => {
            if (!img.url) return null;
            let uri = img.url.startsWith("http")
                ? img.url.replace("localhost", URL_BACKEND.replace(/^https?:\/\//, ""))
                : img.url.startsWith("/") ? `${URL_BACKEND}${img.url}` : `${URL_BACKEND}/uploads/${img.url}`;
            return { uri };
        }).filter(Boolean);

    const nextImage = () => { if (currentIndex < imagenesMapeadas.length - 1) setCurrentIndex(currentIndex + 1); };
    const prevImage = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1); };

    const handleLike = async () => {
        const nuevoLike = !liked;
        try {
            if (nuevoLike) await agregarFavs(token, String(post.id));
            else await quitarFavs(token, String(post.id));
            toggleLike(Number(post.id), nuevoLike);
        } catch (error) {
            mensaje.set(`Error al actualizar favoritos: ${error}`);
            success.set(false);
        }
    };

    const handleFollowToggle = async () => {
        if (!token) return;
        const targetUserId = post?.creador?.id;
        if (!targetUserId) return;
        try {
            if (isFollowing) await unfollowUser(token, Number(targetUserId));
            else await followUser(token, Number(targetUserId));
            setIsFollowing(!isFollowing);
        } catch (err) {
            mensaje.set(`Error al actualizar seguimiento: ${err}`);
            success.set(false);
        }
    };

    const abrirEnMaps = (lat: number, lng: number) => {
        const url = Platform.select({
            ios: `maps:0,0?q=${lat},${lng}`,
            android: `geo:${lat},${lng}?q=${lat},${lng}`,
            default: `https://www.google.com/maps?q=${lat},${lng}`,
        });
        url && Linking.openURL(url);
    };



    const formatoFecha = (fecha: Date) => {
        if (!fecha) return "";
        const date = new Date(fecha);
        return `${date.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}, ${date.toLocaleTimeString("es-AR", { timeStyle: "short" })}`;
    };

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            <BlurView intensity={80} style={StyleSheet.absoluteFill}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
            </BlurView>

            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
            <Animated.View style={[styles.popupContainer, { opacity: fadeAnim }]}>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", marginBottom: 10 }}>

                    <Pressable
                        onPress={() => {
                            onClose();
                            router.push({
                                pathname: "/profile/[userId]",
                                params: { userId: post.creador.id.toString() }
                            });
                        }}
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        <Image
                            source={avatarMap[post.creador.numeroAvatar ?? 1]}
                            style={styles.avatarImage}
                        />
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 16,
                                color: theme.colors.text,
                                marginLeft: 8
                            }}
                        >
                            {post.creador.nombre}
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={handleFollowToggle}
                        style={({ pressed }) => [
                            {
                                paddingHorizontal: 10,
                                paddingVertical: 6,
                                marginLeft: 6,
                                borderRadius: 6,
                                backgroundColor: isFollowing ? "#ccc" : "#007AFF"
                            },
                            pressed && { opacity: 0.7 }
                        ]}
                    >
                        <Text style={{ color: isFollowing ? "#333" : "#fff", fontSize: 14 }}>
                            {isFollowing ? "Siguiendo" : "Seguir"}
                        </Text>
                    </Pressable>
                </View>

                {/* Carrusel */}
                {imagenesMapeadas.length > 0 && (
                    <View style={{ marginTop: 10, alignItems: "center" }}>
                        <View style={{ width: width * 0.75, height: 180, borderRadius: 12, overflow: "hidden", backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
                            {currentIndex > 0 && <FontAwesome name="chevron-left" size={26} color="rgba(255,255,255,0.5)" style={{ position: "absolute", left: 10, zIndex: 1 }} />}
                            {currentIndex < imagenesMapeadas.length - 1 && <FontAwesome name="chevron-right" size={26} color="rgba(255,255,255,0.5)" style={{ position: "absolute", right: 10, zIndex: 1 }} />}

                            <Pressable onPress={prevImage} style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "50%", zIndex: 2 }} />
                            <Image source={imagenesMapeadas[currentIndex]} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
                            <Pressable onPress={nextImage} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "50%", zIndex: 2 }} />
                        </View>

                        {/* Dots */}
                        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
                            {imagenesMapeadas.map((_, i) => (
                                <View key={i} style={{ width: 8, height: 8, borderRadius: 4, marginHorizontal: 4, backgroundColor: i === currentIndex ? "#007AFF" : "#ccc" }} />
                            ))}
                        </View>
                    </View>
                )}

                {/* Título y descripción */}
                <Text style={styles.popupTitle}>{post.titulo}</Text>
                {!!post.descripcion && <Text style={styles.popupDesc}>{post.descripcion}</Text>}

                {/* Fechas */}
                <Text style={styles.fechaText}>Inicio: {formatoFecha(post.fechaInicio)}</Text>
                <Text style={styles.fechaText}>Fin: {formatoFecha(post.fechaFin)}</Text>
                <Text style={styles.fechaText}>
                    ⏱️Duracion: {duracionEnHorasYMinutos(post.fechaInicio, post.fechaFin)}
                </Text>

                {/* Like y ubicacion*/}
                <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 12 }}>
                    <Pressable onPress={handleLike} style={({ pressed }) => [styles.bigButtonSmall, pressed && { opacity: 0.8 }]}>
                        <Text style={styles.bigButtonTextSmall}>{liked ? "💔 Me gusta" : "❤️ Me gusta"}</Text>
                    </Pressable>

                    {post.ubicacion && (
                        <Pressable onPress={() => abrirEnMaps(post.ubicacion.latitud, post.ubicacion.longitud)} style={({ pressed }) => [styles.bigButtonSmall, { backgroundColor: "#007AFF" }, pressed && { opacity: 0.8 }]}>
                            <Text style={styles.bigButtonTextSmall}>📍 Cómo ir</Text>
                        </Pressable>
                    )}
                <View style={{ alignItems: "center", marginTop: 6 }}>
                    <Text style={{ fontSize: 14, color: theme.colors.text }}>
                        ❤️ {post.likesCont ?? 0} Favs
                    </Text>
                </View>

                {/* Cerrar */}
                <Pressable onPress={onClose} style={({ pressed }) => [{ position: "absolute", top: 10, right: 10, padding: 10, borderRadius: 20, backgroundColor: "rgba(0,0,0,0.3)" }, pressed && { backgroundColor: "rgba(0,0,0,0.6)" }]}>
                    <FontAwesome name="close" size={20} color="white" />
                </Pressable>
            </Animated.View>
        </Modal>
    );
}

const stylesFn = (theme: Theme, width: number) =>
    StyleSheet.create({
        avatarImage: {
            width: 36,
            height: 36,
            borderRadius: 18,
        },

        popupContainer: {
            position: "absolute",
            top: "50%",
            alignSelf: "center",
            width: "85%",
            backgroundColor: theme.colors.background,
            borderRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.4,
            shadowRadius: 10,
            elevation: 8,
            transform: [{ translateY: -Dimensions.get("window").height * 0.25 }]
        },

        bigButtonSmall: {
            flex: 1,
            marginHorizontal: 6,
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: "center",
            backgroundColor: "#E91E63",
        },

        bigButtonTextSmall: {
            color: "white",
            fontSize: 14,
            fontWeight: "bold",
        },
        overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" },

        popupTitle: { fontSize: 20, fontWeight: "bold", color: theme.colors.text, marginBottom: 10, textAlign: "center" },
        popupDesc: { color: theme.colors.text, fontSize: 15, marginBottom: 15, textAlign: "center" },
        fechaText: { color: theme.colors.text, fontSize: 14, textAlign: "center", marginBottom: 10 },
        bigButton: { marginTop: 12, paddingVertical: 14, borderRadius: 10, alignItems: "center", backgroundColor: "#E91E63" },
        bigButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
    });