import { useAuth } from "@/src/components/context-provider/Auth";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

const Register = () => {
  const router = useRouter();
  const { signUp } = useAuth();

  const onRegister = async () => {
    await signUp(/* datos */);
    // Si querés entrar directo a la app:
    router.replace("/(tabs)");
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: "center" }}>
      <Text>Register</Text>

      {/* ... tus inputs ... */}

      <Pressable onPress={onRegister}>
        <Text>Crear cuenta</Text>
      </Pressable>
    </View>
  );
}

export { Register };

