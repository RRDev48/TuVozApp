// React
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";

// Componentes

// Constantes

// Modelos
import { CalendarModalProps } from "../../(models)/component.props";

// Hooks

// Servicios

// Acciones

// Visuales
import { addTaskStyles } from "@/src/app/design-system/styles/tasks-Styles";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";

/**
 * DatePickerModal
 * ---------------
 * Modal que permite seleccionar una fecha usando el componente Calendar.
 *
 * Responsabilidades:
 * - Mostrar un calendario mensual para que el usuario elija un día.
 * - Marcar visualmente la fecha seleccionada.
 * - Devolver la fecha elegida al componente padre mediante `onDateSelect`.
 * - Cerrar el modal tras seleccionar una fecha o al pulsar el botón "Cerrar".
 */
export const DatePickerModal = ({
  visible,
  onClose,
  onDateSelect,
}: CalendarModalProps) => {
  // const { formatText } = usePersonalization();
  // Fecha seleccionada actualmente en formato YYYY-MM-DD.
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Maneja el toque en un día del calendario:
  // - actualiza el estado local con la nueva fecha.
  // - notifica al padre con la fecha seleccionada.
  // - cierra el modal.
  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    onDateSelect(day.dateString);
    onClose();
  };

  return (
    // Modal nativo que se muestra sobre la pantalla actual.
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={addTaskStyles.overlay}>
        <View style={addTaskStyles.calendarContainer}>
          <Text style={addTaskStyles.calendarTitle}>
            {"Selecciona una fecha"}
          </Text>

          {/* Calendario mensual interactivo.
              - onDayPress: maneja la selección de un día.
              - markedDates: resalta la fecha actualmente seleccionada.
              - theme: personaliza colores del calendario para ajustarse al diseño. */}
          <Calendar
            onDayPress={handleDayPress}
            markedDates={{
              [selectedDate ?? ""]: {
                selected: true,
                selectedColor: colors.blue,
              },
            }}
            theme={{
              selectedDayBackgroundColor: colors.blue,
              todayTextColor: colors.blue,
              arrowColor: colors.blue,
            }}
          />

          {/* Botón para cerrar el modal sin cambiar la fecha. */}
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

export default DatePickerModal;
