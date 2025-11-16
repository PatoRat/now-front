import { Drawer } from "@/src/components/animated/Drawer";
import Postear from "@/src/screens/Postear";
import {
	StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PostScreen() {

	return (
		<SafeAreaView style={styles.pestaña}>
			<Drawer />
			<Postear />

		</SafeAreaView>
	);
}


const styles = StyleSheet.create({
	pestaña: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	drawer: {
		top: 10,
	},
});
