import PostInputsHandler from "@/components/PostInputsHandler";
import { useRouter } from "expo-router";
import {
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PostScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.pestaña}>

      <KeyboardAvoidingView
        style={{ flex: 1, width: "100%" }}
        behavior="height"
        keyboardVerticalOffset={80}
      >

        <View style={styles.content}>
          <Text style={styles.texto}>Este va a ser el Post.</Text>
          <PostInputsHandler router={router} />
        </View>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  pestaña: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: Dimensions.get("window").width * 0.92,
    alignSelf: "center",
    paddingTop: 12,
    paddingBottom: 16,
    gap: 12,
  },
  texto: {
    color: "white",
    alignSelf: "center",
    marginBottom: 8,
  },
});
