// React

// Componentes

// Constantes

// Modelos
import { Task, TaskDb } from "../(models)/task.types";

// Hooks

// Servicios

// Acciones

// Visuales

// Función para normalizar el formato de tiempo de HH:MM:SS (BD) a HH:MM (UI).
// Si el valor es nulo, devuelve cadena vacía para indicar "sin hora definida".
const normalizeTime = (time: string | null): string => {
  if (!time) return "";
  return time.slice(0, 5);
};

/**
 * Transforma una tarea en formato de base de datos (TaskDb) al modelo
 * usado en la UI (Task).
 *
 * - Convierte ids numéricos a string.
 * - Normaliza horarios de HH:MM:SS a HH:MM.
 * - Asegura que los campos opcionales tengan valores por defecto adecuados
 *   (por ejemplo, pasos vacíos, recordatorio undefined).
 */
export const mapTaskFromDB = (taskDb: TaskDb): Task => ({
  id: String(taskDb.id),
  categoriaId: taskDb.category_id ? String(taskDb.category_id) : "",
  diaRutina: "",
  horarioDesde: normalizeTime(taskDb.start_time),
  horarioHasta: normalizeTime(taskDb.end_time),
  pasos: taskDb.steps || [],
  recordatorio: taskDb.reminder || undefined,
  titulo: taskDb.title,
  estado: taskDb.status,
  rutinaId: String(taskDb.routine_id),
});

/**
 * Aplica `mapTaskFromDB` a un arreglo completo de tareas leídas desde la BD.
 */
export const mapTasksFromDB = (tasksDb: TaskDb[]): Task[] => {
  return tasksDb.map(mapTaskFromDB);
};
