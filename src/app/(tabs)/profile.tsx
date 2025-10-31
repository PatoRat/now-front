import { ThemeColors } from "@/scripts/types";
import { useTheme } from "@/src/components/context-provider/Theme";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileGamified() {
  const { theme } = useTheme();
  const styles = stylesFn(theme.colors);

  // Datos del usuario (simulados)
  const user = {
    name: "Mateo Villanueva",
    email: "mateo@email.com",
    createdEvents: 3,
    attendedEvents: 5,
  };

  const maxEvents = 5;

  const renderBoxes = (count: number) => {
    const boxes = [];
    for (let i = 0; i < maxEvents; i++) {
      boxes.push(
        <View
          key={i}
          style={[
            styles.badgeBox,
            { opacity: i < count ? 1 : 0.3 },
          ]}
        >
          <Image
            source={require("@/assets/images/NOW-LOGO.png")}
            style={styles.badgeImage}
          />
        </View>
      );
    }
    return boxes;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Info del usuario con avatar */}
        <View style={styles.userRow}>
          <View style={styles.avatarBox}>
            <Image
              source={require("@/assets/images/NOW-LOGO.png")}
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>

        {/* Gamificación */}
        <View style={styles.gamification}>
          <Text style={styles.sectionTitle}>Eventos Creados</Text>
          <View style={styles.badgesRow}>{renderBoxes(user.createdEvents)}</View>

          <Text style={styles.sectionTitle}>Eventos Asistidos</Text>
          <View style={styles.badgesRow}>{renderBoxes(user.attendedEvents)}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const stylesFn = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      padding: 20,
    },
    userRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 30,
    },
    avatarBox: {
      width: 120,
      height: 120,
      backgroundColor: "#ccc",
      borderWidth: 4, // borde más grueso
      borderColor: "#888", // gris oscuro
      justifyContent: "center",
      alignItems: "center",
      marginRight: 20,
    },
    avatarImage: {
      width: 80,
      height: 80,
      resizeMode: "contain",
    },
    userInfo: {
      flex: 1,
    },
    name: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
    },
    email: {
      fontSize: 16,
      color: colors.text,
      marginTop: 5,
    },
    gamification: {
      marginTop: 10,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 10,
    },
    badgesRow: {
      flexDirection: "row",
      marginBottom: 20,
    },
    badgeBox: {
      width: 60,
      height: 60,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
    },
    badgeImage: {
      width: 40,
      height: 40,
      resizeMode: "contain",
    },
  });
