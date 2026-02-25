import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ConfirmCancelModalProps } from "../../models/component.props";

export const ConfirmCancelModal = ({
  visible,
  onConfirm,
  onCancel,
  message = "Desea cancelar la\ncreación de la tarea?",
}: ConfirmCancelModalProps) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Círculo con icono de exclamación para resaltar que se trata de una acción importante. */}
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>!</Text>
          </View>
          {/* Mensaje de confirmación que puede personalizarse vía props. */}
          <Text style={styles.message}>{message}</Text>

          {/* Botones de acción: confirmar (Sí) o cancelar (No). */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>{"Sí"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>{"No"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 30,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    fontSize: 60,
    color: "#00CED1",
    fontWeight: "bold",
  },
  message: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.black,
    textAlign: "center",
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    width: "100%",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#90EE90",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FF0000",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
