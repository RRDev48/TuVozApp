import { useCallback, useEffect, useState } from "react";
import { Task } from "../models/task.types";
import { getRoutinesByRange } from "../services/routine.service";
import { getTasksByRoutine } from "../services/task.service";
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
      // Obtener el rango de fechas de la semana
      const startDate = daysOfWeek[0].toISOString().slice(0, 10);
      const endDate = daysOfWeek[daysOfWeek.length - 1]
        .toISOString()
        .slice(0, 10);

      // Obtener todas las rutinas de la semana
      const routines = await getRoutinesByRange(profileId, startDate, endDate);

      // Crear un mapa de fecha a routine_id
      const routinesByDate = new Map(
        routines.map((r) => [r.routine_date, r.id]),
      );

      // Cargar tareas para todas las rutinas en paralelo
      const tasksPromises = routines.map((routine) =>
        getTasksByRoutine(routine.id),
      );
      const allTasksData = await Promise.all(tasksPromises);

      // Organizar tareas por fecha
      const newTasksByDay: TasksByDay = {};

      daysOfWeek.forEach((day) => {
        const dateStr = day.toISOString().slice(0, 10);
        newTasksByDay[dateStr] = [];
      });

      routines.forEach((routine, index) => {
        const tasksForRoutine = mapTasksFromDB(allTasksData[index]);
        newTasksByDay[routine.routine_date] = tasksForRoutine;
      });

      setTasksByDay(newTasksByDay);
    } catch (error) {
      console.error("Error loading week tasks:", error);
      setTasksByDay({});
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
