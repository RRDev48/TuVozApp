import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCalendarTasks } from "../../hooks/useCalendarTasks";
import { DayCalendarViewProps } from "../../models/component.props";
import DraggableTaskItem from "./DraggableTaskItem";
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 60;
const QUARTER_HEIGHT = 15;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  calendarContainer: {
    position: "relative",
    width: "100%",
  },
  hourBlockContainer: {
    position: "relative",
  },
  hourRow: {
    height: HOUR_HEIGHT,
    flexDirection: "row",
    alignItems: "flex-start",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  quarterSpacer: {
    height: QUARTER_HEIGHT,
  },
  hourLabelContainer: {
    width: 60,
    paddingRight: 8,
    paddingTop: 2,
  },
  hourLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
    fontWeight: "500",
  },
  hourLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  tasksContainer: {
    position: "absolute",
    left: 60,
    right: 0,
    top: 0,
    bottom: 0,
  },
  finalSpacer: {
    height: 50,
  },
});

export const DayCalendarView = ({
  tasks,
  onTaskTimeChange,
  onTaskPress,
  onHourPress,
}: DayCalendarViewProps) => {
  const { taskPositions, minutesToTime, TOTAL_HOUR_HEIGHT } =
    useCalendarTasks(tasks);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.calendarContainer}>
        {/*
          Renderiza la columna de horas del día.
          Por cada valor en HOURS se pinta un bloque de una hora, con:
          - etiqueta de hora (por ejemplo "08:00"),
          - línea horizontal que representa esa franja,
          - tres separadores visuales para los cuartos de hora.
          Al tocar una fila de hora completa se ejecuta `onHourPress` para
          iniciar la creación de una tarea en esa franja.
        */}
        {HOURS.map((hour) => {
          const hourString = hour.toString().padStart(2, "0") + ":00";
          return (
            <View key={hour} style={styles.hourBlockContainer}>
              <TouchableOpacity
                style={styles.hourRow}
                onPress={() => onHourPress(hourString)}
                activeOpacity={0.7}
              >
                <View style={styles.hourLabelContainer}>
                  <Text style={styles.hourLabel}>{hourString}</Text>
                </View>
                <View style={styles.hourLine} />
              </TouchableOpacity>

              <View style={styles.quarterSpacer} />
              <View style={styles.quarterSpacer} />
              <View style={styles.quarterSpacer} />
            </View>
          );
        })}

        {/*
          Contenedor absoluto donde se posicionan las tareas del día.
          Cada tarea se muestra como un bloque arrastrable cuya posición y altura
          representan su hora de inicio y duración.
        */}
        <View style={styles.tasksContainer}>
          {taskPositions.map(
            ({ task, topPosition, height, columnIndex, totalColumns }) => (
              <DraggableTaskItem
                key={task.id}
                task={task}
                topPosition={topPosition}
                height={height}
                hourHeight={TOTAL_HOUR_HEIGHT}
                columnIndex={columnIndex}
                totalColumns={totalColumns}
                onPositionChange={(newTop: number, newHeight: number) => {
                  const rawStartMinutes = (newTop / TOTAL_HOUR_HEIGHT) * 60;
                  const rawDurationMinutes =
                    (newHeight / TOTAL_HOUR_HEIGHT) * 60;
                  const newStartMinutes = Math.round(rawStartMinutes / 15) * 15;
                  const newDurationMinutes =
                    Math.round(rawDurationMinutes / 15) * 15;
                  const newEndMinutes = newStartMinutes + newDurationMinutes;

                  const newStartTime = minutesToTime(newStartMinutes);
                  const newEndTime = minutesToTime(newEndMinutes);

                  onTaskTimeChange(task.id!, newStartTime, newEndTime);
                }}
                onPress={() => onTaskPress(task)}
              />
            ),
          )}
        </View>
      </View>
      {/* Espacio extra al final para que el último bloque no quede pegado al borde. */}
      <View style={styles.finalSpacer} />
    </ScrollView>
  );
};

export default DayCalendarView;
