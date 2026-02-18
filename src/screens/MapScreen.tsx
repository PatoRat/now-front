import { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { useMapEvents } from "@/src/hooks/useMapEvents";
import { useAuth } from "../hooks/auth-hooks";


export default function MapScreen() {
    const [region, setRegion] = useState<Region | null>(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth(); // o como lo manejes

    const { data: eventos, isLoading } = useMapEvents({
        token,
        lat: region?.latitude ?? 0,
        lon: region?.longitude ?? 0,
    });

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
        >
            {eventos?.map((evento: any) => {
                if (!evento.ubicacion) return null;

                return (
                    <Marker
                        key={evento.id.toString()}
                        coordinate={{
                            latitude: evento.ubicacion.latitud,
                            longitude: evento.ubicacion.longitud,
                        }}
                        onPress={() => {
                            console.log("Pressed:", evento.titulo);
                        }}
                    >
                        <View style={styles.markerContainer}>
                            <View style={styles.markerDot} />
                        </View>
                    </Marker>
                );
            })}

        </MapView>
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
    markerContainer: {
        alignItems: "center",
        justifyContent: "center",
    },

    markerDot: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: "#52e4f5ff", // tu color activo
        borderWidth: 2,
        borderColor: "white",
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


