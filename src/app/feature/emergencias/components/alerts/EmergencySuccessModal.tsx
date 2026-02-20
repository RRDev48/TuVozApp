import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import React from "react";
import { Image, Modal, StyleSheet, Text, View } from "react-native";
import { EmergencySuccessModalProps } from "../../models/modal.props";

const EmergencySuccessModal = ({
  visible,
  onClose,
}: EmergencySuccessModalProps) => {
  const { transformText, getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themedColors.background,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    iconContainer: {
      marginBottom: 30,
    },
    gifImage: {
      width: 120,
      height: 120,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: themedColors.text,
      textAlign: "center",
      lineHeight: 28,
    },
  });

  React.useEffect(() => {
    if (visible) {
      // Auto cerrar después de 3 segundos
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Icono de check animado */}
        <View style={styles.iconContainer}>
          <Image
            source={require("@/src/app/assets/gif/verificado.gif")}
            style={styles.gifImage}
          />
        </View>

        <Text style={styles.title}>
          {transformText("Información de emergencia guardada con éxito")}
        </Text>
      </View>
    </Modal>
  );
};

export default EmergencySuccessModal;
