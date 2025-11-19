import { useTheme } from "@/src/hooks/theme-hooks";
import { Router } from "expo-router";
import React, { useRef } from "react";
import { View, useWindowDimensions } from "react-native";
import MapView from 'react-native-maps';
import PostFormContent, { stylesFn } from "./PostFormContent";



const PostInputsHandler = (props: { router: Router }) => {
	const { theme } = useTheme();
	const { width } = useWindowDimensions();
	const styles = stylesFn(theme, width);
	const mapRef = useRef<MapView | null>(null); // que hace esto



	return (
		<View style={styles.card}>
			<PostFormContent
				theme={theme}
				styles={styles}
				router={props.router}
			/>
		</View>
	);
};

export default PostInputsHandler;
