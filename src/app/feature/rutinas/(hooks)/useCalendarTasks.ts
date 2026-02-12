// React
import { useMemo } from "react";

// Componentes

// Constantes

// Modelos
import { Task } from "../(models)/task.types";

// Hooks

// Servicios

// Acciones

// Visuales

// Altura base de cada hora en la vista de calendario.
const HOUR_HEIGHT = 60;
// Altura de cada cuarto de hora.
const QUARTER_HEIGHT = 15;
// Altura total de una hora (1 bloque + 3 cuartos).
const TOTAL_HOUR_HEIGHT = HOUR_HEIGHT + QUARTER_HEIGHT * 3;
// Altura mínima visual para cualquier tarea.
const MIN_TASK_HEIGHT = 60;

/**
 * Hook que calcula la posición y el tamaño de las tareas dentro del
 * calendario diario, además de utilidades para convertir entre tiempo
 * (HH:mm) y píxeles.
 *
 * Responsabilidades:
 * - Convertir horarios de las tareas a minutos y luego a posiciones/alturas.
 * - Detectar colisiones entre tareas y asignar columnas para mostrarlas
 *   una al lado de la otra cuando se solapan.
 * - Exponer helpers de conversión (timeToMinutes, minutesToTime, pixelsToTime)
 *   para que otros componentes puedan trabajar con la misma rejilla.
 */
export const useCalendarTasks = (tasks: Task[]) => {
  // Convierte una hora HH:mm a minutos desde las 00:00.
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + (minutes || 0);
  };

  // Convierte una cantidad de minutos a texto HH:mm.
  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  // Dado un listado de tareas con startMinutes/endMinutes calcula las
  // columnas necesarias para que las tareas que se solapan no se dibujen
  // una encima de otra.
  const detectCollisions = (tasks: any[]) => {
    const sorted = [...tasks].sort((a, b) => a.startMinutes - b.startMinutes);
    const columns: any[][] = [];

    sorted.forEach((task) => {
      let placed = false;
      for (let col of columns) {
        const lastInColumn = col[col.length - 1];
        if (task.startMinutes >= lastInColumn.endMinutes) {
          col.push(task);
          placed = true;
          break;
        }
      }
      if (!placed) {
        columns.push([task]);
      }
    });

    return columns;
  };

  // Calcula, memorizado por `tasks`, la posición vertical, altura y
  // columna de cada tarea en el calendario.
  const taskPositions = useMemo(() => {
    const positions = tasks.map((task) => {
      const startMinutes = timeToMinutes(task.horarioDesde);
      const endMinutes = timeToMinutes(task.horarioHasta);
      const durationMinutes = endMinutes - startMinutes;

      const topPosition = (startMinutes / 60) * TOTAL_HOUR_HEIGHT;
      const height = Math.max(
        (durationMinutes / 60) * TOTAL_HOUR_HEIGHT,
        MIN_TASK_HEIGHT,
      );

      return {
        task,
        topPosition,
        height,
        startMinutes,
        endMinutes,
      };
    });

    const columns = detectCollisions(positions);
    const totalColumns = columns.length;

    const withColumns = positions.map((pos) => {
      let columnIndex = 0;
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].some((t) => t.task.id === pos.task.id)) {
          columnIndex = i;
          break;
        }
      }

      return {
        ...pos,
        columnIndex,
        totalColumns,
      };
    });

    return withColumns;
  }, [tasks]);

  // Convierte una posición en píxeles dentro del calendario a horas/minutos
  // redondeados a saltos de 15 minutos.
  const pixelsToTime = (pixels: number): { hours: number; minutes: number } => {
    const rawMinutes = (pixels / TOTAL_HOUR_HEIGHT) * 60;
    const snappedMinutes = Math.round(rawMinutes / 15) * 15;
    return {
      hours: Math.floor(snappedMinutes / 60),
      minutes: snappedMinutes % 60,
    };
  };

  return {
    taskPositions,
    timeToMinutes,
    minutesToTime,
    pixelsToTime,
    TOTAL_HOUR_HEIGHT,
  };
};
