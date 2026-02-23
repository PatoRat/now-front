import { useTheme } from "@/src/hooks/theme-hooks";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
	const { theme } = useTheme();

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: theme.colors.card }}
			edges={['top']}
		>
			<Tabs
				screenOptions={{
					animation: "shift",
					headerTitleAlign: "center",
					tabBarActiveTintColor: "#52e4f5ff",
					tabBarStyle: {
						backgroundColor: theme.colors.background,
						borderTopWidth: 0,       // #################
						elevation: 0,             // arregla la linea blanca de las tabs
						shadowColor: "transparent", //############
					},
					tabBarInactiveBackgroundColor: theme.colors.background,
					tabBarActiveBackgroundColor: theme.colors.card,
					headerStyle: { backgroundColor: theme.colors.card },
					headerTintColor: "black",
					headerTitle: () => (
						<Image
							source={require("@/assets/images/NOW-LOGO.png")}
							style={{ width: 120, height: 110, resizeMode: "contain" }}
						/>
					),
				}}
				initialRouteName="login"
			>
				<Tabs.Screen
					name="login"
					options={{
						title: "Login",
						tabBarIcon: ({ color }) => (
							<FontAwesome size={28} name="lock" color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="register"
					options={{
						title: "Registrarse",
						tabBarIcon: ({ color }) => (
							<FontAwesome size={28} name="registered" color={color} />
						),
					}}
				/>
			</Tabs>
		</SafeAreaView>
	);
}
