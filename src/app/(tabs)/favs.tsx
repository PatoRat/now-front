import { ThemeColors } from "@/scripts/types";
import { useTheme } from "@/src/hooks/theme-hooks";
import Favs from "@/src/screens/Favs";
import { StyleSheet, View } from "react-native";

export default function FavsIndex() {
	const { theme } = useTheme();
	const styles = stylesFn(theme.colors);

	return (
		<View style={styles.pestaña}>
			<Favs />
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