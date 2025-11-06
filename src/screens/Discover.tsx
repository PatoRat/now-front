import DATA from "@/assets/databases/data";
import { useTheme } from "@/src/components/context-provider/Theme";
import Post from "@/src/components/Post";
import { FontAwesome } from "@expo/vector-icons";
import { Theme } from "@react-navigation/native";
import { BlurView } from 'expo-blur';
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image, Linking, Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions
} from "react-native";

export default function Discover() {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const styles = stylesFn(theme, width);
  const router = useRouter();
  const [posts, setPosts] = useState(DATA);

  // Estado del pop-up
  const [selectedPost, setSelectedPost] = useState<null | (typeof DATA[number])>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const formatoFecha = (fecha : Date) => {
    if (!fecha) return "";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  // Para abrir el maps con el link y coordenadas (para cualquier app)
  const abrirEnMaps = (lat: number, lng: number) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}`,
      default: `https://www.google.com/maps?q=${lat},${lng}`,
    });
    Linking.openURL(url!);
  };
  const [currentIndex, setCurrentIndex] = useState(0);



  useFocusEffect(
    useCallback(() => {
      setPosts([...DATA]);
    }, [])
  );

  const nuevoPost = () => router.push({ pathname: "../postear" });
 // Para abrir pop-up
  const openPopup = (item: typeof DATA[number]) => {
    setSelectedPost(item);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };


  const closePopup = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSelectedPost(null));
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => openPopup(item)}>
            <Post
              titulo={item.titulo}
              descripcion={item.descripcion}
              imagenes={item.imagenes}
              fechaInicio={item.fechaInicio}
              fechaFin={item.fechaFin}
              ubicacion={item.ubicacion}
              direccion={item.ubicacion?.direccion}
              creador={item.creador}
            />
          </Pressable>
        )}
        contentContainerStyle={styles.listaContenido}
        showsVerticalScrollIndicator={false}
      />

      {/* Botón de nuevo post */}
      <View style={styles.botonContainer}>
        <Pressable onPress={nuevoPost}>
          <Image
            source={require("@/assets/images/new-post.png")}
            style={styles.nuevoPosteo}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      {/* Pop-up del post */}
      <Modal
        visible={!!selectedPost}
        transparent
        animationType="none"
        onRequestClose={closePopup}
      >
        <BlurView intensity={80} style={StyleSheet.absoluteFill}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closePopup} />
        </BlurView>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <Pressable style={styles.overlay} onPress={closePopup} />
        </Animated.View>

              {selectedPost && (
          <Animated.View
            style={[
              styles.popupContainer,
              {
                opacity: fadeAnim,
                transform: [
                    { translateY: fadeAnim.interpolate({ inputRange: [0,1], outputRange: [50,0] }) },
                    { scale: fadeAnim.interpolate({ inputRange: [0,1], outputRange: [0.8,1] }) },
                    { rotateY: fadeAnim.interpolate({ inputRange: [0,1], outputRange: ['15deg','0deg'] }) },
                  ]

              },
            ]}
          >
            {/* Carrusel de imágenes */}
            {selectedPost.imagenes?.length > 0 && (
              <>
                <FlatList
                  data={selectedPost.imagenes}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(_, i) => i.toString()}
                  onScroll={(e) => {
                    const index = Math.round(
                      e.nativeEvent.contentOffset.x / (width * 0.85)
                    );
                    setCurrentIndex(index);
                  }}
                  scrollEventThrottle={16}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        width: width * 0.85,
                        height: 200,
                        marginRight: 10,
                        borderRadius: 15,
                        overflow: "hidden",
                        shadowColor: "#000",
                        shadowOpacity: 0.3,
                        shadowRadius: 10,
                        elevation: 5,
                      }}
                    >
                      <Image
                        source={item}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                      />
                    </View>
                  )}
                  contentContainerStyle={{ paddingHorizontal: width * 0.075 / 2 }}
                />

                {/* Dots de paginación */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 10,
                    marginBottom: 5,
                  }}
                >
                  {selectedPost.imagenes.map((_, i) => (
                    <View
                      key={i}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        marginHorizontal: 4,
                        backgroundColor: i === currentIndex ? "#007AFF" : "#ccc",
                      }}
                    />
                  ))}
                </View>
              </>
            )}

            {/*  Título */}
            <Text style={styles.popupTitle}>{selectedPost.titulo}</Text>

            {/*  Descripción */}
            {!!selectedPost.descripcion && (
              <Text style={styles.popupDesc}>{selectedPost.descripcion}</Text>
            )}

            {/*  Fechas */}
            <Text style={styles.fechaText}>
              Inicio: {selectedPost.fechaInicio ? formatoFecha(selectedPost.fechaInicio) : ""}
            </Text>
            <Text style={styles.fechaText}>
              Fin: {selectedPost.fechaFin ? formatoFecha(selectedPost.fechaFin) : ""}
            </Text>
            {/* Creador del post */}
            <View style={{ alignItems: "center", marginTop: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold", color: theme.colors.text }}>
                Creado por: {selectedPost.creador}
              </Text>
            </View>


            {/*  Ubicación */}
              {selectedPost.ubicacion && (
                <Pressable
                  onPress={() =>
                    abrirEnMaps(
                      selectedPost.ubicacion.latitud,
                      selectedPost.ubicacion.longitud
                    )
                  }
                  android_ripple={{ color: "rgba(255,255,255,0.2)" }}
                  style={({ pressed }) => [
                    styles.direccionContainer,
                    pressed && { opacity: 0.6 },
                  ]}
                >
                  <FontAwesome
                    style={styles.direccionIcon}
                    size={24}
                    name="map-marker"
                    color="red"
                  />
                  <Text style={styles.direccionText}>
                    {selectedPost.ubicacion.direccion}
                  </Text>
                </Pressable>

              )}



            {/* Botón cerrar */}
            <Pressable onPress={closePopup} style={({pressed})=>[
              { position:'absolute', top:10, right:10, padding:10, borderRadius:20, backgroundColor:'rgba(0,0,0,0.3)' },
              pressed && { backgroundColor:'rgba(0,0,0,0.6)' }
            ]}>

              <FontAwesome name="close" size={20} color="white" />
            </Pressable>

          </Animated.View>
        )}

      </Modal>
    </View>
  );
}

const stylesFn = (theme: Theme, width: number) =>
  StyleSheet.create({
  listaContenido: {
    paddingBottom: 100,
  },
  botonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  nuevoPosteo: {
    width: Dimensions.get("window").width * 0.16,
    height: Dimensions.get("window").width * 0.16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  popupContainer: {
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.25,
    alignSelf: "center",
    width: "85%",
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8, 
  },

  popupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 10,
    textAlign: "center",
  },
  popupDesc: {
    color: theme.colors.text,
    fontSize: 15,
    marginBottom: 15,
    textAlign: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  carousel: {
    width: "100%",
    height: 200,
    marginBottom: 15,
  },
  popupImage: {
    width: Dimensions.get("window").width * 0.85,
    height: 200,
    borderRadius: 15,
    marginRight: 5,
  },
  direccionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  fechasContainer: {
    marginTop: 10,
  },
  fechaText: {
    color: theme.colors.text,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },

  direccionIcon: {
      marginRight: 6,
      fontSize: 16,
  },

  direccionText: {
      fontSize: 14,
      color: theme.colors.text,
      flexShrink: 1,
  },

});
