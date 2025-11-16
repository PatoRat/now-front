import { Stack } from "expo-router";
import { Image } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

const StackPersonalizado = () => {
	const { isLogged, isFetching } = useAuth();
	const { theme } = useTheme();

	if (isFetching) {
		return (
			<Stack screenOptions={{
				headerShown: false,
				statusBarStyle: "light",
				contentStyle: { backgroundColor: theme.colors.background },
			}}>
				<Stack.Screen
					name="esperar"
					options={{
						headerShown: false,
						animation: "slide_from_bottom",
					}}
				/>
			</Stack>
		);
	}

	// console.log("Estas logged?:", isLogged);

	return (
		<Stack screenOptions={{
			headerShown: false,
			statusBarStyle: "light",
			contentStyle: { backgroundColor: theme.colors.background },
		}}>

			<Stack.Protected guard={isLogged}>
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

			<Stack.Protected guard={!isLogged}>
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

