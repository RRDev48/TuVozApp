// React
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

// Componentes

// Constantes

// Modelos
import { ReminderOptionButtonProps } from "../../(models)/component.props";

//Hooks

// Servicios

// Acciones

// Visuales
import { colors } from "@/src/app/design-system/themes/globalColors-theme";

const styles = StyleSheet.create({
  optionButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
  },

  optionText: {
    color: colors.blue,
    fontWeight: "bold",
  },

  selectedOption: {
    backgroundColor: colors.blue,
  },

  selectedOptionText: {
    color: "white",
  },
});

/**
 * ReminderOptionButton
 * --------------------
 * Botón reutilizable para seleccionar una opción de recordatorio
 * dentro del modal de recordatorios (por ejemplo: "5 minutos antes").
 *
 * Props:
 * - label: texto visible para el usuario.
 * - value: valor interno asociado a la opción (se envía al callback).
 * - isSelected: indica si esta opción está actualmente seleccionada.
 * - onPress: callback que se ejecuta al pulsar, recibiendo `value`.
 */
export const ReminderOptionButton = ({
  label,
  value,
  isSelected,
  onPress,
}: ReminderOptionButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.optionButton, isSelected && styles.selectedOption]}
      onPress={() => onPress(value)}
    >
      <Text
        style={[
          styles.optionText,
          isSelected ? styles.selectedOptionText : null,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
