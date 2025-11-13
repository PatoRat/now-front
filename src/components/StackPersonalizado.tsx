import { useAuth } from "@/src/components/context-provider/Auth";
import { useTheme } from "@/src/components/context-provider/Theme";
import { Stack } from "expo-router";
import { Image } from "react-native";

const StackPersonalizado = () => {
  const { isLogged } = useAuth();
  const { theme } = useTheme();

  // if (isFetching) {
  //   return (
  //     <Stack>
  //       <ActivityIndicator />
  //     </Stack>
  //   );
  // }

  if (!isLogged) {
    console.log("estoy en login");
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
            animation: "slide_from_bottom",
            contentStyle: { backgroundColor: theme.colors.background },
          }}
        />
      </Stack>
    );
  } else {
    console.log("estoy en tabs");
    return (
      <Stack
        screenOptions={{
          statusBarStyle: "light",
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            animation: "slide_from_bottom",
          }}
        />

        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
            animation: "slide_from_bottom",
          }}
        />

        <Stack.Screen
          name="postear"
          options={{
            headerStyle: { backgroundColor: theme.colors.card },
            headerTintColor: "black",
            headerTitleAlign: "center",
            headerTitle: () => (
              <Image
                source={require("@/assets/images/NOW-LOGO.png")}
                style={{
                  width: 120,
                  height: 110,
                  resizeMode: "contain",
                }}
              />
            ),
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
    );
  }
};

export { StackPersonalizado };

