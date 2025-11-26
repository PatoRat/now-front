import { useTheme } from "@/src/hooks/theme-hooks";
import { Theme } from "@react-navigation/native";
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

type CustomAlertProps = {
	visible: boolean;
	message: string;
	isSuccessful?: boolean,
	onClose: () => void;
}
// recibe type y en base a eso llama una func u otra
const CustomAlert = ({
	visible,
	message,
	isSuccessful = true,
	onClose,
}: CustomAlertProps) => {

	const { theme } = useTheme();
	const { width } = useWindowDimensions();
	const scale = Math.min(width / 400, 1.3);

	const textoButton = isSuccessful ? "Aceptar" : "Cerrar";
	const icono = isSuccessful ? "✅" : "❌";

	const styles = stylesFn(theme, scale, isSuccessful);

	return (
		<Modal
			transparent
			animationType="fade"
			visible={visible}
			onRequestClose={onClose}
		>
			<View style={styles.overlay}>
				<View style={styles.container}>
					<View style={styles.iconWrapper}>
						<Text style={styles.icon}>{icono}</Text>
					</View>
					<Text style={styles.message}>{message}</Text>
					<Pressable style={styles.button} onPress={onClose}>
						<Text style={styles.textoButton}>{textoButton}</Text>
					</Pressable>
				</View>
			</View>
		</Modal>
	);
};

const stylesFn = (theme: Theme, scale: number, isSuccessful: boolean = true) => StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.4)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	container: {
		backgroundColor: theme.colors.card,
		padding: 25 * scale,
		borderRadius: 20 * scale,
		width: '80%',
		alignItems: 'center',
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 5 },
		shadowOpacity: 0.25,
		shadowRadius: 10,
		elevation: 10,
	},
	iconWrapper: {
		backgroundColor: isSuccessful ? '#DFF6DD' : '#F8D7DA',
		width: 60 * scale,
		height: 60 * scale,
		borderRadius: 30 * scale,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 15 * scale,
	},
	icon: {
		fontSize: 28 * scale,
	},
	message: {
		marginBottom: 20 * scale,
		fontSize: 16 * scale,
		textAlign: 'center',
		color: theme.colors.text
	},
	button: {
		backgroundColor: isSuccessful ? '#28A745' : '#DC3545',
		paddingVertical: 10 * scale,
		paddingHorizontal: 25 * scale,
		borderRadius: 12 * scale,
	},
	textoButton: {
		color: 'white',
		fontWeight: '600',
		fontSize: 16 * scale,
		textAlign: 'center',
	},
});


export default CustomAlert;
