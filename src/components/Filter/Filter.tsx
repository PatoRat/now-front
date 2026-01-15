import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
    Modal,
    Pressable,
    View,
    StyleSheet,
} from "react-native";
import { useTheme } from "@/src/hooks/theme-hooks";

type Props = {
    visible: boolean;
    onClose: () => void;
    children?: React.ReactNode;
};

export default function FilterModal({ visible, onClose, children }: Props) {
    const { theme } = useTheme();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Pressable onPress={onClose}>
                            <MaterialIcons name="close" size={28} color="#52E4F5" />
                        </Pressable>
                    </View>

                    {/* Contenido */}
                    <View style={{ flex: 1 }}>
                        {children}
                    </View>

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    container: {
        height: "90%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 8,
    },
});
