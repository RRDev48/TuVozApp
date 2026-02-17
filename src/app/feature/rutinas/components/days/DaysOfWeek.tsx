// React
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Componentes

// Constantes
import medalImages from "../../constants/medals";

// Modelos
import { DaysOfWeekProps } from "../../(models)/component.props";

// Hooks
import { useWeekDays } from "../../(hooks)/useWeekDays";
import { useWeekMedals } from "../../(hooks)/useWeekMedals";

// Servicios
import { Medal } from "../../(models)/routine.types";

// Acciones

// Visuales
import { colors } from "@/src/app/design-system/themes/globalColors-theme";

const styles = StyleSheet.create({
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
});

/**
 * DaysOfWeek
 * ----------
 * Muestra los 7 días de la semana actual de la rutina, permitiendo
 * seleccionar un día y visualizar si se obtuvo una medalla/logro en él.
 *
 * Responsabilidades:
 * - Calcular las fechas de la semana a partir de `currentWeekStart`.
 * - Mostrar cada día con su nombre corto (lun, mar, ...) y número.
 * - Resaltar visualmente el día actualmente seleccionado.
 * - Mostrar una medalla sobre el día si existe un logro asociado.
 */
export const DaysOfWeek = ({
  currentWeekStart,
  selectedDayIndex,
  setSelectedDayIndex,
}: DaysOfWeekProps) => {
  // Obtiene un arreglo de 7 fechas (Date) que representan los días
  // de la semana actual, comenzando en `currentWeekStart`.
  const weekDates = useWeekDays(currentWeekStart);

  // Obtiene, para cada día de la semana, el tipo de medalla alcanzada
  // (si la hay). Si no hay medalla, puede devolver "none".
  const medals = useWeekMedals(weekDates);

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
            <Text
              style={[
                styles.dayText,
                { color: isSelected ? "white" : "black" },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {day.toLocaleString("es-ES", { weekday: "short" })}
            </Text>
            {/* Número de día del mes (1-31) */}
            <Text
              style={[
                styles.numberDayText,
                { color: isSelected ? "white" : "black" },
              ]}
              numberOfLines={1}
            >
              {day.getDate()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default DaysOfWeek;
