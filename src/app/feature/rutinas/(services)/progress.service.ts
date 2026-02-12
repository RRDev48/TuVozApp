import { Medal, RoutineProgress } from "../(models)/routine.types";
import { getTasksByRoutine } from "./task.service";

/**
 * Calcula el progreso de una rutina a partir de sus tareas.
 *
 * Reglas de medalla:
 * - 0%           → "none" (sin medalla).
 * - 0% < x < 50% → "bronce".
 * - 50% ≤ x < 100% → "plata".
 * - 100%         → "oro".
 */
export async function getRoutineProgress(
  routineId: number,
): Promise<RoutineProgress> {
  const tasks = await getTasksByRoutine(routineId);
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completado").length;
  const percent = total > 0 ? (completed / total) * 100 : 0;
  let medal: Medal = "none";
  if (percent === 100) medal = "oro";
  else if (percent >= 50) medal = "plata";
  else if (percent > 0) medal = "bronce";
  return { completed, total, percent, medal };
}
