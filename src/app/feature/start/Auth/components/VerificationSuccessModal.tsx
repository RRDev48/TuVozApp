import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import React, { useEffect, useState } from "react";
import { Image, Modal, StyleSheet, Text, View } from "react-native";

interface VerificationSuccessModalProps {
  visible: boolean;
  title: string;
  message?: string;
  onClose: () => void;
  autoCloseDelay?: number;
  gifType?: "llave" | "verificado";
}

const VerificationSuccessModal = ({
  visible,
  title,
  message,
  onClose,
  autoCloseDelay = 3000,
  gifType = "verificado",
}: VerificationSuccessModalProps) => {
  const [showModal, setShowModal] = useState(false);

  const gifSource =
    gifType === "llave"
      ? require("@/src/app/assets/gif/llave.gif")
      : require("@/src/app/assets/gif/verificado.gif");

  useEffect(() => {
    if (visible) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [visible]);

  useEffect(() => {
    if (showModal && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [showModal, onClose, autoCloseDelay]);

  return (
    <Modal
      visible={showModal}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Image source={gifSource} style={styles.gifImage} />
        </View>

        <Text style={styles.title}>{title}</Text>
        {message && <Text style={styles.message}>{message}</Text>}
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
  },
});

export default VerificationSuccessModal;
