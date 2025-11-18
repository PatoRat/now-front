import { AuthProvider } from '@/src/components/context-provider/AuthProvider';
import { ThemeProvider } from '@/src/components/context-provider/ThemeProvider';
import { StackPersonalizado } from '@/src/components/StackPersonalizado';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient();

export default function RootLayout() {

	return (
		<SafeAreaProvider>

			<QueryClientProvider client={queryClient}>
				<ThemeProvider>

					<AuthProvider>
						<StackPersonalizado />
					</AuthProvider>

				</ThemeProvider>
			</QueryClientProvider>
			
		</SafeAreaProvider>

	);
}
