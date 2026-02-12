// React
import { useEffect, useState } from "react";

// Componentes

// Constantes

// Modelos

// Hooks

// Servicios
import { Medal } from "../(models)/routine.types";
import { getRoutineProgress } from "../(services)/progress.service";

// Acciones

// Visuales

/**
 * Hook que obtiene y expone el progreso de una rutina específica.
 *
 * A partir de un `routineId`:
 * - Consulta el servicio `getRoutineProgress`.
 * - Guarda en estado local: tareas completadas, total, porcentaje y medalla.
 * - Se vuelve a calcular automáticamente cada vez que cambia el `routineId` o
 *   el `refreshTrigger` (útil para forzar la recarga cuando cambian las tareas).
 */
export function useRoutineProgress(
  routineId: number,
  refreshTrigger?: number | string,
) {
  // Número de tareas completadas de la rutina.
  const [completed, setCompleted] = useState(0);
  // Número total de tareas de la rutina.
  const [total, setTotal] = useState(0);
  // Porcentaje de progreso (0–100).
  const [percent, setPercent] = useState(0);
  // Medalla asociada al porcentaje actual.
  const [medal, setMedal] = useState<Medal>("none");

  useEffect(() => {
    if (!routineId) return;

    getRoutineProgress(routineId).then((progress) => {
      setCompleted(progress.completed);
      setTotal(progress.total);
      setPercent(progress.percent);
      setMedal(progress.medal);
    });
  }, [routineId, refreshTrigger]);

  return { completed, total, percent, medal };
}
