import { useTheme } from "@/src/hooks/theme-hooks";
import { Router } from "expo-router";
import React from "react";
import { View, useWindowDimensions, StyleSheet } from "react-native";
import PostFormContent from "./PostFormContent";
import { Theme } from "@react-navigation/native";



const PostInputsHandler = (props: { router: Router }) => {
	const { theme } = useTheme();
	const { width } = useWindowDimensions();
	const styles = stylesFn(theme, width);



	return (
		<View style={styles.card}>
			<PostFormContent
				theme={theme}
				router={props.router}
			/>
		</View>
	);
};


const stylesFn = (theme: Theme, width: number) =>
	StyleSheet.create({

		// Contenedor de la tarjeta principal
		card: {
			backgroundColor: theme.colors.card,
			borderRadius: 12,
			top: 100,
			padding: 16,
			gap: 12,
			shadowColor: "#000",
			shadowOpacity: 0.2,
			shadowRadius: 4,
			shadowOffset: { width: 0, height: 2 },
			elevation: 3,
		},

	});

export default PostInputsHandler;
