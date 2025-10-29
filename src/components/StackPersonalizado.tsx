import { useAuth } from "@/src/components/context-provider/Auth";
import { useTheme } from "@/src/components/context-provider/Theme";
import { Stack } from "expo-router";


const StackPersonalizado = () => {
    const { usuario, isLogged } = useAuth();
    const { theme } = useTheme();

    if (!isLogged) {
        return (
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" options={{
                    headerShown: false,
                    animation: "slide_from_bottom"
                }} />
            </Stack>
        )
    }
    else {
        return (
            <Stack
                screenOptions={{
                    statusBarStyle: theme.dark ? 'light' : 'dark'
                }}
            >

                <Stack.Screen name="(tabs)" options={{
                    headerShown: false,
                    animation: "slide_from_bottom"
                }} />

                <Stack.Screen name="postear" options={{
                    title: "Post",
                    animation: "slide_from_bottom"
                }} />

            </Stack>
        )
    }
}

export { StackPersonalizado };

