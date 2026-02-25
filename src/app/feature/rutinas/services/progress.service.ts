import { Medal, RoutineProgress } from "../models/routine.types";
import { getTasksByRoutine } from "./task.service";

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
