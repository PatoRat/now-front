
import { ThemeColors } from "@/scripts/types";
import { useTheme } from "@/src/hooks/theme-hooks";
import Profile from "@/src/screens/Profile";
import { StyleSheet, View } from "react-native";

export default function DiscoverIndex() {
	const { theme } = useTheme();
	const styles = stylesFn(theme.colors);

	return (
		<View style={styles.pestaña}>
			<Profile />
		</View>
	);
}

const stylesFn = (colors: ThemeColors) => StyleSheet.create({
	pestaña: {
		flex: 1,
		backgroundColor: colors.background,
		justifyContent: "center",
		alignItems: "center",
	}
});