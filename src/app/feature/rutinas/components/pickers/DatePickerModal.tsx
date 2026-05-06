import i18n from "@/src/app/i18n";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import React, { useMemo, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import CustomText from "../../../common/CustomText";
import { CalendarModalProps } from "../../models/component.props";

export const DatePickerModal = ({
  visible,
  onClose,
  onDateSelect,
}: CalendarModalProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
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
        calendarContainer: {
          width: "90%",
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
        calendarTitle: {
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 10,
          color: themedColors.primary,
        },
        closeWhitTextButton: {
          backgroundColor: colors.red,
          padding: 10,
          borderRadius: 10,
          marginTop: 20,
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
            {i18n.t('selectDate')}
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
              {i18n.t('close')}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DatePickerModal;
