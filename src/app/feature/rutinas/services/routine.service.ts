import { auditLogService } from "@/src/app/feature/ajustes/services/auditLog.Service";
import { supabase } from "@/src/lib/supabaseClient";
import { RoutineDb } from "../models/routine.types";

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
  return data as RoutineDb[];
}

export async function getRoutineByDate(
  profileId: string,
  date: string,
): Promise<RoutineDb | null> {
  const { data, error } = await supabase
    .from("routines")
    .select("id, profile_id, routine_date, created_at")
    .eq("profile_id", profileId)
    .eq("routine_date", date)
    .single();
  if (error && error.code !== "PGRST116") throw error;
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

  return data as RoutineDb;
}
