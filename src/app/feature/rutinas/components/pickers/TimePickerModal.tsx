// React
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// Componentes
import { TimeInputField } from "./TimeInputField";
// Constantes

// Modelos
import { RoutineTimeModalProps } from "../../(models)/component.props";

// Hooks
import { useTimePickerValidation } from "../../(hooks)/useTimePickerValidation";

// Servicios

// Acciones

// Visuales
import { addTaskStyles } from "@/src/app/design-system/styles/tasks-Styles";

/**
 * TimePickerModal
 * ---------------
 * Modal que permite definir si una tarea se realiza en cualquier
 * momento del día o dentro de un rango horario específico.
 *
 * Responsabilidades:
 * - Mostrar un interruptor (Switch) para activar/desactivar el rango horario.
 * - Cuando el rango está activo, permitir introducir hora de inicio y fin
 *   validando el formato y la coherencia (inicio < fin).
 * - Devolver al padre las horas seleccionadas mediante `onTimeSelected`.
 * - Cerrar el modal solo si las horas son válidas.
 */
export const TimePickerModal = ({
  visible,
  onClose,
  onTimeSelected,
}: RoutineTimeModalProps) => {
  // const { formatText } = usePersonalization();
  // Hook que centraliza el estado y la validación de las horas.
  // Proporciona:
  // - startTime / endTime: valores y flags de error para cada campo.
  // - isSwitchEnabled: indica si se está usando un rango horario específico.
  // - handleTimeChange: actualiza la hora de inicio o fin.
  // - toggleSwitch: activa/desactiva el uso de rango horario.
  // - validateBeforeClose: función que valida ambas horas antes de cerrar.
  const {
    startTime,
    endTime,
    isSwitchEnabled,
    handleTimeChange,
    toggleSwitch,
    validateBeforeClose,
  } = useTimePickerValidation();

  // Maneja el cierre del modal desde el botón "Cerrar":
  // - Oculta el teclado.
  // - Valida las horas si el rango está activo.
  // - Si la validación falla, mantiene el modal abierto.
  // - Si no hay errores, calcula horas finales por defecto y
  //   llama a `onTimeSelected` antes de cerrar el modal.
  const handleClose = () => {
    Keyboard.dismiss();

    if (!validateBeforeClose()) {
      return;
    }

    const finalStartTime = startTime.value || "00:00";
    const finalEndTime = endTime.value || "23:59";

    onTimeSelected(finalStartTime, finalEndTime);
    onClose();
  };

  return (
    // Modal deslizante que se muestra encima del contenido actual.
    <Modal transparent={true} visible={visible} animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Permite cerrar el teclado al tocar fuera del contenido del modal. */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={addTaskStyles.overlay}>
            {/* Evita que el toque sobre el contenido cierre el teclado/modal. */}
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={addTaskStyles.sharedModalContainer}>
                {/* Texto resumen que indica el comportamiento actual:
                    - Si el switch está activo y hay horas válidas, muestra el rango.
                    - Si no, indica que se puede hacer en cualquier momento del día. */}
                <Text style={addTaskStyles.timePickerTitle}>
                  {isSwitchEnabled && startTime.value && endTime.value
                    ? `Hacerlo desde las ${startTime.value} hasta las ${endTime.value}`
                    : "Hacerlo en cualquier momento del día"}
                </Text>

                {/* Sección con el interruptor para activar/desactivar el rango horario. */}
                <View style={addTaskStyles.switchContainer}>
                  <View style={addTaskStyles.switchTextContainer}>
                    <Text style={addTaskStyles.switchTitleLabel}>
                      {"Hora Especificada"}
                    </Text>
                    <Text style={addTaskStyles.switchSubTitleLabel}>
                      {"Fijar un rango de hora para hacerlo"}
                    </Text>
                  </View>

                  <Switch
                    onValueChange={toggleSwitch}
                    value={isSwitchEnabled}
                    style={addTaskStyles.switch}
                  />
                </View>

                {/* Cuando el switch está activo, se muestran los campos de rango horario. */}
                {isSwitchEnabled && (
                  <View style={addTaskStyles.timePickerContainer}>
                    <Text style={addTaskStyles.timePickerPeriodText}>
                      {"Periodo de tiempo"}
                    </Text>

                    {/* Campo de hora de inicio del rango. */}
                    <TimeInputField
                      label={"Desde:"}
                      value={startTime.value}
                      error={startTime.error}
                      placeholder="00:00"
                      onChangeText={(text) => handleTimeChange(text, "start")}
                    />

                    {/* Campo de hora de fin del rango. */}
                    <TimeInputField
                      label={"Hasta:"}
                      value={endTime.value}
                      error={endTime.error}
                      placeholder="23:59"
                      onChangeText={(text) => handleTimeChange(text, "end")}
                    />
                  </View>
                )}

                {/* Botón para validar y cerrar el modal aplicando el rango (si es válido). */}
                <TouchableOpacity
                  onPress={handleClose}
                  style={addTaskStyles.closeWhitTextButton}
                >
                  <Text style={addTaskStyles.closeWhitTextButtonText}>
                    {"Cerrar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default TimePickerModal;
