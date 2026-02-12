// React
import { useEffect, useState } from "react";

// Componentes

// Constantes

// Modelos

// Hooks

// Servicios

// Acciones

import { ReminderOption } from "../(models)/options.types";

// Visuales

// Opciones de recordatorio predefinidas que se muestran en el modal.
// Los valores se expresan en milisegundos: 10 min, 1 hora, 1 día.
const REMINDER_OPTIONS: ReminderOption[] = [
  { label: "10 Minutos Antes", value: "600000" },
  { label: "1 Hora Antes", value: "3600000" },
  { label: "1 Día Antes", value: "86400000" },
];

/**
 * Hook para gestionar la selección de un recordatorio en el modal
 * de recordatorios de tareas.
 *
 * Recibe:
 * - `initialSelectedOption`: valor actual guardado (en ms como string) o null.
 * - `visible`: indica si el modal está abierto, para resetear el estado
 *   cuando se abre/cierra.
 *
 * Expone:
 * - `selectedOption`: valor seleccionado actualmente.
 * - `setSelectedOption`: setter para cambiar la selección.
 * - `options`: lista de opciones disponibles.
 * - `getSelectedLabel`: helper para obtener el label de la opción elegida.
 * - `getSelectedOffsetMs`: helper que devuelve el offset en milisegundos
 *   (number) o null si no hay selección.
 */
export const useReminderPicker = (
  initialSelectedOption: string | null | undefined,
  visible: boolean,
) => {
  // Estado con el valor de opción seleccionado (string en ms) o null.
  const [selectedOption, setSelectedOption] = useState<string | null>(
    initialSelectedOption || null,
  );

  // Cuando cambia la opción inicial o se abre/cierra el modal, se sincroniza
  // el estado local con el valor externo.
  useEffect(() => {
    setSelectedOption(initialSelectedOption || null);
  }, [initialSelectedOption, visible]);

  // Devuelve el label legible de la opción actualmente seleccionada.
  const getSelectedLabel = (): string => {
    return (
      REMINDER_OPTIONS.find((option) => option.value === selectedOption)
        ?.label || ""
    );
  };

  // Devuelve el offset en milisegundos de la opción seleccionada
  // (parseando el string) o null si no hay selección.
  const getSelectedOffsetMs = (): number | null => {
    if (!selectedOption) return null;
    return parseInt(selectedOption, 10);
  };

  return {
    selectedOption,
    setSelectedOption,
    options: REMINDER_OPTIONS,
    getSelectedLabel,
    getSelectedOffsetMs,
  };
};
