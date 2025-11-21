import { useAuth } from "@/src/hooks/auth-hooks";
import { useTheme } from "@/src/hooks/theme-hooks";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
	useWindowDimensions,
} from "react-native";

const Register = () => {
	const router = useRouter();
	const { registrarse } = useAuth();
	const { theme } = useTheme();
	const { width, height } = useWindowDimensions();
	const styles = stylesFn(theme, width, height);

	const [nombre, setNombre] = useState("");
	const [email, setEmail] = useState("");
	const [contrasenia, setContrasenia] = useState("");
	const [confirmarPsw, setPswConfirm] = useState("");
	const [numeroAvatar] = useState(1);


	const onRegister = async () => {

		try {
			if (!(contrasenia === confirmarPsw)) {
				console.error("Las contraseñas deben coincidir");
				{/* Poner algun componente bonito de animacion que haga el Alert */ }
			}
			else {
				registrarse.mutate({ nombre, email, contrasenia, numeroAvatar });
			}

		} catch (error) {
			console.error("Ocurrio un error: ", error);
			{/* Poner algun componente bonito de animacion que haga el Alert */ }
		}

	};

	// const volverLogin = () => router.push({ pathname: "../(auth)/login" });
	const volverLogin = () => router.back();

	return (
		<View style={styles.container}>
			<View style={styles.card}>
				<Text style={styles.title}>Crear cuenta</Text>

				<TextInput
					placeholder="Nombre completo"
					placeholderTextColor="#aaa"
					value={nombre}
					onChangeText={setNombre}
					style={styles.input}
				/>
				<TextInput
					placeholder="Email"
					placeholderTextColor="#aaa"
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					style={styles.input}
				/>
				<TextInput
					placeholder="Contraseña"
					placeholderTextColor="#aaa"
					value={contrasenia}
					onChangeText={setContrasenia}
					secureTextEntry
					style={styles.input}
				/>
				<TextInput
					placeholder="Confirmar contraseña"
					placeholderTextColor="#aaa"
					value={confirmarPsw}
					onChangeText={setPswConfirm}
					secureTextEntry
					style={styles.input}
				/>

				{/** Habría que meter un selector para elegir el avatar, o por defecto le asignamos uno */}

				<Pressable onPress={onRegister} style={styles.button} disabled={registrarse.isPending}>
					<Text style={styles.buttonText}>
						{registrarse.isPending ? "Creando cuenta..." : "Registrarme"}
					</Text>
				</Pressable>

				<Pressable onPress={volverLogin} style={styles.registerLink}>
					<Text style={styles.registerHighlight}>¿Ya tenés cuenta? Iniciá sesión</Text>
				</Pressable>
			</View>
		</View>
	);
};

export { Register };

const stylesFn = (theme: any, width: number, height: number) => {
	const scale = Math.min(width / 400, 1.3);

	return StyleSheet.create({
		container: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: theme.colors.background,
			paddingHorizontal: 26 * scale,
		},

		card: {
			width: width * 0.8,          // 80% del ancho
			height: height * 0.75,        // 80% del alto
			backgroundColor: theme.dark ? "#1E1E1E" : "#fff",
			borderRadius: 26 * scale,
			padding: 32 * scale,
			elevation: 7,
			marginTop: height * 0.025,    // ⭐ agrega espacio arriba (5% del alto)
			justifyContent: "center",
		},

		title: {
			fontSize: 32 * scale,
			fontWeight: "bold",
			color: theme.colors.text,
			textAlign: "center",
			marginBottom: 26 * scale,
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

		button: {
			backgroundColor: "#3B82F6",
			borderRadius: 16 * scale,
			paddingVertical: 16 * scale,
			alignItems: "center",
			marginTop: 11 * scale,
		},

		buttonText: {
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


