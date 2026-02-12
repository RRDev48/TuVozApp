// React
import { useCallback, useEffect, useState } from "react";
import { Task } from "../(models)/task.types";

// Componentes

// Constantes

// Modelos
import { mapTasksFromDB } from "./useTaskMapper";

// Hooks

// Servicios
import {
  getTasksByRoutine,
  updateTaskStatus,
  updateTaskTimes,
} from "../(services)/task.service";

// Acciones

// Visuales

/**
 * Hook responsable de cargar y gestionar las tareas asociadas a una rutina.
 *
 * Responsabilidades:
 * - Obtener las tareas desde Supabase para un `routineId` dado y mapearlas
 *   al modelo de UI (`Task`).
 * - Exponer la lista de tareas en estado local.
 * - Permitir agregar una nueva tarea al listado local (después de crearla).
 * - Actualizar el estado de una tarea (Pendiente, En Proceso, Completado, Cancelado)
 *   tanto en la BD como en el estado local.
 * - Actualizar las horas de inicio/fin de una tarea cuando se mueve en el
 *   calendario, sincronizando BD y estado local.
 */
export const useRoutineTasks = (routineId: number) => {
  // Lista de tareas de la rutina actual, ya mapeadas al modelo de dominio UI.
  const [tasks, setTasks] = useState<Task[]>([]);

  // Cada vez que cambia el `routineId`, se vuelven a cargar las tareas desde BD.
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

  // Agrega una tarea al estado local. Se usa normalmente después de crear
  // la tarea en la BD y mapearla al modelo `Task`.
  const addTask = useCallback((newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
  }, []);

  // Actualiza el estado de una tarea tanto en Supabase como en el estado
  // local (por ejemplo al iniciar, completar o cancelar una tarea).
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

  // Maneja el cambio de horario de una tarea cuando se mueve/redimensiona
  // en el calendario: actualiza la BD y el estado local. Si falla la
  // actualización, recarga las tareas desde la BD para mantener consistencia.
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
