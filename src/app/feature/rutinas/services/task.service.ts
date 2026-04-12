import { auditLogService } from "@/src/app/feature/ajustes/services/auditLog.Service";
import { supabase } from "@/src/lib/supabaseClient";
import { TaskDb, TaskStepDb } from "../models/task.types";

type TaskCategoryRow = {
  id: number;
  name: string;
  image_url: string | null;
};

type TaskRow = Omit<TaskDb, "category"> & {
  category: TaskCategoryRow | TaskCategoryRow[] | null;
};

type TaskWithSteps = TaskDb & {
  steps?: TaskStepDb[];
};

function normalizeTaskRow(task: TaskRow): TaskDb {
  return {
    ...task,
    category: Array.isArray(task.category)
      ? (task.category[0] ?? null)
      : task.category,
  };
}

function normalizeTaskRows(tasks: TaskRow[] | null): TaskDb[] {
  return (tasks ?? []).map(normalizeTaskRow);
}

function normalizeTaskSteps(data: TaskStepDb[] | null): TaskStepDb[] {
  return data ?? [];
}

function requireTaskRow(data: TaskRow | null, fallbackMessage: string): TaskDb {
  if (!data) {
    throw new Error(fallbackMessage);
  }

  return normalizeTaskRow(data);
}

async function getProfileIdByRoutineId(
  routineId: number,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("routines")
    .select("profile_id")
    .eq("id", routineId)
    .single();

  if (error) {
    return null;
  }

  return data?.profile_id || null;
}

async function getProfileIdByTaskId(taskId: number): Promise<string | null> {
  const { data, error } = await supabase
    .from("tasks")
    .select("routine_id")
    .eq("id", taskId)
    .single();

  if (error || !data?.routine_id) {
    return null;
  }

  return getProfileIdByRoutineId(data.routine_id);
}

export async function getTasksByRoutine(
  routineId: number,
): Promise<(TaskDb & { steps?: TaskStepDb[] })[]> {
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select(
      "id, routine_id, category_id, title, status, start_time, end_time, reminder, created_at, updated_at, category:task_categories(id, name, image_url)",
    )
    .eq("routine_id", routineId)
    .order("created_at");

  if (tasksError) throw tasksError;
  if (!tasks) return [];

  const { data: steps, error: stepsError } = await supabase
    .from("task_steps")
    .select("*")
    .in(
      "task_id",
      tasks.map((t) => t.id),
    )
    .order("step_order");

  if (stepsError) throw stepsError;

  const stepsByTask: Record<number, TaskStepDb[]> = {};
  (steps || []).forEach((step) => {
    if (!stepsByTask[step.task_id]) {
      stepsByTask[step.task_id] = [];
    }
    stepsByTask[step.task_id].push(step);
  });

  const tasksWithSteps = normalizeTaskRows(tasks as TaskRow[]).map((task) => ({
    ...task,
    steps: stepsByTask[task.id] || [],
  }));

  const { data: routine } = await supabase
    .from("routines")
    .select("routine_date")
    .eq("id", routineId)
    .single();
  const routineDate: string = routine?.routine_date ?? "";

  return tasksWithSteps.map((task) => ({ ...task, _routineDate: routineDate }));
}

export async function createTask(
  task: Omit<TaskDb, "id" | "created_at" | "updated_at" | "category">,
): Promise<TaskDb> {
  const { data, error } = await supabase
    .from("tasks")
    .insert(task)
    .select(
      "id, routine_id, category_id, title, status, start_time, end_time, reminder, created_at, updated_at, category:task_categories(id, name, image_url)",
    )
    .single();
  if (error) throw error;

  const mapped = requireTaskRow(
    (data as TaskRow | null) ?? null,
    "No se pudo normalizar la tarea creada",
  );

  await auditLogService.logEventSafe({
    profile_id: await getProfileIdByRoutineId(task.routine_id),
    event_type: auditLogService.events.TASK_CREATED,
    description: "Task created",
    metadata: {
      task_id: mapped.id,
      routine_id: task.routine_id,
      title: task.title,
    },
    source: "task.service.createTask",
  });

  return mapped;
}

export async function updateTask(
  taskId: number,
  updates: Partial<Omit<TaskDb, "id" | "created_at" | "category">>,
): Promise<TaskDb> {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskId)
    .select(
      "id, routine_id, category_id, title, status, start_time, end_time, reminder, created_at, updated_at, category:task_categories(id, name, image_url)",
    )
    .single();

  if (error) throw error;

  const mapped = requireTaskRow(
    (data as TaskRow | null) ?? null,
    "No se pudo normalizar la tarea actualizada",
  );

  await auditLogService.logEventSafe({
    profile_id: await getProfileIdByTaskId(taskId),
    event_type: auditLogService.events.TASK_UPDATED,
    description: "Task updated",
    metadata: { task_id: taskId, updated_fields: Object.keys(updates) },
    source: "task.service.updateTask",
  });

  return mapped;
}

export async function deleteTask(taskId: number): Promise<void> {
  const profileId = await getProfileIdByTaskId(taskId);

  await supabase.from("task_steps").delete().eq("task_id", taskId);

  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) throw error;

  await auditLogService.logEventSafe({
    profile_id: profileId,
    event_type: auditLogService.events.TASK_DELETED,
    description: "Task deleted",
    metadata: { task_id: taskId },
    source: "task.service.deleteTask",
  });
}

export async function createTaskSteps(
  taskId: number,
  steps: Array<{ description?: string; step_order: number }>,
): Promise<TaskStepDb[]> {
  if (steps.length === 0) return [];

  const stepsToInsert = steps.map((step) => ({
    task_id: taskId,
    description: step.description || null,
    step_order: step.step_order,
  }));

  const { data, error } = await supabase
    .from("task_steps")
    .insert(stepsToInsert)
    .select();

  if (error) throw error;

  await auditLogService.logEventSafe({
    profile_id: await getProfileIdByTaskId(taskId),
    event_type: auditLogService.events.TASK_STEPS_CREATED,
    description: "Task steps created",
    metadata: { task_id: taskId, steps_count: steps.length },
    source: "task.service.createTaskSteps",
  });

  return normalizeTaskSteps((data as TaskStepDb[] | null) ?? null);
}

export async function replaceTaskSteps(
  taskId: number,
  steps: Array<{ description?: string; step_order: number }>,
): Promise<TaskStepDb[]> {
  await supabase.from("task_steps").delete().eq("task_id", taskId);
  if (steps.length === 0) return [];
  return createTaskSteps(taskId, steps);
}

export async function getTaskSteps(taskId: number): Promise<TaskStepDb[]> {
  const { data, error } = await supabase
    .from("task_steps")
    .select("*")
    .eq("task_id", taskId)
    .order("step_order");

  if (error) throw error;
  return normalizeTaskSteps((data as TaskStepDb[] | null) ?? null);
}

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

  await auditLogService.logEventSafe({
    profile_id: await getProfileIdByTaskId(taskId),
    event_type: auditLogService.events.TASK_TIMES_UPDATED,
    description: "Task schedule updated",
    metadata: { task_id: taskId, start_time: startTime, end_time: endTime },
    source: "task.service.updateTaskTimes",
  });
}

export async function updateTaskStatus(
  taskId: number,
  status: "Pendiente" | "En Proceso" | "Completado" | "Cancelado",
): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", taskId);
  if (error) throw error;

  await auditLogService.logEventSafe({
    profile_id: await getProfileIdByTaskId(taskId),
    event_type: auditLogService.events.TASK_STATUS_UPDATED,
    description: "Task status updated",
    metadata: { task_id: taskId, status },
    source: "task.service.updateTaskStatus",
  });
}
