import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import React, { useEffect, useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import OptimizedGif from "@/src/app/feature/common/OptimizedGif";

interface VerificationErrorModalProps {
  visible: boolean;
  title: string;
  message?: string;
  buttonText?: string;
  onClose: () => void;
}

const VerificationErrorModal = ({
  visible,
  title,
  message,
  buttonText = "Entendido",
  onClose,
}: VerificationErrorModalProps) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (visible) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [visible]);

  return (
    <Modal
      visible={showModal}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <OptimizedGif
            source={require("@/src/app/assets/gif/alerta.gif")}
            style={styles.gifImage}
          />
        </View>

        <Text style={styles.title}>{title}</Text>
        {message && <Text style={styles.message}>{message}</Text>}

        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
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
  gifImage: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: colors.gray,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 40,
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

export default VerificationErrorModal;
