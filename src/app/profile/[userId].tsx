// src/screens/OtherProfile.tsx
import Post from "@/src/components/Post/Post";
import { useTheme } from "@/src/hooks/theme-hooks";
import { Theme } from "@react-navigation/native";
import { useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  LayoutAnimation,
  Image
} from "react-native";
import PostPopUp from "../../components/Post/PostPopUp";
import CustomAlert from "../../components/CustomAlert";
import { useAlertState } from "../../hooks/alert-hooks";
import { avatarMap } from "@/assets/constants/avatarMap";
import { useLocalSearchParams } from "expo-router";
import { useOtherProfile } from "../../hooks/useOtherProfile";

export default function OtherProfile() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const userIdNum = Number(userId);

  const { theme } = useTheme();
  const { width, height } = useWindowDimensions();
  const styles = createStyles(theme, width, height);

  const { visible, mensaje, success } = useAlertState();

  const [openVigentes, setOpenVigentes] = useState(false);
  const [openPasados, setOpenPasados] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { usuario, eventos, loading, error } = useOtherProfile({
    token: null, // acá poné tu token si lo tenés en el contexto
    userId: userIdNum
  });

  if (loading) return <Text>Cargando perfil...</Text>;

  const openPopup = (item: any) => {
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

  const toggleSection = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setter(prev => !prev);
  };

  const renderPost = (item: any) => {
    const imagenesMapeadas = item.imagenes?.map((img: { url: string }) => {
      if (!img.url) return null;
      let uri = img.url.startsWith("http") ? img.url.replace("localhost", "192.168.x.x") : img.url; // reemplazá IP si hace falta
      return { uri };
    }).filter(Boolean);

    return (
      <Post
        key={item.id}
        id={item.id}
        titulo={item.titulo ?? ""}
        descripcion={item.descripcion ?? ""}
        imagenes={imagenesMapeadas}
        fechaInicio={item.fechaInicio ? new Date(item.fechaInicio) : new Date()}
        fechaFin={item.fechaFin ? new Date(item.fechaFin) : new Date()}
        ubicacion={item.ubicacion ?? null}
        direccion={item.ubicacion?.direccion ?? ""}
        creador={item.creador}
        onSingleTap={() => openPopup(item)}
      />
    );
  };

  const now = new Date();
  const postsVigentes = eventos.filter(p => new Date(p.fechaFin) >= now);
  const postsPasados = eventos.filter(p => new Date(p.fechaFin) < now);

  const handleFollow = () => {
    mensaje.set("Función seguir aún no implementada");
    success.set(true);
    visible.set(true);
  };

  if (!usuario) return <Text>Cargando perfil...</Text>;

  return (
    <View style={styles.container}>
      {/* Info usuario */}
      <View style={styles.userRow}>
        <View style={styles.avatarBox}>
          <Image
            source={avatarMap[usuario.numeroAvatar ?? 1]}
            style={styles.avatarImage}
          />
        </View>
        <View style={styles.userInfo}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.name}>{usuario.nombre}</Text>
            <Pressable style={styles.followButton} onPress={handleFollow}>
              <Text style={styles.followButtonText}>Seguir</Text>
            </Pressable>
          </View>
          <Text style={styles.email}>{usuario.email}</Text>
        </View>
      </View>

      {/* Publicaciones */}
      <Text style={styles.name}>Publicaciones</Text>
      <ScrollView contentContainerStyle={styles.listaContenido} showsVerticalScrollIndicator={false}>
        {/* VIGENTES */}
        <Pressable style={styles.sectionHeader} onPress={() => toggleSection(setOpenVigentes)}>
          <Text style={styles.sectionHeaderText}>Eventos Futuros ({postsVigentes.length})</Text>
          <Text style={[styles.arrow, { transform: [{ rotate: openVigentes ? "90deg" : "0deg" }] }]}>▶</Text>
        </Pressable>
        {openVigentes && postsVigentes.map(renderPost)}

        {/* PASADOS */}
        <Pressable style={styles.sectionHeader} onPress={() => toggleSection(setOpenPasados)}>
          <Text style={styles.sectionHeaderText}>Eventos Pasados ({postsPasados.length})</Text>
          <Text style={[styles.arrow, { transform: [{ rotate: openPasados ? "90deg" : "0deg" }] }]}>▶</Text>
        </Pressable>
        {openPasados && postsPasados.map(renderPost)}
      </ScrollView>

      <PostPopUp visible={!!selectedPost} post={selectedPost} onClose={closePopup} />
      <CustomAlert
        visible={visible.get()}
        message={mensaje.get()}
        isSuccessful={success.get()}
        onClose={() => visible.set(false)}
      />
    </View>
  );
}

// ---- ESTILOS ----
const createStyles = (theme: Theme, width: number, height: number) => {
  const scale = Math.min(width / 400, 1.3);
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, paddingTop: 40 * scale, paddingHorizontal: 20 * scale },
    userRow: { flexDirection: "row", alignItems: "center", marginBottom: 30 * scale, width: "100%" },
    avatarBox: { width: 130 * scale, height: 130 * scale, borderRadius: 12 * scale, backgroundColor: "#eee", overflow: "hidden", marginRight: 20 * scale, borderWidth: 3, borderColor: "#bbb" },
    avatarImage: { width: "120%", height: "110%", position: 'absolute', resizeMode: "cover", top: -10, left: -10 },
    userInfo: { flex: 1 },
    name: { fontSize: 26 * scale, fontWeight: "bold", color: theme.colors.text },
    email: { fontSize: 16 * scale, color: "#666", marginTop: 4 * scale },
    sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 * scale, borderBottomWidth: 1, borderColor: "#ddd", marginTop: 15 * scale },
    sectionHeaderText: { fontSize: 18 * scale, fontWeight: "bold", color: theme.colors.text },
    arrow: { fontSize: 18 * scale, color: theme.colors.text },
    followButton: { backgroundColor: "#1DA1F2", paddingHorizontal: 15 * scale, paddingVertical: 5 * scale, borderRadius: 20 * scale, marginLeft: 10 * scale },
    followButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 * scale },
    listaContenido: { paddingBottom: 120 * scale, width: "100%" },
  });
};