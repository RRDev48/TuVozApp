import { supabase } from "@/src/lib/supabaseClient";
import { TaskDb } from "../(models)/task.types";

/**
 * Obtiene todas las tareas asociadas a una rutina específica.
 *
 * - Filtra por `routine_id`.
 * - Incluye los datos de la categoría relacionada (`category_id`).
 * - Ordena las tareas por `start_time` para facilitar el render en el
 *   calendario.
 * - Ajusta la forma en que llega la relación `category` (array vs objeto)
 *   para devolver siempre un único objeto o `null`.
 */
export async function getTasksByRoutine(routineId: number): Promise<TaskDb[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select(
      "id, routine_id, category_id, title, status, start_time, end_time, steps, reminder, created_at, category:category_id(name, image_url)",
    )
    .eq("routine_id", routineId)
    .order("start_time");
  if (error) throw error;
  // Normaliza la relación `category`, ya que Supabase puede devolverla
  // como array cuando es una relación 1:N, pero aquí solo nos interesa
  // un único objeto de categoría.
  return (data ?? []).map((task: any) => ({
    ...task,
    category: Array.isArray(task.category)
      ? (task.category[0] ?? null)
      : task.category,
  })) as TaskDb[];
}

/**
 * Crea una nueva tarea en la tabla `tasks` y devuelve el registro creado
 * con la categoría relacionada ya cargada.
 */
export async function createTask(
  task: Omit<TaskDb, "id" | "created_at" | "category">,
): Promise<TaskDb> {
  const { data, error } = await supabase
    .from("tasks")
    .insert(task)
    .select(
      "id, routine_id, category_id, title, status, start_time, end_time, steps, reminder, created_at, category:category_id(name, image_url)",
    )
    .single();
  if (error) throw error;
  // Se vuelve a normalizar la relación `category` igual que en el fetch
  // de tareas, para mantener un formato consistente en toda la app.
  const mapped = data
    ? {
        ...data,
        category: Array.isArray(data.category)
          ? (data.category[0] ?? null)
          : data.category,
      }
    : data;
  return mapped as TaskDb;
}

/**
 * Actualiza la hora de inicio y fin de una tarea, por ejemplo cuando el
 * usuario la mueve o redimensiona en el calendario.
 */
export async function updateTaskTimes(
  taskId: number,
  startTime: string,
  endTime: string,
): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .update({ start_time: startTime, end_time: endTime })
    .eq("id", taskId);
  if (error) throw error;
}

/**
 * Actualiza el estado de una tarea (pendiente, en proceso, completado,
 * cancelado). Usado al iniciar, finalizar o cancelar una tarea.
 */
export async function updateTaskStatus(
  taskId: number,
  status: "Pendiente" | "En Proceso" | "Completado" | "Cancelado",
): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", taskId);
  if (error) throw error;
}
