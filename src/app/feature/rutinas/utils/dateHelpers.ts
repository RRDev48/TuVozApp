/**
 * Obtiene el lunes de la semana de la fecha proporcionada
 * @param date Fecha de referencia
 * @returns Lunes de esa semana a las 00:00:00
 */
export const getMonday = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Obtiene el índice del día actual de la semana (0=Lunes, 6=Domingo)
 * @returns Índice del día (0-6)
 */
export const getTodayIndex = (): number => {
  const today = new Date();
  const day = today.getDay();
  return day === 0 ? 6 : day - 1;
};
