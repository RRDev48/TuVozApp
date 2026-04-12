import { supabase } from "@/src/lib/supabaseClient";

export interface DayProgress {
  routineId: number;
  date: string;
  completed: number;
  total: number;
}

/**
 * Obtiene el progreso de todas las rutinas de un perfil.
 * Devuelve por cada día: total de tareas y cuántas se completaron.
 */
export async function getAllRoutineProgress(
  profileId: string,
): Promise<DayProgress[]> {
  const { data: routines, error: routineError } = await supabase
    .from("routines")
    .select("id, routine_date")
    .eq("profile_id", profileId)
    .order("routine_date");

  if (routineError) throw routineError;
  if (!routines || routines.length === 0) return [];

  const routineIds = routines.map((r) => r.id);

  const { data: tasks, error: taskError } = await supabase
    .from("tasks")
    .select("routine_id, status")
    .in("routine_id", routineIds);

  if (taskError) throw taskError;

  const tasksByRoutine: Record<number, { total: number; completed: number }> =
    {};

  for (const task of tasks ?? []) {
    if (!tasksByRoutine[task.routine_id]) {
      tasksByRoutine[task.routine_id] = { total: 0, completed: 0 };
    }
    tasksByRoutine[task.routine_id].total++;
    if (task.status === "Completado") {
      tasksByRoutine[task.routine_id].completed++;
    }
  }

  return routines.map((r) => ({
    routineId: r.id,
    date: r.routine_date,
    completed: tasksByRoutine[r.id]?.completed ?? 0,
    total: tasksByRoutine[r.id]?.total ?? 0,
  }));
}

/**
 * Calcula la racha más larga de días consecutivos donde el usuario
 * completó al menos el 50% de sus tareas.
 */
export function calcularRachaMasLarga(days: DayProgress[]): number {
  const successDates = new Set(
    days
      .filter((d) => d.total > 0 && d.completed / d.total >= 0.5)
      .map((d) => d.date),
  );

  const sorted = Array.from(successDates).sort();
  let maxStreak = 0;
  let currentStreak = 0;
  let prevDate: Date | null = null;

  for (const dateStr of sorted) {
    const current = new Date(dateStr);
    if (prevDate !== null) {
      const diff =
        (current.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
    if (currentStreak > maxStreak) maxStreak = currentStreak;
    prevDate = current;
  }

  return maxStreak;
}

/**
 * Calcula el % acumulado semanal total (suma de completadas / suma de totales * 100).
 * Usado para determinar logros de objetivos.
 */
export function calcularPorcentajeAcumuladoSemanal(
  days: DayProgress[],
): number {
  // Agrupa por semana (lunes-domingo) y calcula el % de cada semana acumulado
  // Para la pantalla de logros necesitamos el % acumulado total de todas las semanas
  const totalCompleted = days.reduce((sum, d) => sum + d.completed, 0);
  const totalTasks = days.reduce((sum, d) => sum + d.total, 0);
  if (totalTasks === 0) return 0;
  return (totalCompleted / totalTasks) * 100;
}

/**
 * Calcula la racha ACTUAL (días consecutivos hasta hoy con ≥50% completado)
 */
export function calcularRachaActual(days: DayProgress[]): number {
  const successDates = new Set(
    days
      .filter((d) => d.total > 0 && d.completed / d.total >= 0.5)
      .map((d) => d.date),
  );

  const today = new Date();
  let streak = 0;
  let checkDate = new Date(today);

  while (true) {
    const dateStr = checkDate.toISOString().split("T")[0];
    if (successDates.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Dice si alguna vez hubo al menos 1 día SIN ninguna tarea completada
 * (para "Mal hábito").
 */
export function tuvoDiaSinCompletar(days: DayProgress[]): boolean {
  return days.some((d) => d.total > 0 && d.completed === 0);
}
