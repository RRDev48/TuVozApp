import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, View } from "react-native";

interface EmergencySuccessModalProps {
  visible: boolean;
  onClose: () => void;
}

const EmergencySuccessModal = ({
  visible,
  onClose,
}: EmergencySuccessModalProps) => {
  const { transformText } = usePersonalization();

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
          <Ionicons name="checkmark-circle" size={120} color={colors.green} />
        </View>

        <CustomText style={styles.title}>
          {transformText("Información de emergencia guardada con éxito")}
        </CustomText>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.black,
    textAlign: "center",
    lineHeight: 28,
  },
});

export default EmergencySuccessModal;
