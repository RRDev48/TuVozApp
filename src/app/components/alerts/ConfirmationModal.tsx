import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ConfirmationModalProps } from "./(models)/alert.types";

const ConfirmationModal = ({
  visible,
  title,
  confirmText = "Sí",
  cancelText = "No",
  onConfirm,
  onCancel,
  showDelay = 0,
  confirmDelay = 0,
}: ConfirmationModalProps) => {
  const { transformText, getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (visible) {
      if (showDelay > 0) {
        const showTimer = setTimeout(() => {
          setShowModal(true);
        }, showDelay);
        return () => clearTimeout(showTimer);
      } else {
        setShowModal(true);
      }
    } else {
      setShowModal(false);
    }
  }, [visible, showDelay]);

  const handleConfirm = () => {
    if (confirmDelay > 0) {
      setTimeout(() => {
        onConfirm();
      }, confirmDelay);
    } else {
      onConfirm();
    }
  };

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
      visible={showModal}
      transparent={false}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Image
            source={require("@/src/app/assets/gif/alerta.gif")}
            style={styles.gifImage}
          />
        </View>

        <Text style={styles.title}>{transformText(title)}</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>
              {transformText(confirmText)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>
              {transformText(cancelText)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
