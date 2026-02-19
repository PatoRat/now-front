import { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Image } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { useMapEvents } from "@/src/hooks/useMapEvents";
import { useAuth } from "../hooks/auth-hooks";
import { avatarMap } from "@/assets/constants/avatarMap";
import PostPopUp from "../components/Post/PostPopUp";


export default function MapScreen() {
    const [loading, setLoading] = useState(true);
    const { token } = useAuth(); // o como lo manejes
    const calculateRadiusFromDelta = (latitudeDelta: number) => {
        // 1 grado latitud ≈ 111 km
        const radius = (latitudeDelta * 111) / 2;
        return Math.max(radius, 1); // mínimo 1km
    };
    const [region, setRegion] = useState<Region | null>(null);
    const [debouncedRegion, setDebouncedRegion] = useState<Region | null>(null);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);


    const radius = debouncedRegion
        ? calculateRadiusFromDelta(debouncedRegion.latitudeDelta)
        : 20;

    const { data: events } = useMapEvents({
        token,
        lat: debouncedRegion?.latitude ?? null,
        lon: debouncedRegion?.longitude ?? null,
        rangoMin: 0,
        rangoMax: radius,
    });

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                setLoading(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({});

            const initialRegion: Region = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            };

            setRegion(initialRegion);
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        if (!region) return;

        const timeout = setTimeout(() => {
            setDebouncedRegion(region);
        }, 500); // 500ms debounce

        return () => clearTimeout(timeout);
    }, [region]);


    if (loading || !region) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <>
            <MapView
                provider={PROVIDER_GOOGLE}
                onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
                style={styles.map}
                initialRegion={region}
                showsUserLocation
                showsMyLocationButton
                customMapStyle={minimalMapStyle}
            >
                {events?.map((event) => {
                    const { latitud, longitud } = event.ubicacion;
                    //console.log(region);

                    if (
                        latitud == null ||
                        longitud == null ||
                        typeof latitud !== "number" ||
                        typeof longitud !== "number"
                    ) {
                        return null;
                    }

                    return (
                        <Marker
                            key={event.id}
                            coordinate={{
                                latitude: latitud,
                                longitude: longitud,
                            }}
                            onPress={() => {
                                setSelectedPost(event);
                                setIsPopupVisible(true);
                            }}
                        >
                            <View style={styles.markerContainer}>

                                <Image
                                    source={avatarMap[event.numeroAvatar] ?? avatarMap[1]}
                                    style={styles.avatar}
                                />
                            </View>
                        </Marker>
                    );
                })}
            </MapView>
            <PostPopUp
                visible={isPopupVisible}
                post={selectedPost}
                onClose={() => {
                    setIsPopupVisible(false);
                    setSelectedPost(null);
                }}
            />
        </>
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
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 22,
        borderWidth: 3,
        borderColor: "white",
        backgroundColor: "#eee",

        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
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


