import { useAuth } from "@/src/components/context-provider/Auth";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

const Login = () => {
    const router = useRouter();
    const { logear } = useAuth();

  const onLogin = async () => {
    await logear("","");// poner credenciales, ver que hacer
    // Después del sign-in, **mejor** reemplazar para que no se pueda volver al login
    router.replace("/(tabs)");
  };
  const registrar = () => router.push({ pathname: "../(auth)/register" });

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: "center" }}>
      <Text>Login</Text>

      {/* ... tus inputs ... */}

      <Pressable onPress={onLogin}>
        <Text>Entrar</Text>
      </Pressable>
      <Pressable onPress={registrar}>
        <Text>
            ¿No tenés cuenta? Registrate
        </Text>
      </Pressable>
    </View>
  );
}

export { Login };

