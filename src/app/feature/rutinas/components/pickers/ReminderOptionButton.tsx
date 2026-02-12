// React
import React from "react";
import { Text, TouchableOpacity } from "react-native";

// Componentes

// Constantes

// Modelos
import { ReminderOptionButtonProps } from "../../(models)/component.props";

//Hooks

// Servicios

// Acciones

// Visuales
import { addTaskStyles } from "@/src/app/design-system/styles/tasks-Styles";

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
      style={[
        addTaskStyles.optionButton,
        isSelected && addTaskStyles.selectedOption,
      ]}
      onPress={() => onPress(value)}
    >
      <Text
        style={[
          addTaskStyles.optionText,
          isSelected ? addTaskStyles.selectedOptionText : null,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
