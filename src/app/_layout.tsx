import { ThemeProvider } from '@/src/components/context-provider/Theme';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const scheme = useColorScheme();

  return (
    <SafeAreaProvider>

      <ThemeProvider>
        
      </ThemeProvider>

    </SafeAreaProvider>

  );
}
