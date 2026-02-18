// Interfaces del dominio de tareas
export interface TaskDb {
  id: number;
  profile_id: string;
  category_id: number | null;
  title: string;
  status: "Pendiente" | "En Proceso" | "Completado" | "Cancelado";
  start_time: string | null;
  end_time: string | null;
  reminder: string | null;
  created_at: string;
  category?: {
    name: string;
    image_url: string;
  };
}

// Interface para los pasos de una tarea (tabla task_steps)
export interface TaskStepDb {
  id: number;
  task_id: number;
  title: string;
  description: string | null;
  step_order: number;
  created_at: string;
}

// Interface para la relación rutina-tarea (tabla routine_tasks)
export interface RoutineTaskDb {
  id: number;
  routine_id: number;
  task_id: number;
  task_order: number;
  created_at: string;
}

export interface Task {
  id?: string;
  categoriaId: string;
  diaRutina: string;
  horarioDesde: string;
  horarioHasta: string;
  pasos: string[];
  recordatorio?: string;
  titulo: string;
  estado?: string;
  rutinaId?: string;
}
