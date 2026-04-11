import { useCallback, useEffect, useState } from "react";
import { Task } from "../models/task.types";
import {
    getTasksByRoutine,
    updateTaskStatus,
    updateTaskTimes,
} from "../services/task.service";
import { mapTasksFromDB } from "./useTaskMapper";

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

export const useRoutineTasks = (routineId: number) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = useCallback(async () => {
    if (!routineId) {
      setTasks([]);
      return;
    }

    const tasksDb = await getTasksByRoutine(routineId);
    setTasks(mapTasksFromDB(tasksDb));
  }, [routineId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = useCallback((newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const updateTaskState = useCallback(
    async (taskId: string, newState: string) => {
      if (!isTaskStatus(newState)) {
        return;
      }

      try {
        await updateTaskStatus(Number(taskId), newState);

        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, estado: newState } : t)),
        );
      } catch {
        await loadTasks();
      }
    },
    [loadTasks],
  );

  const handleTaskTimeChange = useCallback(
    async (taskId: string, newStartTime: string, newEndTime: string) => {
      try {
        await updateTaskTimes(Number(taskId), newStartTime, newEndTime);

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, horarioDesde: newStartTime, horarioHasta: newEndTime }
              : t,
          ),
        );
      } catch {
        await loadTasks();
      }
    },
    [loadTasks],
  );

  return {
    tasks,
    addTask,
    updateTaskState,
    handleTaskTimeChange,
  };
};
