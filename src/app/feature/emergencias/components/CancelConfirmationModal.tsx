import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { Ionicons } from "@expo/vector-icons";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

interface CancelConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const CancelConfirmationModal = ({
  visible,
  onConfirm,
  onCancel,
}: CancelConfirmationModalProps) => {
  const { transformText } = usePersonalization();

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.container}>
        {/* Icono de advertencia */}
        <View style={styles.iconContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={120}
            color={colors.blue}
          />
        </View>

        <CustomText style={styles.title}>
          {transformText("Desea cancelar la configuración?")}
        </CustomText>

        {/* Botones */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <CustomText style={styles.confirmButtonText}>
              {transformText("Sí")}
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <CustomText style={styles.cancelButtonText}>
              {transformText("No")}
            </CustomText>
          </TouchableOpacity>
        </View>
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
    marginBottom: 40,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    paddingHorizontal: 20,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.green,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.red,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CancelConfirmationModal;
