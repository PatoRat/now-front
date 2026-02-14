import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import * as Location from "expo-location";
import MapView, { Region, Marker } from "react-native-maps";
import { getEvents } from "../api/event.route";
import { PostType } from "@/scripts/types";


export default function MapScreen() {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [region, setRegion] = useState<Region | null>(null);
    const [loading, setLoading] = useState(true);
    const tokenAuth = null;
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchPosts = useCallback(async (regionData: Region) => {

        const { latitude, longitude, latitudeDelta } = regionData;
        const radius = (latitudeDelta * 111000) / 2;

        try {

            const eventos = await getEvents(
                tokenAuth,
                { lat: latitude, lon: longitude },
                0,
                radius
            );

            setPosts(eventos);

        } catch (err) {
            console.error("Error fetching events:", err);
            setPosts([]);
        }

    }, [tokenAuth]);



    const handleRegionChangeComplete = useCallback(
        (newRegion: Region) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                fetchPosts(newRegion);
            }, 500);
        },
        [fetchPosts]
    );
    useEffect(() => {
        (async () => {
            try {
                const { status } =
                    await Location.requestForegroundPermissionsAsync();

                if (status !== "granted") {
                    setLoading(false);
                    return;
                }

                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });

                const { latitude, longitude } = location.coords;

                const initialRegion = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };

                setRegion(initialRegion);
                fetchPosts(initialRegion);
            } catch (error) {
                console.error("Error obteniendo ubicación:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, [fetchPosts]);

    if (loading || !region) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={StyleSheet.absoluteFillObject}
                initialRegion={region}
                onRegionChangeComplete={handleRegionChangeComplete}
                customMapStyle={customMapStyle}
                showsUserLocation
                showsMyLocationButton
            >
                {posts.map((post) => (
                    <Marker
                        key={post.id}
                        coordinate={{
                            latitude: post.ubicacion.latitud,
                            longitude: post.ubicacion.longitud,
                        }}
                        title={post.titulo}
                        description={post.ubicacion.direccion}
                    />
                ))}
            </MapView>

        </View>
    );
}

const customMapStyle = [
    // Ocultar negocios y POIs
    {
        featureType: "poi",
        stylers: [{ visibility: "off" }],
    },

    // Ocultar atracciones específicas
    {
        featureType: "poi.attraction",
        stylers: [{ visibility: "off" }],
    },

    // Mantener estaciones de transporte
    {
        featureType: "transit.station",
        stylers: [{ visibility: "on" }],
    },

    // Mantener nombres de calles
    {
        featureType: "road",
        elementType: "labels",
        stylers: [{ visibility: "on" }],
    },

    // Estética dark tipo Uber
    {
        elementType: "geometry",
        stylers: [{ color: "#1d2c4d" }],
    },
    {
        elementType: "labels.text.fill",
        stylers: [{ color: "#8ec3b9" }],
    },
    {
        elementType: "labels.text.stroke",
        stylers: [{ color: "#1a3646" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#304a7d" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
];

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
