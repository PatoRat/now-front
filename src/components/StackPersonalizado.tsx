import { Stack } from "expo-router";
import { Image } from "react-native";
import { useAuth } from "../hooks/auth-hooks";
import { useTheme } from "../hooks/theme-hooks";

const StackPersonalizado = () => {
	const { isLogged, isFetching } = useAuth();
	const { theme } = useTheme();

	return (
		<Stack screenOptions={{
			headerShown: false,
			statusBarStyle: "light",
			contentStyle: { backgroundColor: theme.colors.background },
		}}>

			<Stack.Protected guard={isFetching}>
				<Stack.Screen
					name="esperar"
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
			</Stack.Protected>

			<Stack.Protected guard={isLogged && !isFetching}>
				<Stack.Screen
					name="(tabs)"
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
			</Stack.Protected>

			<Stack.Protected guard={!isLogged && !isFetching}>
				<Stack.Screen
					name="(auth)"
					options={{
						headerShown: false,
						animation: "slide_from_bottom",
						contentStyle: { backgroundColor: theme.colors.background },
					}}
				/>
			</Stack.Protected>

		</Stack>
	);
};

export { StackPersonalizado };

