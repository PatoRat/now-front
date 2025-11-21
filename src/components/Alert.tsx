import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useTheme } from "@/src/hooks/theme-hooks";
import { Theme, useFocusEffect } from "@react-navigation/native";

interface CustomAlertProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error'; // default: success
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  message,
  type = 'success',
  onClose,
}) => {

	const { theme } = useTheme();
	const { width, height } = useWindowDimensions();
	const styles = stylesFn(theme, width, height);
  // Configuración según tipo
  const config = {
    success: {
      icon: '✅',
      iconBg: '#DFF6DD',
      buttonBg: '#28A745',
      buttonText: 'Aceptar',
      messageColor: theme.colors.text,
    },
    error: {
      icon: '❌',
      iconBg: '#F8D7DA',
      buttonBg: '#DC3545',
      buttonText: 'Cerrar',
      messageColor: theme.colors.text,
    },
  };
  const { icon, iconBg, buttonBg, buttonText, messageColor } = config[type];

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
          <Text style={[styles.message, { color: messageColor }]}>{message}</Text>
          <Pressable style={[styles.button, { backgroundColor: buttonBg }]} onPress={onClose}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const stylesFn = (theme: Theme, width: number, height: number) => {
  const scale = Math.min(width / 400, 1.3);

  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: theme.colors.card,
      padding: 25 * scale,
      borderRadius: 20 * scale,
      width: '80%',
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 10,
    },
    iconWrapper: {
      width: 60 * scale,
      height: 60 * scale,
      borderRadius: 30 * scale,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15 * scale,
    },
    icon: {
      fontSize: 28 * scale,
    },
    message: {
      marginBottom: 20 * scale,
      fontSize: 16 * scale,
      textAlign: 'center',
    },
    button: {
      paddingVertical: 10 * scale,
      paddingHorizontal: 25 * scale,
      borderRadius: 12 * scale,
    },
    buttonText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 16 * scale,
      textAlign: 'center',
    },
  });
};


export default CustomAlert;
