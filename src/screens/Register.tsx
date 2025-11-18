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
	const { width } = useWindowDimensions();
	const styles = stylesFn(theme, width);

	const [nombre, setNombre] = useState("");
	const [email, setEmail] = useState("");
	const [contrasenia, setContrasenia] = useState("");
	const [confirmarPsw, setPswConfirm] = useState("");
	const [numeroAvatar/*, setNumeroAvatar*/] = useState(0);


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
					placeholderTextColor={theme.colors.border}
					value={nombre}
					onChangeText={setNombre}
					style={styles.input}
				/>
				<TextInput
					placeholder="Email"
					placeholderTextColor={theme.colors.border}
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					style={styles.input}
				/>
				<TextInput
					placeholder="Contraseña"
					placeholderTextColor={theme.colors.border}
					value={contrasenia}
					onChangeText={setContrasenia}
					secureTextEntry
					style={styles.input}
				/>
				<TextInput
					placeholder="Confirmar contraseña"
					placeholderTextColor={theme.colors.border}
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

const stylesFn = (theme: any, width: number) =>
	StyleSheet.create({
		container: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: theme.colors.background,
			paddingHorizontal: 20,
		},
		card: {
			width: "100%",
			maxWidth: 400,
			backgroundColor: theme.dark ? "#1E1E1E" : "#fff",
			borderRadius: 20,
			padding: 24,
			elevation: 5,
		},
		title: {
			fontSize: 24,
			fontWeight: "bold",
			color: theme.colors.text,
			textAlign: "center",
			marginBottom: 20,
		},
		input: {
			borderWidth: 1,
			backgroundColor: theme.colors.background,
			borderColor: theme.colors.border,
			borderRadius: 12,
			paddingVertical: 10,
			paddingHorizontal: 14,
			fontSize: 16,
			color: theme.colors.text,
			marginBottom: 12,
		},
		button: {
			backgroundColor: "#3B82F6",
			borderRadius: 12,
			paddingVertical: 12,
			alignItems: "center",
			marginTop: 8,
		},
		buttonText: {
			color: "#fff",
			fontSize: 16,
			fontWeight: "bold",
		},
		registerHighlight: {
			color: "#3B82F6",
			fontWeight: "700",
		},
		registerLink: {
			alignItems: "center",
			marginTop: 8,
		},
	});
