// React
import { useEffect } from "react";

// Componentes

// Constantes

// Modelos

// Hooks

// Servicios

// Acciones

// Visuales

/**
 * Hook genérico para autocerrar algo (por ejemplo, un modal o toast)
 * después de un cierto tiempo cuando está visible.
 *
 * Parámetros:
 * - `visible`: indica si el componente asociado está actualmente visible.
 * - `onClose`: función que se llamará automáticamente al cumplirse el tiempo.
 * - `delay`: tiempo en milisegundos antes de ejecutar `onClose`
 *   (por defecto 3000 ms = 3 segundos).
 */
export const useAutoClose = (
  visible: boolean,
  onClose: () => void,
  delay: number = 3000,
) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, delay);

      // Limpia el timeout si el componente se desmonta o si `visible`
      // cambia a false antes de que se cumpla el tiempo.
      return () => clearTimeout(timer);
    }
  }, [visible, onClose, delay]);
};
