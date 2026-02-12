// React
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// Componentes
import DraggableTaskItem from "./DraggableTaskItem";

// Constantes
const HOURS = Array.from({ length: 24 }, (_, i) => i);

// Modelos
import { DayCalendarViewProps } from "../../(models)/component.props";

// Hooks
import { useCalendarTasks } from "../../(hooks)/useCalendarTasks";

// Servicios

// Acciones

// Visuales
import { dayCalendarViewStyles as styles } from "@/src/app/design-system/styles/dayCalendarView-Styles";

/**
 * DayCalendarView
 * ---------------
 * Vista de calendario para un solo día dentro de la rutina.
 *
 * Responsabilidades:
 * - Pintar el eje horario (HOURS) en bloques de una hora, con separación en cuartos.
 * - Mostrar las tareas del día posicionadas en función de su hora de inicio y duración.
 * - Permitir que el usuario cree nuevas tareas tocando una franja horaria vacía.
 * - Permitir que el usuario arrastre y redimensione tareas existentes para cambiar horario.
 */
export const DayCalendarView = ({
  tasks,
  onTaskTimeChange,
  onTaskPress,
  onHourPress,
}: DayCalendarViewProps) => {
  // Hook que calcula las posiciones verticales y altura de cada tarea
  // en función de su hora de inicio y final, y provee utilidades de conversión.
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
                  // Convierte la posición vertical (en píxeles) a minutos reales.
                  const rawStartMinutes = (newTop / TOTAL_HOUR_HEIGHT) * 60;
                  const rawDurationMinutes =
                    (newHeight / TOTAL_HOUR_HEIGHT) * 60;

                  // Redondea el inicio y la duración a intervalos de 15 minutos
                  // para mantener la cuadrícula del calendario consistente.
                  const newStartMinutes = Math.round(rawStartMinutes / 15) * 15;
                  const newDurationMinutes =
                    Math.round(rawDurationMinutes / 15) * 15;
                  const newEndMinutes = newStartMinutes + newDurationMinutes;

                  // Convierte los minutos redondeados a formato HH:mm.
                  const newStartTime = minutesToTime(newStartMinutes);
                  const newEndTime = minutesToTime(newEndMinutes);

                  // Notifica al contenedor (RoutineScreen) el cambio de horario
                  // para que persista la nueva hora de inicio y fin de la tarea.
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
