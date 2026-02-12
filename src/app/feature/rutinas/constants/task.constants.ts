// Mapa global de colores para cada estado de tarea, usado en diferentes
// componentes (items de lista, tarjetas, etc.) para dar feedback visual
// coherente sobre el progreso.
export const STATUS_COLOR_MAP: Record<string, string> = {
  Pendiente: "#E53935",
  "En Proceso": "#FBC02D",
  Completado: "#43A047",
  Cancelado: "#757575",
};
