import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useReminderPicker } from "../../hooks/useReminderPicker";
import { ReminderModalProps } from "../../models/component.props";
import { ReminderOptionButton } from "./ReminderOptionButton";

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

export const ReminderPickerModal = ({
  visible,
  onClose,
  onSetReminder,
  initialSelectedOption,
}: ReminderModalProps) => {
  const {
    selectedOption,
    setSelectedOption,
    options,
    getSelectedLabel,
    getSelectedOffsetMs,
  } = useReminderPicker(initialSelectedOption, visible);

  const handleSetReminder = () => {
    const offsetMs = getSelectedOffsetMs();
    if (offsetMs) {
      onSetReminder({ label: getSelectedLabel(), offsetMs: offsetMs });
    }
    onClose();
  };

  return (
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
