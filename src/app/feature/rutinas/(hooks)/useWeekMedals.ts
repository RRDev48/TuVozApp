// React
import { useEffect, useState } from "react";

// Componentes

// Constantes

// Modelos

// Hooks

// Servicios
import { Medal } from "../(models)/routine.types";
import { getRoutineProgress } from "../(services)/progress.service";
import { getRoutineByDate } from "../(services)/routine.service";

// Acciones

// Visuales

/**
 * Hook que calcula la medalla obtenida por cada día de una semana.
 *
 * Dado un arreglo de 7 fechas (weekDates), para cada una:
 * - Busca la rutina asociada en la base de datos.
 * - Si no existe rutina, asigna "none".
 * - Si existe, calcula el progreso y toma la medalla resultante
 *   ("bronce", "plata", "oro" o "none").
 *
 * Devuelve un arreglo de 7 posiciones con la medalla de cada día, en el
 * mismo orden que las fechas recibidas.
 */
export function useWeekMedals(weekDates: Date[]) {
  // Estado con la medalla por cada día de la semana. Por defecto todas
  // empiezan en "none" hasta que se cargan los datos reales.
  const [medals, setMedals] = useState<Medal[]>(Array(7).fill("none"));

  useEffect(() => {
    const fetchMedals = async () => {
      const results: Medal[] = [];

      for (const date of weekDates) {
        const dateString = date.toISOString().slice(0, 10);

        // Se obtiene la rutina asociada a la fecha. Si no hay rutina,
        // ese día no tiene medalla.
        const routine = await getRoutineByDate(dateString);
        if (!routine?.id) {
          results.push("none");
          continue;
        }

        // Calcula el progreso de la rutina y añade la medalla obtenida
        // (según el porcentaje de tareas completadas).
        const progress = await getRoutineProgress(routine.id);
        results.push(progress.medal);
      }

      setMedals(results);
    };

    fetchMedals();
  }, [weekDates]);

  return medals;
}
