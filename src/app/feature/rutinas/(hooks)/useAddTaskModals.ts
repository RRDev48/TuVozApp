// React
import { useState } from "react";

// Componentes

// Constantes

// Modelos

// Hooks

// Servicios

// Acciones

// Visuales

/**
 * Hook que agrupa todos los estados de visibilidad de los modales
 * usados dentro de `AddTaskModal`:
 * - Calendario de fecha.
 * - Selector de horario.
 * - Selector de recordatorio.
 * - Selector de categoría.
 * - Modal de éxito.
 * - Modal de confirmación de cancelación.
 */
export const useAddTaskModals = () => {
  // Visibilidad del modal de calendario (fecha de la tarea).
  const [isRoutineCalendarVisible, setIsCalendarVisible] = useState(false);
  // Visibilidad del modal de selección de horario.
  const [isRoutineTimeVisible, setIsRoutineTimeVisible] = useState(false);
  // Visibilidad del modal de recordatorio.
  const [isReminderVisible, setIsReminderVisible] = useState(false);
  // Visibilidad del modal de selección de categoría.
  const [isCategoryVisible, setIsCategoryVisible] = useState(false);
  // Controla la aparición del modal de éxito tras crear la tarea.
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // Controla el modal de confirmación cuando el usuario quiere cancelar.
  const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);

  return {
    isRoutineCalendarVisible,
    setIsCalendarVisible,
    isRoutineTimeVisible,
    setIsRoutineTimeVisible,
    isReminderVisible,
    setIsReminderVisible,
    isCategoryVisible,
    setIsCategoryVisible,
    showSuccessModal,
    setShowSuccessModal,
    showConfirmCancelModal,
    setShowConfirmCancelModal,
  };
};
