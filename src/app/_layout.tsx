import { ThemeProvider } from '@/src/components/context-provider/Theme';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {

  return (
    <SafeAreaProvider>

      <ThemeProvider>
        <Stack>

          <Stack.Screen name="(tabs)" options={{
            headerShown: false,
            animation: "slide_from_bottom"
          }} />

          <Stack.Screen name="postear" options={{
            title: "Post",
            animation: "slide_from_bottom"
          }} />

        </Stack>
      </ThemeProvider>

    </SafeAreaProvider>

  );
}
