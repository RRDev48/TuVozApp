import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import React, { useMemo } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "../../../common/CustomText";
import { useReminderPicker } from "../../hooks/useReminderPicker";
import { ReminderModalProps } from "../../models/component.props";
import { ReminderOptionButton } from "./ReminderOptionButton";

export const ReminderPickerModal = ({
  visible,
  onClose,
  onSetReminder,
  initialSelectedOption,
}: ReminderModalProps) => {
  const { getThemedColors, temaOscuro } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "center",
          alignItems: "center",
        },
        sharedModalContainer: {
          width: "80%",
          backgroundColor: themedColors.background,
          borderRadius: 16,
          padding: 20,
          alignItems: "center",
          borderWidth: 1.5,
          borderColor: themedColors.primary,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: temaOscuro ? 0.45 : 0.18,
          shadowRadius: 10,
          elevation: 8,
        },
        reminderTitle: {
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 20,
          color: themedColors.primary,
        },
        optionsContainer: {
          width: "100%",
          marginBottom: 20,
        },
        selectedOptionText: {
          color: themedColors.primary,
        },
        setReminderButton: {
          marginTop: 20,
          backgroundColor: themedColors.primary,
          padding: 10,
          borderRadius: 10,
          width: "100%",
          alignItems: "center",
        },
        setReminderButtonText: {
          color: themedColors.background,
          fontWeight: "bold",
        },
        closeWhitTextButton: {
          backgroundColor: colors.red,
          padding: 10,
          borderRadius: 10,
          marginTop: 10,
          width: "100%",
          alignItems: "center",
        },
        closeWhitTextButtonText: {
          color: colors.white,
          fontWeight: "bold",
        },
      }),
    [themedColors, temaOscuro],
  );
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
          <CustomText style={styles.reminderTitle}>
            {"Establecer Recordatorio"}
          </CustomText>

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
            <CustomText style={styles.selectedOptionText}>
              {"Opción Seleccionada:"} {getSelectedLabel()}
            </CustomText>
          )}

          {/* Botón principal para confirmar y aplicar el recordatorio seleccionado. */}
          <TouchableOpacity
            onPress={handleSetReminder}
            style={styles.setReminderButton}
          >
            <CustomText style={styles.setReminderButtonText}>
              {"Establecer Recordatorio"}
            </CustomText>
          </TouchableOpacity>

          {/* Botón secundario para cerrar el modal sin aplicar cambios. */}
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeWhitTextButton}
          >
            <CustomText style={styles.closeWhitTextButtonText}>
              {"Cerrar"}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ReminderPickerModal;
