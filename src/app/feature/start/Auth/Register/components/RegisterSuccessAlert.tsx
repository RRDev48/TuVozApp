import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import React from "react";
import { Image, Modal, StyleSheet, Text, View } from "react-native";

interface RegisterSuccessAlertProps {
  visible: boolean;
  onClose: () => void;
}

const RegisterSuccessAlert = ({
  visible,
  onClose,
}: RegisterSuccessAlertProps) => {
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
        {/* GIF animado de verificado */}
        <Image
          source={require("../../../../../assets/gif/verificado.gif")}
          style={styles.gif}
          resizeMode="contain"
        />

        <Text style={styles.title}>Cuenta creada{"\n"}exitosamente!</Text>
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
});

export default RegisterSuccessAlert;
