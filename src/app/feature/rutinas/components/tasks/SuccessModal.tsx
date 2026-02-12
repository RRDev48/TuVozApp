// React
import React, { useEffect } from "react";
import { Animated, Modal, StyleSheet, Text, View } from "react-native";

// Componentes

// Constantes

// Modelos
import { SuccessModalProps } from "../../(models)/component.props";

// Hooks
import { useAutoClose } from "../../(hooks)/useAutoClose";

// Servicios

// Acciones

// Visuales
import { colors } from "@/src/app/design-system/themes/globalColors-theme";

/**
 * SuccessModal
 * ------------
 * Modal de feedback positivo que se muestra cuando una acción
 * se completa correctamente (por ejemplo, al crear una tarea).
 * Incluye una animación de escala y se cierra automáticamente
 * después de unos segundos.
 *
 * Props:
 * - visible: controla si el modal está visible.
 * - onClose: función llamada cuando el modal debe cerrarse
 *   (ya sea por autocierre o por limpieza externa).
 * - message: mensaje personalizado a mostrar (por defecto "Tarea creada con éxito!!").
 */
export const SuccessModal = ({
  visible,
  onClose,
  message = "Tarea creada con éxito!!",
}: SuccessModalProps) => {
  // const { formatText } = usePersonalization();
  // Valor animado que controla la escala (zoom) del contenido del modal.
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      // Cuando el modal se hace visible, se dispara una animación de resorte
      // que escala el contenido desde 0 hasta 1.
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      // Si deja de ser visible, se resetea la escala para futuras aperturas.
      scaleAnim.setValue(0);
    }
  }, [visible]);

  // Cierra automáticamente el modal después de 2 segundos cuando está visible.
  // Reutiliza el hook genérico para mantener la lógica de autocierre en un solo lugar.
  useAutoClose(visible, onClose, 2000);

  return (
    // Modal con fondo blanco semitransparente y animación de desvanecimiento.
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Círculo con marca de verificación que refuerza el mensaje de éxito. */}
          <View style={styles.checkCircle}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
          {/* Mensaje de éxito, personalizable mediante props. */}
          <Text style={styles.message}>{message}</Text>
        </Animated.View>
      </View>
    </Modal>
  );
};
// Estilos del overlay, contenedor, círculo de check y texto de mensaje.
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
    paddingHorizontal: 40,
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  checkMark: {
    fontSize: 50,
    color: "#00CED1",
    fontWeight: "bold",
  },
  message: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
    textAlign: "center",
  },
});
