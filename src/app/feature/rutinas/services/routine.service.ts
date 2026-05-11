import { auditLogService } from "@/src/app/feature/ajustes/services/auditLog.Service";
import { supabase } from "@/src/lib/supabaseClient";
import { RoutineDb } from "../models/routine.types";

// Caché en memoria para evitar llamadas redundantes a Supabase
const routineCacheByDate: Record<string, RoutineDb> = {};

export async function getRoutinesByRange(
  profileId: string,
  start: string,
  end: string,
): Promise<RoutineDb[]> {
  const { data, error } = await supabase
    .from("routines")
    .select("id, profile_id, routine_date, created_at")
    .eq("profile_id", profileId)
    .gte("routine_date", start)
    .lte("routine_date", end)
    .order("routine_date");
    
  if (error) throw error;
  
  const routines = data as RoutineDb[];
  
  // Poblar el caché
  routines.forEach(r => {
    routineCacheByDate[`${profileId}_${r.routine_date}`] = r;
  });
  
  return routines;
}

export async function getRoutineByDate(
  profileId: string,
  date: string,
): Promise<RoutineDb | null> {
  const cacheKey = `${profileId}_${date}`;
  if (routineCacheByDate[cacheKey]) {
    return routineCacheByDate[cacheKey];
  }

  const { data, error } = await supabase
    .from("routines")
    .select("id, profile_id, routine_date, created_at")
    .eq("profile_id", profileId)
    .eq("routine_date", date)
    .maybeSingle();

  if (error) throw error;
  
  if (data) {
    routineCacheByDate[cacheKey] = data as RoutineDb;
  }
  
  return (data as RoutineDb) || null;
}

export async function createRoutine(
  profileId: string,
  date: string,
): Promise<RoutineDb> {
  const { data, error } = await supabase
    .from("routines")
    .insert({ profile_id: profileId, routine_date: date })
    .select()
    .single();
    
  if (error) throw error;

  const routine = data as RoutineDb;
  routineCacheByDate[`${profileId}_${date}`] = routine;

  await auditLogService.logEventSafe({
    profile_id: profileId,
    event_type: auditLogService.events.ROUTINE_CREATED,
    description: "Routine created",
    metadata: {
      profile_id: profileId,
      routine_id: data.id,
      routine_date: date,
    },
    source: "routine.service.createRoutine",
  });

  return routine;
}
