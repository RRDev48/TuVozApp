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
import { ErrorModalProps } from "../models/alert.props";

const ErrorModal = ({
  visible,
  title,
  message,
  buttonText = "Entendido",
  onClose,
  showDelay = 0,
  autoCloseDelay = 0,
  onDismiss,
}: ErrorModalProps) => {
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

  useEffect(() => {
    if (showModal && autoCloseDelay > 0) {
      const autoCloseTimer = setTimeout(() => {
        if (onDismiss) onDismiss();
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(autoCloseTimer);
    }
  }, [showModal, autoCloseDelay, onClose, onDismiss]);

  const handleManualClose = () => {
    if (onDismiss) onDismiss();
    onClose();
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
      marginBottom: message ? 12 : 40,
    },
    message: {
      fontSize: 14,
      color: themedColors.text,
      textAlign: "center",
      lineHeight: 20,
      marginBottom: 40,
      opacity: 0.7,
    },
    button: {
      backgroundColor: colors.blue,
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
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
      onRequestClose={handleManualClose}
    >
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Image
            source={require("@/src/app/assets/gif/alerta.gif")}
            style={styles.gifImage}
          />
        </View>

        <Text style={styles.title}>{transformText(title)}</Text>
        {message && (
          <Text style={styles.message}>{transformText(message)}</Text>
        )}

        <TouchableOpacity style={styles.button} onPress={handleManualClose}>
          <Text style={styles.buttonText}>{transformText(buttonText)}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ErrorModal;
