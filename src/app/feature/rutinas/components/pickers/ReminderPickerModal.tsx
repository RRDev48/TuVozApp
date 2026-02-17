// React
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Componentes
import { ReminderOptionButton } from "./ReminderOptionButton";

// Constantes

// Modelos
import { ReminderModalProps } from "../../(models)/component.props";

// Hooks
import { useReminderPicker } from "../../(hooks)/useReminderPicker";

// Servicios

// Acciones

// Visuales
import { colors } from "@/src/app/design-system/themes/globalColors-theme";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.transparent,
    justifyContent: "center",
    alignItems: "center",
  },

  sharedModalContainer: {
    width: "80%",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },

  reminderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.blue,
  },

  optionsContainer: {
    width: "100%",
    marginBottom: 20,
  },

  selectedOptionText: {
    color: "white",
  },

  setReminderButton: {
    marginTop: 20,
    backgroundColor: colors.blue,
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },

  setReminderButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  closeWhitTextButton: {
    backgroundColor: colors.blue,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },

  closeWhitTextButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },
});

/**
 * ReminderPickerModal
 * -------------------
 * Modal que permite al usuario seleccionar una opción de recordatorio
 * para una tarea (por ejemplo: "5 minutos antes", "1 hora antes", etc.).
 *
 * Responsabilidades:
 * - Mostrar un conjunto de opciones de recordatorio reutilizando
 *   `ReminderOptionButton`.
 * - Mantener cuál opción está seleccionada actualmente.
 * - Traducir la opción seleccionada a un offset en milisegundos
 *   y devolverla al componente padre mediante `onSetReminder`.
 */
export const ReminderPickerModal = ({
  visible,
  onClose,
  onSetReminder,
  initialSelectedOption,
}: ReminderModalProps) => {
  // const { formatText } = usePersonalization();
  // Hook que centraliza el estado y la lógica de selección de recordatorios.
  // Devuelve:
  // - selectedOption: valor de la opción actual.
  // - setSelectedOption: función para cambiar la opción seleccionada.
  // - options: lista de opciones disponibles (label + value).
  // - getSelectedLabel / getSelectedOffsetMs: helpers para obtener
  //   la etiqueta visible y el offset en ms de la opción actual.
  const {
    selectedOption,
    setSelectedOption,
    options,
    getSelectedLabel,
    getSelectedOffsetMs,
  } = useReminderPicker(initialSelectedOption, visible);

  // Confirma la selección del recordatorio:
  // - Obtiene el offset en ms a partir de la opción seleccionada.
  // - Si existe, llama a `onSetReminder` con label y offset.
  // - Cierra el modal al finalizar.
  const handleSetReminder = () => {
    const offsetMs = getSelectedOffsetMs();
    if (offsetMs) {
      onSetReminder({ label: getSelectedLabel(), offsetMs: offsetMs });
    }
    onClose();
  };

  return (
    // Modal deslizante que aparece desde la parte inferior de la pantalla.
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sharedModalContainer}>
          <Text style={styles.reminderTitle}>{"Establecer Recordatorio"}</Text>

          {/* Lista de opciones de recordatorio disponibles.
              Cada opción se muestra como un botón que puede estar seleccionado. */}
          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <ReminderOptionButton
                key={option.value}
                label={option.label}
                value={option.value}
                isSelected={selectedOption === option.value}
                onPress={setSelectedOption}
              />
            ))}
          </View>

          {/* Texto informativo que muestra la opción actualmente seleccionada. */}
          {selectedOption && (
            <Text style={styles.selectedOptionText}>
              {"Opción Seleccionada:"} {getSelectedLabel()}
            </Text>
          )}

          {/* Botón principal para confirmar y aplicar el recordatorio seleccionado. */}
          <TouchableOpacity
            onPress={handleSetReminder}
            style={styles.setReminderButton}
          >
            <Text style={styles.setReminderButtonText}>
              {"Establecer Recordatorio"}
            </Text>
          </TouchableOpacity>

          {/* Botón secundario para cerrar el modal sin aplicar cambios. */}
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeWhitTextButton}
          >
            <Text style={styles.closeWhitTextButtonText}>{"Cerrar"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ReminderPickerModal;
