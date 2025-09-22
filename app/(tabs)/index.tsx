import DATA from "@/assets/databases/data";
import Post from "@/components/post";
import { useRouter } from "expo-router";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function FeedIndex() {
  const router = useRouter();

  const nuevoPost = () => router.push({ pathname: "../postear" });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.pestaña}>

        <Text style={styles.texto}>Este va a ser el Feed.</Text>

        <View style={styles.botonContainer}>
          <Pressable onPress={nuevoPost}>
            <Image
              source={require("@/assets/images/new-post.png")}
              style={styles.nuevoPosteo}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        <FlatList
          data={DATA}
          renderItem={({ item }) => <Post
            titulo={item.titulo}
            descripcion={item.descripcion}
            imagenes={item.imagenes}
          />}
          keyExtractor={item => item.id}
        />

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  pestaña: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  texto: {
    color: "white",
  },
  botonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  nuevoPosteo: {
    width: Dimensions.get("window").width * 0.1,
    height: Dimensions.get("window").height * 0.1,
  },
});