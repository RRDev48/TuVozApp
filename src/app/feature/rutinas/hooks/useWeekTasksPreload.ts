import { useCallback, useEffect, useState } from "react";
import { Task } from "../models/task.types";
import { getRoutinesByRange } from "../services/routine.service";
import { getTasksByRoutineRange } from "../services/task.service";
import { mapTasksFromDB } from "./useTaskMapper";

type TasksByDay = Record<string, Task[]>;

export const useWeekTasksPreload = (profileId: string, daysOfWeek: Date[]) => {
  const [tasksByDay, setTasksByDay] = useState<TasksByDay>({});
  const [isLoading, setIsLoading] = useState(false);

  const loadWeekTasks = useCallback(async () => {
    if (!profileId || daysOfWeek.length === 0) {
      setTasksByDay({});
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      // 1. Obtener el rango de fechas de la semana
      const startDate = daysOfWeek[0].toISOString().slice(0, 10);
      const endDate = daysOfWeek[daysOfWeek.length - 1]
        .toISOString()
        .slice(0, 10);

      // 2. Obtener todas las rutinas de la semana en una sola consulta
      const routines = await getRoutinesByRange(profileId, startDate, endDate);
      
      if (routines.length === 0) {
        setTasksByDay({});
        return;
      }

      // 3. Obtener TODAS las tareas de esas rutinas en una sola consulta masiva
      const routineIds = routines.map((r) => r.id);
      const allTasksData = await getTasksByRoutineRange(routineIds);

      // 4. Organizar tareas por fecha
      const newTasksByDay: TasksByDay = {};

      // Inicializar días vacíos
      daysOfWeek.forEach((day) => {
        const dateStr = day.toISOString().slice(0, 10);
        newTasksByDay[dateStr] = [];
      });

      // Mapear y agrupar tareas por su fecha de rutina
      const mappedTasks = mapTasksFromDB(allTasksData);
      
      mappedTasks.forEach((task) => {
        const dateStr = task._routineDate; // El servicio ahora nos provee esta fecha
        if (dateStr && newTasksByDay[dateStr]) {
          newTasksByDay[dateStr].push(task);
        }
      });

      setTasksByDay(newTasksByDay);
    } catch (error) {
      console.error("Error loading week tasks:", error);
      // No reseteamos a vacío para mantener lo que ya tenemos si falla el reload
    } finally {
      setIsLoading(false);
    }
  }, [profileId, daysOfWeek]);

  useEffect(() => {
    loadWeekTasks();
  }, [loadWeekTasks]);

  const getTasksForDay = useCallback(
    (date: Date): Task[] => {
      const dateStr = date.toISOString().slice(0, 10);
      return tasksByDay[dateStr] || [];
    },
    [tasksByDay],
  );

  const reloadWeekTasks = useCallback(() => {
    loadWeekTasks();
  }, [loadWeekTasks]);

  return {
    tasksByDay,
    getTasksForDay,
    isLoading,
    reloadWeekTasks,
  };
};
