import { ThemeColors } from "@/scripts/types";
import { useTheme } from "@/src/hooks/useTheme";
import Discover from "@/src/screens/Discover";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DiscoverIndex() {
	const { theme } = useTheme();
	const styles = stylesFn(theme.colors);

	return (
		<SafeAreaView style={styles.pestaña}>
			<Discover />
		</SafeAreaView>
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