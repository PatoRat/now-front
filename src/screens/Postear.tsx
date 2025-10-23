import PostInputsHandler from "@/src/components/PostInputsHandler";
import { useRouter } from "expo-router";
import {
    Dimensions,
    KeyboardAvoidingView,
    StyleSheet,
    View
} from "react-native";

export default function Postear() {
    const router = useRouter();

    return (

        <KeyboardAvoidingView style={styles.pestaña}>

            <View style={styles.content}>
                <PostInputsHandler router={router} />
            </View>

        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    pestaña: {
        flex: 1, width: "100%"
    },
    content: {
        width: Dimensions.get("window").width * 0.92,
        alignSelf: "center",
        paddingTop: 12,
        paddingBottom: 16,
        gap: 12,
    },
});
