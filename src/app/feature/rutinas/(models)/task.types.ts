// Interfaces del dominio de tareas
export interface TaskDb {
  id: number;
  routine_id: number;
  category_id: number | null;
  title: string;
  status: "Pendiente" | "En Proceso" | "Completado" | "Cancelado";
  start_time: string | null;
  end_time: string | null;
  steps: string[];
  reminder: string | null;
  created_at: string;
  category?: {
    name: string;
    image_url: string;
  };
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
