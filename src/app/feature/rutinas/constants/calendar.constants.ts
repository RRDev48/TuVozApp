/**
 * Constantes para el renderizado del calendario de rutinas
 */

/** Altura de cada hora en píxeles */
export const HOUR_HEIGHT = 60;

/** Altura de cada cuarto de hora en píxeles */
export const QUARTER_HEIGHT = 15;

/** Altura total de una hora incluyendo cuartos */
export const TOTAL_HOUR_HEIGHT = HOUR_HEIGHT + QUARTER_HEIGHT * 3;

/** Altura mínima para una tarea en píxeles */
export const MIN_TASK_HEIGHT = 60;

/** Array de horas del día (0-23) */
export const HOURS = Array.from({ length: 24 }, (_, i) => i);
