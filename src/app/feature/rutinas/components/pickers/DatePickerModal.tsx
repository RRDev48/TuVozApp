import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import React, { useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import CustomText from "../../../common/CustomText";
import { CalendarModalProps } from "../../models/component.props";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.transparent,
    justifyContent: "center",
    alignItems: "center",
  },

  calendarContainer: {
    width: "90%",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },

  calendarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.blue,
  },

  closeWhitTextButton: {
    backgroundColor: colors.red,
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

export const DatePickerModal = ({
  visible,
  onClose,
  onDateSelect,
}: CalendarModalProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    onDateSelect(day.dateString);
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.calendarContainer}>
          <CustomText style={styles.calendarTitle}>
            {"Selecciona una fecha"}
          </CustomText>

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

export default DatePickerModal;
