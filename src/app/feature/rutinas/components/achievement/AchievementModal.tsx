import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import CustomText from "../../../common/CustomText";
import { useAutoClose } from "../../hooks/useAutoClose";
import { AchievementModalProps } from "../../models/component.props";

const { width } = Dimensions.get("window");

export const AchievementModal = ({
  visible,
  onClose,
  autoCloseDelay = 3000,
}: AchievementModalProps) => {
  const { transformText } = usePersonalization();

  useAutoClose(visible, onClose, autoCloseDelay);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          justifyContent: "center",
          alignItems: "center",
        },
        container: {
          backgroundColor: colors.white,
          borderRadius: 20,
          padding: 30,
          width: width * 0.85,
          alignItems: "center",
        },
        title: {
          fontSize: 24,
          fontWeight: "bold",
          color: colors.black,
          marginBottom: 20,
        },
        iconContainer: {
          width: 150,
          height: 150,
          backgroundColor: colors.blue,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20,
          shadowColor: colors.blue,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 20,
          elevation: 10,
        },
        percentage: {
          fontSize: 48,
          fontWeight: "bold",
          color: colors.black,
          marginBottom: 10,
        },
        message: {
          fontSize: 16,
          color: colors.gray,
          textAlign: "center",
          marginBottom: 30,
          lineHeight: 24,
        },
        button: {
          backgroundColor: colors.blue,
          paddingVertical: 15,
          paddingHorizontal: 40,
          borderRadius: 25,
          width: "100%",
        },
        buttonText: {
          color: colors.white,
          fontSize: 16,
          fontWeight: "600",
          textAlign: "center",
        },
      }),
    [],
  );

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
          <CustomText style={styles.title}>
            {transformText("¡Nuevo logro!")}
          </CustomText>

          {/* Icono representativo del logro alcanzado */}
          <View style={styles.iconContainer}>
            <Ionicons name="flag" size={80} color="#FFFFFF" />
          </View>

          {/* Porcentaje de progreso mostrado al usuario (actualmente valor fijo 100%) */}
          <CustomText style={styles.percentage}>100%</CustomText>

          {/* Mensaje motivacional que refuerza el logro alcanzado */}
          <CustomText style={styles.message}>
            {transformText("¡Felicidades! Sigan trabajando así de bien.")}
          </CustomText>

          {/* Botón de acción principal; actualmente solo cierra el modal.
              En el futuro podría navegar a una pantalla con todos los logros. */}
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <CustomText style={styles.buttonText}>
              {transformText("Ver todos los logros")}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
