// React

// Componentes

// Constantes

// Modelos

// Hooks

// Servicios

// Acciones

// Visuales

/**
 * Devuelve los 7 días de la semana (de lunes a domingo) que contiene
 * la fecha `startDate`.
 *
 * - Calcula el lunes de la semana de la fecha recibida.
 * - A partir de ese lunes, construye un arreglo de 7 objetos Date
 *   correspondientes a lunes, martes, ..., domingo.
 *
 * Se utiliza principalmente para pintar la tira de días en la vista de
 * rutinas (componente DaysOfWeek).
 */
export const useWeekDays = (startDate: Date): Date[] => {
  const getDaysOfWeek = (date: Date) => {
    // Determina el lunes de la semana de `date`, teniendo en cuenta que
    // getDay() devuelve 0 para domingo.
    const days: Date[] = [];
    const dayOfWeek = date.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);

    // Construye el arreglo de 7 días a partir del lunes calculado.
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  };

  // Devuelve los días de la semana correspondientes a la fecha inicial.
  return getDaysOfWeek(startDate);
};
