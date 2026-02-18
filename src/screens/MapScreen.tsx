import { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import * as Location from "expo-location";

export default function MapScreen() {
	const [region, setRegion] = useState<Region | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			const { status } = await Location.requestForegroundPermissionsAsync();

			if (status !== "granted") {
				setLoading(false);
				return;
			}

			const location = await Location.getCurrentPositionAsync({});
			
			setRegion({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.01,
				longitudeDelta: 0.01,
			});

			setLoading(false);
		})();
	}, []);

	if (loading || !region) {
		return (
			<View style={styles.loader}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<MapView
			provider={PROVIDER_GOOGLE}
			style={styles.map}
			initialRegion={region}
			showsUserLocation
			showsMyLocationButton
			customMapStyle={minimalMapStyle}
		/>
	);
}

const styles = StyleSheet.create({
	map: {
		flex: 1,
	},
	loader: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

const minimalMapStyle = [
  // Oculta puntos de interés (negocios, bares, etc.)
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },

  // Oculta transporte
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },

  // Oculta edificios y construcciones
  {
    featureType: "landscape.man_made",
    stylers: [{ visibility: "off" }],
  },

  // Oculta áreas administrativas
  {
    featureType: "administrative",
    stylers: [{ visibility: "off" }],
  },

  // Mantiene solo calles
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ visibility: "on" }],
  },

  // Mantiene nombres de calles
  {
    featureType: "road",
    elementType: "labels.text",
    stylers: [{ visibility: "on" }],
  },
];


