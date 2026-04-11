import { useMemo } from "react";
import {
    MIN_TASK_HEIGHT,
    TOTAL_HOUR_HEIGHT,
} from "../constants/calendar.constants";
import { Task } from "../models/task.types";

type TaskPosition = {
  task: Task;
  topPosition: number;
  height: number;
  startMinutes: number;
  endMinutes: number;
};

type TaskPositionWithColumn = TaskPosition & {
  columnIndex: number;
  totalColumns: number;
};

export const useCalendarTasks = (tasks: Task[]) => {
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + (minutes || 0);
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  const detectCollisions = (tasks: TaskPosition[]) => {
    const sorted = [...tasks].sort((a, b) => a.startMinutes - b.startMinutes);
    const columns: TaskPosition[][] = [];

    sorted.forEach((task) => {
      let placed = false;
      for (const col of columns) {
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

    const withColumns: TaskPositionWithColumn[] = positions.map((pos) => {
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
