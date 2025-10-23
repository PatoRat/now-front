import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const scheme = useColorScheme()

  return (
    <SafeAreaProvider>

      <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            statusBarStyle: scheme === 'dark' ? 'light' : 'dark',
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
      </ThemeProvider>

    </SafeAreaProvider>

  );
}
