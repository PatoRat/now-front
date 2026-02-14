import { ThemeColors } from "@/scripts/types";
import { useTheme } from "@/src/hooks/theme-hooks";
import Map from "@/src/screens/Map";
import { StyleSheet, View } from "react-native";

export default function MapIndex() {
	const { theme } = useTheme();
	const styles = stylesFn(theme.colors);

	return (
		<View style={styles.pestaña}>
			<Map />
		</View>
	);
}

const stylesFn = (colors: ThemeColors) => StyleSheet.create({
	pestaña: {
	flex: 1,
	backgroundColor: colors.background,
}

});