// React
import { useCallback, useEffect, useMemo, useState } from "react";

// Componentes

// Constantes

// Modelos

// Hooks

// Servicios
import { createRoutine, getRoutineByDate } from "../(services)/routine.service";

// Acciones

// Visuales

// Calcula el lunes de la semana de una fecha dada.
// Normaliza además la hora a 00:00:00 para evitar problemas de comparación.
const getMonday = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Devuelve el índice (0-6) del día actual dentro de la semana tipo lunes-domingo.
// Domingo (getDay() = 0) se mapea como 6 para que quede al final.
const getTodayIndex = () => {
  const today = new Date();
  const day = today.getDay();
  return day === 0 ? 6 : day - 1;
};

/**
 * Hook que gestiona la semana actual de rutinas y la rutina asociada
 * al día seleccionado.
 *
 * Responsabilidades:
 * - Calcular el inicio de la semana (lunes) en base a la fecha actual.
 * - Exponer el array de días de la semana (7 fechas) a partir de ese lunes.
 * - Controlar qué día de la semana está seleccionado (selectedDayIndex).
 * - Obtener (o crear si no existe) la rutina en Supabase para el día
 *   seleccionado y exponer su `routineId`.
 * - Permitir cambiar de semana hacia adelante/atrás y resetear el día
 *   seleccionado cuando la semana cambia.
 */
export const useWeekRoutine = (profileId: string) => {
  // Fecha que representa el lunes de la semana actual mostrada.
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    getMonday(new Date()),
  );

  // Índice del día seleccionado dentro del arreglo de días de la semana (0-6).
  const [selectedDayIndex, setSelectedDayIndex] = useState(getTodayIndex);

  // id de la rutina para el día actualmente seleccionado.
  const [routineId, setRoutineId] = useState<number>(0);

  // Construye un arreglo con los 7 días de la semana a partir de un lunes.
  const getDaysOfWeek = useCallback((start: Date) => {
    const monday = getMonday(start);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, []);

  // Memoriza los 7 días de la semana actual para no recalcularlos
  // en cada render mientras `currentWeekStart` no cambie.
  const daysOfWeek = useMemo(
    () => getDaysOfWeek(currentWeekStart),
    [currentWeekStart, getDaysOfWeek],
  );

  // Cambia la semana actual tomando como referencia la fecha recibida,
  // normalizándola siempre al lunes correspondiente y reseteando el día
  // seleccionado al primer día de la semana.
  const handleChangeWeek = useCallback((newStartDate: Date) => {
    setCurrentWeekStart(getMonday(newStartDate));
    setSelectedDayIndex(0);
  }, []);

  useEffect(() => {
    const fetchRoutine = async () => {
      if (!profileId) return;

      // Día concreto de la semana seleccionado por el usuario.
      const selectedDay = daysOfWeek[selectedDayIndex];
      const dateString = selectedDay.toISOString().slice(0, 10);

      // Busca si ya existe una rutina para ese día. Si no existe, la crea.
      let routine = await getRoutineByDate(profileId, dateString);
      if (!routine) {
        routine = await createRoutine(profileId, dateString);
      }
      // Guarda el id de la rutina (o 0 por seguridad si algo falla).
      setRoutineId(routine.id || 0);
    };
    fetchRoutine();
  }, [daysOfWeek, selectedDayIndex, profileId]);

  return {
    currentWeekStart,
    selectedDayIndex,
    setSelectedDayIndex,
    routineId,
    daysOfWeek,
    handleChangeWeek,
  };
};
