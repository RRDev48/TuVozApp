// React
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

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
import { addTaskStyles } from "@/src/app/design-system/styles/tasks-Styles";

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
      <View style={addTaskStyles.overlay}>
        <View style={addTaskStyles.sharedModalContainer}>
          <Text style={addTaskStyles.reminderTitle}>
            {"Establecer Recordatorio"}
          </Text>

          {/* Lista de opciones de recordatorio disponibles.
              Cada opción se muestra como un botón que puede estar seleccionado. */}
          <View style={addTaskStyles.optionsContainer}>
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
            <Text style={addTaskStyles.selectedOptionText}>
              {"Opción Seleccionada:"} {getSelectedLabel()}
            </Text>
          )}

          {/* Botón principal para confirmar y aplicar el recordatorio seleccionado. */}
          <TouchableOpacity
            onPress={handleSetReminder}
            style={addTaskStyles.setReminderButton}
          >
            <Text style={addTaskStyles.setReminderButtonText}>
              {"Establecer Recordatorio"}
            </Text>
          </TouchableOpacity>

          {/* Botón secundario para cerrar el modal sin aplicar cambios. */}
          <TouchableOpacity
            onPress={onClose}
            style={addTaskStyles.closeWhitTextButton}
          >
            <Text style={addTaskStyles.closeWhitTextButtonText}>
              {"Cerrar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ReminderPickerModal;
