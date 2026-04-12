import { useCallback } from "react";
import { Task } from "../models/task.types";
import {
    deleteTask,
    updateTaskStatus,
    updateTaskTimes,
} from "../services/task.service";

const TASK_STATUS_VALUES = [
  "Pendiente",
  "En Proceso",
  "Completado",
  "Cancelado",
] as const;

type TaskStatus = (typeof TASK_STATUS_VALUES)[number];

function isTaskStatus(value: string): value is TaskStatus {
  return TASK_STATUS_VALUES.includes(value as TaskStatus);
}

export const useTaskOperations = (tasks: Task[], onTasksUpdate: () => void) => {
  const addTask = useCallback(
    (newTask: Task) => {
      // La tarea ya fue agregada a la DB, solo recargamos
      onTasksUpdate();
    },
    [onTasksUpdate],
  );

  const updateTaskState = useCallback(
    async (taskId: string, newState: string) => {
      if (!isTaskStatus(newState)) {
        return;
      }

      try {
        await updateTaskStatus(Number(taskId), newState);
        onTasksUpdate();
      } catch (error) {
        console.error("Error updating task state:", error);
        onTasksUpdate();
      }
    },
    [onTasksUpdate],
  );

  const handleTaskTimeChange = useCallback(
    async (taskId: string, newStartTime: string, newEndTime: string) => {
      try {
        await updateTaskTimes(Number(taskId), newStartTime, newEndTime);
        onTasksUpdate();
      } catch (error) {
        console.error("Error updating task time:", error);
        onTasksUpdate();
      }
    },
    [onTasksUpdate],
  );

  const removeTask = useCallback(
    async (taskId: string) => {
      try {
        await deleteTask(Number(taskId));
        onTasksUpdate();
      } catch (error) {
        console.error("Error removing task:", error);
        onTasksUpdate();
      }
    },
    [onTasksUpdate],
  );

  const replaceTask = useCallback(
    (updatedTask: Task) => {
      // La tarea ya fue actualizada en la DB, solo recargamos
      onTasksUpdate();
    },
    [onTasksUpdate],
  );

  return {
    tasks,
    addTask,
    removeTask,
    replaceTask,
    updateTaskState,
    handleTaskTimeChange,
  };
};
