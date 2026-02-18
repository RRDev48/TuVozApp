// Interfaces del dominio de rutinas
export interface RoutineDb {
  id: number;
  profile_id: string;
  routine_date: string;
  created_at: string;
}

export interface Routine {
  id?: string;
  diaRutina: string;
  tituloRutina: string;
  tareas: string[];
}

// Posibles medallas que puede obtener una rutina
export type Medal = "bronce" | "plata" | "oro" | "none";

// Estructura de datos que resume el progreso de una rutina
export interface RoutineProgress {
  completed: number;
  total: number;
  percent: number;
  medal: Medal;
}

export interface Status {
  id: string;
  nombre: string;
}
