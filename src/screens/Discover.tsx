import DATA from "@/assets/databases/data";
import Post from "@/src/components/Post";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View
} from "react-native";

export default function Discover() {
  const router = useRouter();
  const [posts, setPosts] = useState(DATA);

  useFocusEffect(
    useCallback(() => {
      setPosts([...DATA]);
    }, [])
  );

  const nuevoPost = () => router.push({ pathname: "../postear" });

  return (
    <View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Post
            titulo={item.titulo}
            descripcion={item.descripcion}
            imagenes={item.imagenes}
            fechaInicio={item.fechaInicio}
            fechaFin={item.fechaFin}    
          />
        )}
        contentContainerStyle={styles.listaContenido}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.botonContainer}>
        <Pressable onPress={nuevoPost}>
          <Image
            source={require("@/assets/images/new-post.png")}
            style={styles.nuevoPosteo}
            resizeMode="contain"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  texto: {
    color: "white",
    alignSelf: "center",
    marginBottom: 8,
  },
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
});