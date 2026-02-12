// React
import React from "react";
import { Text, TextInput, View } from "react-native";

// Componentes

// Constantes

// Modelos
import { TimeInputFieldProps } from "../../(models)/component.props";

// Hooks

// Servicios

// Acciones

// Visuales
import { addTaskStyles } from "@/src/app/design-system/styles/tasks-Styles";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";

/**
 * TimeInputField
 * --------------
 * Campo de entrada reutilizable para capturar una hora en formato texto
 * (por ejemplo: "08:30"). Se utiliza en los formularios de creación/edición
 * de tareas para definir horarios de inicio y fin.
 *
 * Props:
 * - label: etiqueta descriptiva del campo ("Hora de inicio", "Hora de fin", ...).
 * - value: valor actual del campo en formato string.
 * - error: indica si el valor introducido no es válido (se muestra borde rojo y mensaje).
 * - placeholder: texto de ayuda que indica el formato esperado (por ejemplo "HH:MM").
 * - onChangeText: callback ejecutado cuando el usuario escribe en el campo.
 */
export const TimeInputField = ({
  label,
  value,
  error,
  placeholder,
  onChangeText,
}: TimeInputFieldProps) => {
  // const { formatText } = usePersonalization();
  return (
    // Contenedor del campo de hora con margen inferior para separar de otros campos.
    <View style={{ width: "100%", marginBottom: 15 }}>
      <View style={addTaskStyles.timeInputContainer}>
        <Text style={addTaskStyles.textInputLabel}>{label}</Text>
        <TextInput
          style={[
            addTaskStyles.textTimeInput,
            // Si hay error, se resalta el borde del input en rojo.
            error && {
              borderColor: "red",
              borderWidth: 2,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.blue}
          // Se usa teclado numérico para facilitar la introducción de horas.
          keyboardType="numeric"
          // Se limita a 5 caracteres para el formato HH:MM.
          maxLength={5}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      {/* Mensaje de error mostrado debajo del campo cuando la hora es inválida. */}
      {error && (
        <Text
          style={{
            color: "red",
            fontSize: 12,
            marginTop: 4,
            paddingLeft: 10,
          }}
        >
          {"Hora inválida (HH: 00-23, mm: 00-59)"}
        </Text>
      )}
    </View>
  );
};
