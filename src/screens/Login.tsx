import { useAuth } from "@/src/hooks/auth-hooks";
import { useTheme } from "@/src/hooks/theme-hooks";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
	Image,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	useWindowDimensions,
	View,
} from "react-native";
import CustomAlert from "../components/CustomAlert";
import { useAlertState } from "../hooks/alert-hooks";

const Login = () => {
	const router = useRouter();
	const { login } = useAuth();
	const { theme } = useTheme();
	const { width, height } = useWindowDimensions();
	const styles = stylesFn(theme, width, height);

	const [email, setEmail] = useState("");
	const [contrasenia, setContrasenia] = useState("");

	const { visible, mensaje, success } = useAlertState();

	const onLogin = async () => {
		try {
			await login.mutateAsync({ email, contrasenia }); //para que tire errores

		} catch (error) {
			// console.log("LLEGO HASTA ACA, login");
			// console.error("Ocurrio un error: ", error);
			mensaje.set(`Ocurrio un error: ${error}`);
			success.set(false);
			visible.set(true);
		}
	}

	const registrar = () => router.push({ pathname: "../(auth)/register" });

	return (
		<View style={styles.container}>
			<ScrollView
				contentContainerStyle={{ paddingVertical: 40 }}
				keyboardShouldPersistTaps="handled"
			>

				<View style={styles.card}>
					<Image
						source={require("@/assets/images/NOW-LOGO.png")}
						style={styles.logo}
						resizeMode="contain"
					/>
					<Text style={styles.title}>Iniciar sesión</Text>
					<Text style={styles.subtitle}>Accedé a tu cuenta para continuar</Text>

					{/* Email */}
					<TextInput
						style={styles.input}
						placeholder="Correo electrónico"
						placeholderTextColor="#aaa"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
					/>

					{/* Password */}
					<TextInput
						style={styles.input}
						placeholder="Contraseña"
						placeholderTextColor="#aaa"
						value={contrasenia}
						onChangeText={setContrasenia}
						secureTextEntry
					/>

					{/* Botón Entrar */}
					<Pressable style={styles.btnPrimary} onPress={onLogin} disabled={login.isPending}>
						<Text style={styles.btnPrimaryText}>
							{login.isPending ? "Entrando" : "Entrar"}
						</Text>
					</Pressable>

					{/* Registrar */}
					<Pressable onPress={registrar} style={styles.registerLink}>
						<Text style={styles.registerHighlight}>
							¿No tenés cuenta? Registrarse
						</Text>
					</Pressable>
				</View>

			</ScrollView>
			{/* Alert */}
			<CustomAlert
				visible={visible.get()}
				message={mensaje.get()}
				isSuccessful={success.get()}
				onClose={() => visible.set(false)}
			/>
		</View>
	);
};

export { Login };

const stylesFn = (theme: any, width: number, height: number) => {
	const scale = Math.min(width / 400, 1.3);

	return StyleSheet.create({
		container: {
			flex: 1,
			// justifyContent: "center",
			alignItems: "center",
			backgroundColor: theme.colors.background,
			paddingHorizontal: 26 * scale,
		},

		logo: {
			width: 240 * scale,
			height: 110 * scale,
			marginBottom: 30 * scale,
			alignSelf: "center",
		},

		card: {
			width: width * 0.8,          // Igual que Register
			// height: height * 0.75,       // Igual que Register
			minHeight: height * 0.75,
			backgroundColor: theme.colors.card,
			borderRadius: 26 * scale,
			padding: 32 * scale,
			elevation: 7,
			marginTop: height * 0.025,   // Igual que Register
			justifyContent: "center",
		},

		title: {
			fontSize: 32 * scale,
			fontWeight: "800",
			color: theme.colors.text,
			textAlign: "center",
			marginBottom: 10 * scale,
		},

		subtitle: {
			fontSize: 18 * scale,
			color: "#888",
			textAlign: "center",
			marginBottom: 28 * scale,
		},

		input: {
			borderWidth: 1,
			backgroundColor: theme.colors.background,
			borderColor: theme.colors.border,
			borderRadius: 16 * scale,
			paddingVertical: 14 * scale,
			paddingHorizontal: 18 * scale,
			fontSize: 20 * scale,
			color: theme.colors.text,
			marginBottom: 16 * scale,
		},

		btnPrimary: {
			backgroundColor: "#3B82F6",
			borderRadius: 16 * scale,
			paddingVertical: 16 * scale,
			alignItems: "center",
			marginTop: 11 * scale,
			marginBottom: 14 * scale,
		},

		btnPrimaryText: {
			color: "#fff",
			fontSize: 20 * scale,
			fontWeight: "bold",
		},

		registerLink: {
			width: "100%",
			marginTop: 11 * scale,
		},

		registerHighlight: {
			color: "#3B82F6",
			fontWeight: "700",
			fontSize: 18 * scale,
			textAlign: "center",
		},
	});
};
