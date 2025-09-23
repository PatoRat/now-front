import DATA from "@/assets/databases/data";
import Post from "@/components/Post";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FeedIndex() {
  const router = useRouter();
  const [posts, setPosts] = useState(DATA);

  useFocusEffect(
    useCallback(() => {
      setPosts([...DATA]);
    }, [])
  );

  const nuevoPost = () => router.push({ pathname: "../postear" });

  return (
    <SafeAreaView style={styles.pestaña}>
      <Text style={styles.texto}>Este va a ser el Feed.</Text>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Post
            titulo={item.titulo}
            descripcion={item.descripcion}
            imagenes={item.imagenes}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pestaña: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    paddingTop: 8,
  },
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