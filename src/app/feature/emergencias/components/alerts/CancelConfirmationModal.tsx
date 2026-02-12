import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CancelConfirmationModalProps } from "../../(models)/modal.props";

const CancelConfirmationModal = ({
  visible,
  onConfirm,
  onCancel,
}: CancelConfirmationModalProps) => {
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
      color: themedColors.secondary,
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
          <Image
            source={require("@/src/app/assets/gif/alerta.gif")}
            style={styles.gifImage}
          />
        </View>

        <Text style={styles.title}>
          {transformText("Desea cancelar la configuración?")}
        </Text>

        {/* Botones */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.confirmButtonText}>{transformText("Sí")}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>{transformText("No")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CancelConfirmationModal;
