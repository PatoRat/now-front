import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function FeedIndex() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.pestaña}>


        <Text style={styles.texto}>Este va a ser el Feed.</Text>

        <View style={styles.botonContainer}>
          <Pressable onPress={() => console.log("futuro link")}>
            {/** Probablemente termine derivando en un Link */}
            <Image
              source={require("@/assets/images/new-post.png")}
              style={styles.nuevoPosteo}
              resizeMode="contain"
            />
          </Pressable>
        </View>

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