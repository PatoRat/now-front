import {
    ActivityIndicator,
    StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WaitScreen() {

    return (
        <SafeAreaView style={styles.pestaña}>
            <ActivityIndicator />
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