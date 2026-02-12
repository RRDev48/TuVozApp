import { supabase } from "@/src/lib/supabaseClient";
import { RoutineDb } from "../(models)/routine.types";

/**
 * Obtiene todas las rutinas cuya fecha esté dentro de un rango [start, end].
 *
 * - Usa `routine_date` como campo de filtro.
 * - Devuelve solo las columnas necesarias para la lógica de rutinas.
 * - Ordena las rutinas por fecha ascendente para facilitar su uso en vistas
 *   de calendario o resúmenes semanales.
 */
export async function getRoutinesByRange(
  start: string,
  end: string,
): Promise<RoutineDb[]> {
  const { data, error } = await supabase
    .from("routines")
    .select("id, routine_date, created_at")
    .gte("routine_date", start)
    .lte("routine_date", end)
    .order("routine_date");
  if (error) throw error;
  return data as RoutineDb[];
}

/**
 * Obtiene la rutina correspondiente a una fecha específica.
 *
 * Si no existe una rutina para esa fecha, devuelve `null` en lugar de
 * lanzar error. Esto permite a la capa de UI decidir si debe crear una
 * nueva rutina para ese día.
 */
export async function getRoutineByDate(
  date: string,
): Promise<RoutineDb | null> {
  const { data, error } = await supabase
    .from("routines")
    .select("id, routine_date, created_at")
    .eq("routine_date", date)
    .single();
  // PGRST116 es el código que indica "no rows returned" en Supabase;
  // en ese caso devolvemos null de forma controlada.
  if (error && error.code !== "PGRST116") throw error;
  return (data as RoutineDb) || null;
}

/**
 * Crea una nueva rutina para la fecha indicada.
 *
 * Se utiliza cuando el usuario comienza a trabajar con un día que todavía
 * no tiene una rutina registrada en la base de datos.
 */
export async function createRoutine(date: string): Promise<RoutineDb> {
  const { data, error } = await supabase
    .from("routines")
    .insert({ routine_date: date })
    .select()
    .single();
  if (error) throw error;
  return data as RoutineDb;
}
