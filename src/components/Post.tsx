
import { Theme } from "@react-navigation/native";
import { PostType } from "@/scripts/types";
import { useTheme } from "@/src/hooks/useTheme";
import React, { useRef, useState } from "react";
import { View, Text, Image, Pressable, Animated, StyleSheet, useWindowDimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
const Post = ({ titulo, descripcion, imagenes, fechaInicio, fechaFin, direccion }: Omit<PostType, "id"> & { direccion?: string }) => {
	const { theme } = useTheme();
	const { width } = useWindowDimensions();
	const styles = stylesFn(theme, width);

	// Estado animado para el corazón
    const lastTap = useRef<number | null>(null);
    const [showHeart, setShowHeart] = useState(false);
    const heartAnim = useRef(new Animated.Value(0)).current;

	// Función para detectar doble tap
    const handleDoubleTap = () => {
        const now = Date.now();
        if (lastTap.current && now - lastTap.current < 300) {
            setShowHeart(prev => !prev);
            Animated.timing(heartAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else {
            lastTap.current = now;
        }
    };


	const formatoFecha = (fecha: Date) =>
		fecha.toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });

    return (
        <Pressable onPress={handleDoubleTap} style={{ position: "relative" }}>
			<View style={styles.postContainer}>

            {/* Corazón */}
            {showHeart && (
                <Animated.View
                    style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        transform: [{ scale: heartAnim }],
                    }}
                >
                    <FontAwesome name="heart" size={32} color="red" />
                </Animated.View>
            )}
				{/* Corazón animado */}
				{showHeart && (
					<Animated.View style={[styles.heart, { opacity: heartAnim }]}>
						<FontAwesome name="heart" size={32} color="red" />
					</Animated.View>
				)}

				<Text style={styles.titulo}>{titulo}</Text>

				{imagenes.length > 0 && (
					<View style={styles.imagenContainer}>
						<Image source={imagenes[0]} style={styles.imagen} resizeMode="cover" />
						{imagenes.length > 1 && (
							<View style={styles.overlay}>
								<Text style={styles.overlayText}>+{imagenes.length - 1}</Text>
							</View>
						)}
					</View>
				)}

				{!!descripcion && <Text style={styles.descripcion}>{descripcion}</Text>}

				{direccion && (
					<View style={styles.direccionContainer}>
						<FontAwesome style={styles.direccionIcon} size={24} name="map-marker" color="red" />
						<Text style={styles.direccionText}>{direccion}</Text>
					</View>
				)}

				<View style={styles.fechasContainer}>
					<Text style={styles.fechaText}>Inicio: {formatoFecha(fechaInicio)}</Text>
					<Text style={styles.fechaText}>Fin: {formatoFecha(fechaFin)}</Text>
				</View>
			</View>
		</Pressable>
	);
};

export default Post;

const stylesFn = (theme: Theme, width: number) =>
	StyleSheet.create({
		postContainer: {
			backgroundColor: theme.colors.card,
			borderRadius: 12,
			padding: 16,
			marginVertical: 8,
			width: Math.round(width * 0.9),
			alignSelf: "center",
			shadowColor: "#000",
			shadowOpacity: theme.dark ? 0.2 : 0.08,
			shadowRadius: 6,
			shadowOffset: { width: 0, height: 4 },
			elevation: 3,
		},
		heart: {
			position: "absolute",
			top: 12,
			left: 12,
			zIndex: 10,
		},
		titulo: {
			fontSize: 18,
			fontFamily: theme.fonts.bold.fontFamily,
			fontWeight: theme.fonts.bold.fontWeight,
			color: theme.colors.text,
			marginBottom: 12,
			textAlign: "center",
		},
		imagenContainer: {
			width: "100%",
			aspectRatio: 1.5,
			borderRadius: 12,
			overflow: "hidden",
			marginBottom: 12,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: theme.colors.border,
		},
		imagen: {
			width: "100%",
			height: "100%",
		},
		overlay: {
			position: "absolute",
			top: 8,
			right: 8,
			backgroundColor: "rgba(0,0,0,0.55)",
			paddingHorizontal: 6,
			paddingVertical: 2,
			borderRadius: 12,
		},
		overlayText: {
			color: "#fff",
			fontWeight: theme.fonts.bold.fontWeight,
			fontSize: 14,
		},
		fechasContainer: {
			flexDirection: "row",
			justifyContent: "space-between",
			backgroundColor: theme.colors.border,
			borderRadius: 8,
			padding: 8,
			marginBottom: 12,
		},
		fechaText: {
			fontSize: 12,
			color: theme.colors.text,
			fontWeight: "500",
		},
		descripcion: {
			fontSize: 14,
			color: theme.colors.text,
		},
		direccion: {
			color: theme.colors.text,
			fontSize: 14,
			marginTop: 4,
		},
		direccionContainer: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: theme.colors.border,
			paddingHorizontal: 10,
			paddingVertical: 6,
			borderRadius: 8,
			marginBottom: 12,
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

	}
	);
