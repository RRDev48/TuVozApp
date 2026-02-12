// React
import { useEffect, useRef } from "react";

// Componentes

// Constantes

// Modelos

// Hooks

// Servicios

// Acciones

// Visuales

// Parámetros que controla este hook: porcentaje de avance y callback
// que muestra el modal/logro cuando se completa al 100%.
interface UseAchievementCelebrationParams {
  percent: number;
  onShowAchievement: () => void;
}

/**
 * Hook que dispara la "celebración" de logro cuando el porcentaje
 * de progreso llega al 100%.
 *
 * - Se asegura de no mostrar el logro múltiples veces mientras se
 *   mantenga en 100% (usa un ref como flag).
 * - Vuelve a permitir mostrar el logro si el porcentaje baja de 100%
 *   y luego vuelve a subir (reinicia el flag).
 */
export const useAchievementCelebration = ({
  percent,
  onShowAchievement,
}: UseAchievementCelebrationParams) => {
  // Flag que indica si ya se mostró el logro para el estado actual
  // de progreso (evita disparar la animación varias veces).
  const hasShownAchievement = useRef(false);

  useEffect(() => {
    // Cuando se llega o supera el 100% y aún no se mostró el logro,
    // marcamos el flag y ejecutamos el callback con un pequeño delay.
    if (percent >= 100 && !hasShownAchievement.current) {
      hasShownAchievement.current = true;
      setTimeout(() => {
        onShowAchievement();
      }, 100);
    }

    // Si el porcentaje baja de 100%, habilitamos de nuevo la posibilidad
    // de mostrar el logro cuando se vuelva a completar.
    if (percent < 100) {
      hasShownAchievement.current = false;
    }
  }, [percent, onShowAchievement]);
};
