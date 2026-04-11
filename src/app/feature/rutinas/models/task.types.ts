export interface TaskDb {
  id: number;
  routine_id: number;
  category_id: number | null;
  title: string;
  status: "Pendiente" | "En Proceso" | "Completado" | "Cancelado";
  start_time: string | null;
  end_time: string | null;
  reminder: string | null;
  created_at: string;
  updated_at?: string;
  category?: {
    id: number;
    name: string;
    image_url: string | null;
  } | null;
}

export interface TaskStepDb {
  id: number;
  task_id: number;
  description: string | null;
  step_order: number;
  created_at: string;
  updated_at?: string;
}

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
