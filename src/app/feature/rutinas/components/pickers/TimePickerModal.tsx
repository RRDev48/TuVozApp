// React
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
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

  timePickerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: colors.blue,
  },

  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  switchTextContainer: {
    flex: 1,
    marginTop: 20,
  },

  switchTitleLabel: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.blue,
  },

  switchSubTitleLabel: {
    fontSize: 14,
    color: colors.blue,
    marginBottom: 5,
  },

  switch: {
    marginLeft: 10,
  },

  timePickerContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },

  timePickerPeriodText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
    color: colors.blue,
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
          <View style={styles.overlay}>
            ;
            {/* Evita que el toque sobre el contenido cierre el teclado/modal. */}
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.sharedModalContainer}>
                {/* Texto resumen que indica el comportamiento actual:
                    - Si el switch está activo y hay horas válidas, muestra el rango.
                    - Si no, indica que se puede hacer en cualquier momento del día. */}
                <Text style={styles.timePickerTitle}>
                  {isSwitchEnabled && startTime.value && endTime.value
                    ? `Hacerlo desde las ${startTime.value} hasta las ${endTime.value}`
                    : "Hacerlo en cualquier momento del día"}
                </Text>

                {/* Sección con el interruptor para activar/desactivar el rango horario. */}
                <View style={styles.switchContainer}>
                  <View style={styles.switchTextContainer}>
                    <Text style={styles.switchTitleLabel}>
                      {"Hora Especificada"}
                    </Text>
                    <Text style={styles.switchSubTitleLabel}>
                      {"Fijar un rango de hora para hacerlo"}
                    </Text>
                  </View>

                  <Switch
                    onValueChange={toggleSwitch}
                    value={isSwitchEnabled}
                    style={styles.switch}
                  />
                </View>

                {/* Cuando el switch está activo, se muestran los campos de rango horario. */}
                {isSwitchEnabled && (
                  <View style={styles.timePickerContainer}>
                    <Text style={styles.timePickerPeriodText}>
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
                  style={styles.closeWhitTextButton}
                >
                  <Text style={styles.closeWhitTextButtonText}>{"Cerrar"}</Text>
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
