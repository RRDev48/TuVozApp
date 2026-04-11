import { Task, TaskDb, TaskStepDb } from "../models/task.types";

const normalizeTime = (time: string | null): string => {
  if (!time) return "";
  return time.slice(0, 5);
};

export const mapTaskFromDB = (
  taskDb: TaskDb & { steps?: TaskStepDb[] },
): Task => ({
  id: String(taskDb.id),
  categoriaId: taskDb.category_id ? String(taskDb.category_id) : "",
  diaRutina: "",
  horarioDesde: normalizeTime(taskDb.start_time),
  horarioHasta: normalizeTime(taskDb.end_time),
  pasos: taskDb.steps
    ? taskDb.steps
        .map((step) => step.description?.trim() ?? "")
        .filter((step) => step.length > 0)
    : [],
  recordatorio: taskDb.reminder || undefined,
  titulo: taskDb.title,
  estado: taskDb.status,
});

export const mapTasksFromDB = (
  tasksDb: (TaskDb & { steps?: TaskStepDb[] })[],
): Task[] => {
  return tasksDb.map(mapTaskFromDB);
};
