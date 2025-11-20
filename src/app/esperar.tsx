import {
    ActivityIndicator,
    StyleSheet,
    useWindowDimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import { useTheme } from "../hooks/theme-hooks";
import { Theme } from "@react-navigation/native";

export default function WaitScreen() {
    const { width } = useWindowDimensions();
	const { theme } = useTheme();
	const styles = stylesFn(theme, width);

    return (
        <SafeAreaView style={styles.pestaña}>
            <Image
                source={require("@/assets/images/NOW-LOGO.png")}
                style={{ width: 120, height: 110, resizeMode: "contain" }}
            />
        </SafeAreaView>
    );
}


const stylesFn = (theme: Theme, width: number) =>
    StyleSheet.create({
    pestaña: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background 
    },
    drawer: {
        top: 10,
    },
});