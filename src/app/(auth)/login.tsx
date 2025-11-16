import { ThemeColors } from "@/scripts/types";
import { useTheme } from "@/src/hooks/useTheme";
import { Login } from "@/src/screens/Login";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginIndex() {
	const { theme } = useTheme();
	const styles = stylesFn(theme.colors);

	return (
		<SafeAreaView style={styles.pestaña}>
			<Login />
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