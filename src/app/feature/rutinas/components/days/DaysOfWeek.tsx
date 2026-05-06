import i18n from "@/src/app/i18n";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import React, { useMemo } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "../../../common/CustomText";
import medalImages from "../../constants/medals";
import { useWeekDays } from "../../hooks/useWeekDays";
import { useWeekMedals } from "../../hooks/useWeekMedals";
import { DaysOfWeekProps } from "../../models/component.props";
import { Medal } from "../../models/routine.types";

export const DaysOfWeek = ({
  currentWeekStart,
  selectedDayIndex,
  setSelectedDayIndex,
  profileId,
}: DaysOfWeekProps) => {
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();
  const weekDates = useWeekDays(currentWeekStart);
  const medals = useWeekMedals(profileId, weekDates);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        medalImage: {
          width: 24,
          height: 24,
          alignSelf: "center",
        },
        daysContainer: {
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
          marginBottom: 20,
        },
        selectedDay: {
          width: "13%",
          padding: 10,
          borderRadius: 5,
          alignItems: "center",
          minWidth: 50,
        },
        dayText: {
          fontSize: 14,
          textAlign: "center",
          width: "100%",
        },
        numberDayText: {
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "center",
          width: "100%",
        },
      }),
    [themedColors],
  );

  return (
    <View style={styles.daysContainer}>
      {/*
        Recorre los días de la semana y pinta un botón por cada uno.
        Cada día puede estar seleccionado (se resalta con color) y
        opcionalmente mostrar una medalla si corresponde.
      */}
      {weekDates.map((day, index) => {
        const isSelected = index === selectedDayIndex;
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.selectedDay,
              {
                backgroundColor: isSelected ? colors.blue : colors.white,
                borderWidth: isSelected ? 2 : 0,
                borderColor: isSelected ? colors.blue : "transparent",
              },
            ]}
            onPress={() => setSelectedDayIndex(index)}
          >
            {/* Medalla asociada al día, si existe y no es "none" */}
            {medals[index] && medals[index] !== "none" && (
              <Image
                source={medalImages[medals[index] as Medal]}
                style={styles.medalImage}
              />
            )}
            {/* Nombre corto del día (lun, mar, mié, ...) */}
            <CustomText
              style={[
                styles.dayText,
                { color: isSelected ? "white" : "black" },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {day.toLocaleString(i18n.language === 'es' ? 'es-ES' : 'en-US', { weekday: "short" })}
            </CustomText>
            {/* Número de día del mes (1-31) */}
            <CustomText
              style={[
                styles.numberDayText,
                { color: isSelected ? "white" : "black" },
              ]}
              numberOfLines={1}
            >
              {day.getDate()}
            </CustomText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default DaysOfWeek;
