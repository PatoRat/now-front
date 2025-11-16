import { useAuth } from "@/src/hooks/useAuth";
import { useTheme } from "@/src/hooks/useTheme";
import { Theme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
	Image,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	useWindowDimensions,
	View,
} from "react-native";

const Login = () => {
	const router = useRouter();
	const { login } = useAuth();
	const { theme } = useTheme();
	const { width } = useWindowDimensions();
	const styles = stylesFn(theme, width);

	const [email, setEmail] = useState("");
	const [contrasenia, setContrasenia] = useState("");

	const onLogin = async () => {
		try {
			login.mutate({ email, contrasenia });

		} catch (error) {
			console.error("Ocurrio un error: ", error);
			{/* Poner algun componente bonito de animacion que haga el Alert */ }
		}
	}

	const registrar = () => router.push({ pathname: "../(auth)/register" });

	return (
		<View style={styles.container}>

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
					<Text style={styles.registerText}>
						¿No tenés cuenta?{" "}
						<Text style={styles.registerHighlight}>Registrate</Text>
					</Text>
				</Pressable>
			</View>
		</View>
	);
};

export { Login };

const stylesFn = (theme: Theme, width: number) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.colors.background,
			justifyContent: "center",
			alignItems: "center",
			paddingHorizontal: 20,
		},
		logo: {
			width: 180,
			height: 80,
			marginBottom: 20,
			alignSelf: "center",
		},

		card: {
			width: "100%",
			maxWidth: 400,
			backgroundColor: theme.colors.card,
			borderRadius: 16,
			padding: 24,
			shadowColor: "#000",
			shadowOpacity: 0.15,
			shadowRadius: 6,
			shadowOffset: { width: 0, height: 3 },
			elevation: 5,
		},
		title: {
			fontSize: 24,
			fontWeight: "700",
			color: theme.colors.text,
			marginBottom: 4,
			textAlign: "center",
		},
		subtitle: {
			fontSize: 14,
			color: "#888",
			textAlign: "center",
			marginBottom: 24,
		},
		input: {
			backgroundColor: theme.colors.background,
			borderColor: theme.colors.border,
			borderWidth: 1,
			borderRadius: 10,
			paddingHorizontal: 14,
			paddingVertical: 12,
			color: theme.colors.text,
			fontSize: 15,
			marginBottom: 14,
		},
		btnPrimary: {
			backgroundColor: "#3B82F6",
			borderRadius: 10,
			paddingVertical: 14,
			alignItems: "center",
			marginTop: 4,
			marginBottom: 10,
		},
		btnPrimaryText: {
			color: "#fff",
			fontWeight: "700",
			fontSize: 16,
			letterSpacing: 0.4,
		},
		registerLink: {
			alignItems: "center",
			marginTop: 8,
		},
		registerText: {
			color: theme.colors.text,
			fontSize: 14,
		},
		registerHighlight: {
			color: "#3B82F6",
			fontWeight: "700",
		},
	});
