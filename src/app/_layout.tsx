import { AuthProvider } from '@/src/components/context-provider/Auth';
import { ThemeProvider } from '@/src/components/context-provider/Theme';
import { StackPersonalizado } from '@/src/components/StackPersonalizado';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient();

export default function RootLayout() {

  return (
    <SafeAreaProvider>

      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <StackPersonalizado />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>

    </SafeAreaProvider>

  );
}
