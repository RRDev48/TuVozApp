import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAutoClose } from "../../hooks/useAutoClose";
import { AchievementModalProps } from "../../models/component.props";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    padding: 30,
    width: width * 0.85,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  iconContainer: {
    width: 150,
    height: 150,
    backgroundColor: "#00D4FF",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#00D4FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  percentage: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#5B5BFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: "100%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export const AchievementModal: React.FC<AchievementModalProps> = ({
  visible,
  onClose,
  autoCloseDelay = 3000,
}) => {
  useAutoClose(visible, onClose, autoCloseDelay);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Capa semitransparente que oscurece el fondo y centra el contenido del modal */}
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Título principal del modal de logro */}
          <Text style={styles.title}>{"¡Nuevo logro!"}</Text>

          {/* Icono representativo del logro alcanzado */}
          <View style={styles.iconContainer}>
            <Ionicons name="flag" size={80} color="#00D4FF" />
          </View>

          {/* Porcentaje de progreso mostrado al usuario (actualmente valor fijo 100%) */}
          <Text style={styles.percentage}>100%</Text>

          {/* Mensaje motivacional que refuerza el logro alcanzado */}
          <Text style={styles.message}>
            {"¡Felicidades! Sigan trabajando así"}
            {"\ n"}
            {"de bien."}
          </Text>

          {/* Botón de acción principal; actualmente solo cierra el modal.
              En el futuro podría navegar a una pantalla con todos los logros. */}
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{"Ver todos los logros"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
