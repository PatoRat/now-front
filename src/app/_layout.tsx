import { AuthProvider } from '@/src/components/context-provider/Auth';
import { ThemeProvider } from '@/src/components/context-provider/Theme';
import { StackPersonalizado } from '@/src/components/StackPersonalizado';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {

  return (
    <SafeAreaProvider>

      <ThemeProvider>
        <AuthProvider>
          <StackPersonalizado />
        </AuthProvider>
      </ThemeProvider>

    </SafeAreaProvider>

  );
}
