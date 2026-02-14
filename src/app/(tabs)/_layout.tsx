import { Drawer } from "@/src/components/animated/Drawer";
import { LikesProvider } from "@/src/components/context-provider/LikeContext";
import { useTheme } from "@/src/hooks/theme-hooks";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
	const { theme } = useTheme();

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: theme.colors.card }}
			edges={['top']}
		>
			<LikesProvider>
				<View style={{ flex: 1 }}>
					{/* Drawer superpuesto */}
					<Drawer />

					{/* Tabs principales */}
					<Tabs
						screenOptions={{
							animation: "shift",
							headerTitleAlign: "center",
							tabBarActiveTintColor: "#52e4f5ff",
							tabBarStyle: {
								backgroundColor: theme.colors.background,
								borderTopWidth: 0,
								elevation: 0,             
								shadowColor: "transparent",
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
						initialRouteName="index"
					>
						<Tabs.Screen
							name="favs"
							options={{
								title: "FAVS",
								tabBarIcon: ({ color }) => (
									<FontAwesome size={28} name="star" color={color} />
								),
							}}
						/>
						<Tabs.Screen
							name="index"
							options={{
								title: "DISCOVER",
								tabBarIcon: ({ color }) => (
									<FontAwesome size={28} name="search" color={color} />
								),
							}}
						/>
						<Tabs.Screen
							name="map"
							options={{
								title: "MAP",
								tabBarIcon: ({ color }) => (
									<FontAwesome size={28} name="map-marker" color={color} />
								),
							}}
						/>
						<Tabs.Screen
							name="profile"
							options={{
								title: "PROFILE",
								tabBarIcon: ({ color }) => (
									<FontAwesome size={28} name="male" color={color} />
								),
							}}
						/>
					</Tabs>
				</View>
			</LikesProvider>
		</SafeAreaView>
	);
}
