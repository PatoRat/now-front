import { ThemeColors } from "@/scripts/types";
import { useTheme } from "@/src/hooks/theme-hooks";
import { Theme } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import { Animated, FlatList, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import PostPopUp from "../components/PostPopUp/PostPopUp";
import Post from "../components/Post";
import { useFocusEffect, useRouter } from "expo-router";
import DATA from "@/assets/databases/data";

export default function Favs() {
    const {theme} = useTheme();
    const { width } = useWindowDimensions();
	const styles = stylesFn(theme, width);
    const router = useRouter();
	const [posts, setPosts] = useState(DATA);
	const [selectedPost, setSelectedPost] = useState<null | (typeof DATA[number])>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

	useFocusEffect(
		useCallback(() => {
			setPosts([...DATA]);
		}, [])
	);
    // Para abrir pop-up
	const openPopup = (item: typeof DATA[number]) => {
		setSelectedPost(item);
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 250,
			useNativeDriver: true,
		}).start();
	};


	const closePopup = () => {
		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: 200,
			useNativeDriver: true,
		}).start(() => setSelectedPost(null));
	};
    
    return (
    <View style={styles.container}>
			<ScrollView >

                {/* Publicaciones */}
                    <Text style={[styles.sectionTitle, { fontSize: 20 }]}>FAVORITES</Text>

                    {/* Lista de posts*/}
                    <View style={{ flex: 1 }}>
                        <FlatList
                            scrollEnabled={false}
                            data={posts}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <Post
                                    titulo={item.titulo}
                                    descripcion={item.descripcion}
                                    imagenes={item.imagenes}
                                    fechaInicio={item.fechaInicio}
                                    fechaFin={item.fechaFin}
                                    ubicacion={item.ubicacion}
                                    direccion={item.ubicacion?.direccion}
                                    creador={item.creador}
                                    onSingleTap={() => openPopup(item)}
                                />
                            )}

                            contentContainerStyle={styles.listaContenido}
                            showsVerticalScrollIndicator={false}
                        />

                        {/* Pop-up del post */}
                                    <PostPopUp
                                        visible={!!selectedPost}
                                        post={selectedPost}
                                        onClose={closePopup}
                                    />
                    </View>
			</ScrollView>
		</View>
	);
}
const stylesFn = (theme: Theme, width: number) =>
	StyleSheet.create({
    listaContenido: {
        paddingBottom: 100,
    },

    texto: {
        color: theme.colors.text,
        alignSelf: "center",
        marginBottom: 8,
    },
    
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: theme.colors.text,
        marginBottom: 10 
    },
    
    container: {
        flex: 1,
        backgroundColor: theme.colors.background 
    },
});