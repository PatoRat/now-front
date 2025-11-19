import { useTheme } from "@/src/hooks/theme-hooks";
import React, { useState } from "react";
import { Pressable, Text } from "react-native";
import MapModal from "./MapModal";

type Props = {
	value?: { latitude: number; longitude: number } | null;
	direccion?: string | null;
	onChange: (coord: { latitude: number; longitude: number }, direccion: string) => void;
};

const PostMapSelector = ({ value, direccion, onChange }: Props) => {
	const { theme } = useTheme();
	const [mostrarMapa, setMostrarMapa] = useState(false);

	return (
		<>
			<Pressable
				style={{
					backgroundColor: theme.colors.background,
					borderColor: theme.colors.border,
					borderWidth: 1,
					borderRadius: 10,
					paddingHorizontal: 14,
					paddingVertical: 12,
				}}
				onPress={() => setMostrarMapa(true)}
			>
				<Text style={{ color: theme.colors.text }}>
					{value ? `Ubicación seleccionada: ${direccion}` : "Seleccionar ubicación"}
				</Text>
			</Pressable>

			{mostrarMapa && (
				<MapModal
					theme={theme}
					value={value}
					direccion={direccion}
					onSelect={onChange}
					onClose={() => setMostrarMapa(false)}
				/>
			)}
		</>
	);
};

export default PostMapSelector;
