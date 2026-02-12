// React
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

// Componentes

// Constantes

// Modelos
import { AchievementModalProps } from "../../(models)/component.props";

// Hooks
import { useAutoClose } from "../../(hooks)/useAutoClose";

// Servicios

// Acciones

// Visuales
import { achievementModalStyles as styles } from "@/src/app/design-system/styles/achievementModal-Styles";
import { Ionicons } from "@expo/vector-icons";

/**
 * Props de configuración del modal de logro.
 * - visible: controla si el modal se muestra u oculta.
 * - onClose: función llamada cuando se cierra el modal (manual o automáticamente).
 * - autoCloseDelay: tiempo en milisegundos antes del autocierre (por defecto 3000ms).
 * Modal que informa al usuario cuando ha alcanzado un nuevo logro
 * dentro de una rutina. Se muestra sobre el contenido actual y
 * puede cerrarse manualmente (botón o back) o automáticamente
 * pasado un tiempo configurado con `autoCloseDelay`.
 */
export const AchievementModal: React.FC<AchievementModalProps> = ({
  visible,
  onClose,
  autoCloseDelay = 3000,
}) => {
  // const { formatText } = usePersonalization();
  // Inicia o reinicia el temporizador de autocierre cuando el modal está visible.
  // Si `visible` es false, el hook detiene el temporizador y no ejecuta `onClose`.
  useAutoClose(visible, onClose, autoCloseDelay);

  return (
    // Componente nativo de React Native que muestra el contenido como una ventana modal.
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
