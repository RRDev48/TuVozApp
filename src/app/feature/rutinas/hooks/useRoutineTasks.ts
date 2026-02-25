import { useCallback, useEffect, useState } from "react";
import { Task } from "../models/task.types";
import {
  getTasksByRoutine,
  updateTaskStatus,
  updateTaskTimes,
} from "../services/task.service";
import { mapTasksFromDB } from "./useTaskMapper";

export const useRoutineTasks = (routineId: number) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (routineId) {
        const tasksDb = await getTasksByRoutine(routineId);
        setTasks(mapTasksFromDB(tasksDb));
      } else {
        setTasks([]);
      }
    };
    fetchTasks();
  }, [routineId]);

  const addTask = useCallback((newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const updateTaskState = useCallback(
    async (taskId: string, newState: string) => {
      try {
        await updateTaskStatus(
          Number(taskId),
          newState as "Pendiente" | "En Proceso" | "Completado" | "Cancelado",
        );

        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, estado: newState } : t)),
        );
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    },
    [],
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
      } catch (error) {
        console.error("Error updating task times:", error);
        if (routineId) {
          const tasksDb = await getTasksByRoutine(routineId);
          setTasks(mapTasksFromDB(tasksDb));
        }
      }
    },
    [routineId],
  );

  return {
    tasks,
    addTask,
    updateTaskState,
    handleTaskTimeChange,
  };
};
