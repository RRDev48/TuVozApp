import { supabase } from "@/src/lib/supabaseClient";
import { RoutineTaskDb, TaskDb, TaskStepDb } from "../models/task.types";

export async function getTasksByRoutine(
  routineId: number,
): Promise<(TaskDb & { steps?: TaskStepDb[] })[]> {
  const { data: routineTasks, error: rtError } = await supabase
    .from("routine_tasks")
    .select("task_id, task_order")
    .eq("routine_id", routineId)
    .order("task_order");

  if (rtError) throw rtError;
  if (!routineTasks || routineTasks.length === 0) return [];

  const taskIds = routineTasks.map((rt) => rt.task_id);

  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select(
      "id, profile_id, category_id, title, status, start_time, end_time, reminder, created_at, category:task_categories(name, image_url)",
    )
    .in("id", taskIds);

  if (tasksError) throw tasksError;
  if (!tasks) return [];

  const { data: steps, error: stepsError } = await supabase
    .from("task_steps")
    .select("*")
    .in("task_id", taskIds)
    .order("step_order");

  if (stepsError) throw stepsError;

  const stepsByTask: Record<number, TaskStepDb[]> = {};
  (steps || []).forEach((step) => {
    if (!stepsByTask[step.task_id]) {
      stepsByTask[step.task_id] = [];
    }
    stepsByTask[step.task_id].push(step);
  });

  const tasksWithSteps = tasks.map((task: any) => ({
    ...task,
    category: Array.isArray(task.category)
      ? (task.category[0] ?? null)
      : task.category,
    steps: stepsByTask[task.id] || [],
  }));

  const orderMap = new Map(
    routineTasks.map((rt) => [rt.task_id, rt.task_order]),
  );
  tasksWithSteps.sort((a, b) => {
    const orderA = orderMap.get(a.id) || 0;
    const orderB = orderMap.get(b.id) || 0;
    return orderA - orderB;
  });

  return tasksWithSteps as (TaskDb & { steps?: TaskStepDb[] })[];
}

export async function createTask(
  task: Omit<TaskDb, "id" | "created_at" | "category">,
): Promise<TaskDb> {
  const { data, error } = await supabase
    .from("tasks")
    .insert(task)
    .select(
      "id, profile_id, category_id, title, status, start_time, end_time, reminder, created_at, category:task_categories(name, image_url)",
    )
    .single();
  if (error) throw error;

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

export async function linkTaskToRoutine(
  routineId: number,
  taskId: number,
  taskOrder: number,
): Promise<RoutineTaskDb> {
  const { data, error } = await supabase
    .from("routine_tasks")
    .insert({
      routine_id: routineId,
      task_id: taskId,
      task_order: taskOrder,
    })
    .select()
    .single();

  if (error) throw error;
  return data as RoutineTaskDb;
}

export async function createTaskSteps(
  taskId: number,
  steps: Array<{ title: string; description?: string; step_order: number }>,
): Promise<TaskStepDb[]> {
  if (steps.length === 0) return [];

  const stepsToInsert = steps.map((step) => ({
    task_id: taskId,
    title: step.title,
    description: step.description || null,
    step_order: step.step_order,
  }));

  const { data, error } = await supabase
    .from("task_steps")
    .insert(stepsToInsert)
    .select();

  if (error) throw error;
  return data as TaskStepDb[];
}

export async function getTaskSteps(taskId: number): Promise<TaskStepDb[]> {
  const { data, error } = await supabase
    .from("task_steps")
    .select("*")
    .eq("task_id", taskId)
    .order("step_order");

  if (error) throw error;
  return data as TaskStepDb[];
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
}

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
