import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import React from "react";
import { Image, Modal, StyleSheet, Text, View } from "react-native";

interface SuccessAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  onClose?: () => void;
}

const SuccessAlert = ({
  visible,
  title,
  message,
  onClose,
}: SuccessAlertProps) => {
  React.useEffect(() => {
    if (visible && onClose) {
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
        {/* GIF animado de llave */}
        <Image
          source={require("../../../../../assets/gif/llave.gif")}
          style={styles.gif}
          resizeMode="contain"
        />

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
  gif: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.black,
    textAlign: "center",
    lineHeight: 28,
  },
  message: {
    fontSize: 14,
    fontWeight: "400",
    color: "#666666",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 20,
  },
});

export default SuccessAlert;
