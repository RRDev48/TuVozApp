// React
import { useCallback, useState } from "react";

// Componentes

// Constantes

// Modelos

// Hooks

// Servicios

// Acciones

// Visuales

/**
 * Hook para manejar la navegación de pasos dentro del modal de tarea.
 *
 * Responsabilidades:
 * - Llevar el índice del paso actual (`currentStepIndex`).
 * - Avanzar al siguiente paso o finalizar la tarea cuando se llega al último.
 * - Volver al paso anterior cuando sea posible.
 * - Actualizar el estado de la tarea al completar o cerrar el flujo de pasos.
 */
export const useTaskStepModal = (
  taskId: string | undefined,
  totalSteps: number,
  updateTaskState: (taskId: string, newState: string) => void,
  onRestart: () => void,
  onClose: () => void,
) => {
  // Índice del paso actual que se está mostrando en el modal.
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Maneja el avance al siguiente paso. Si aún no es el último paso,
  // simplemente incrementa el índice. Si ya es el último:
  // - marca la tarea como "Completado",
  // - resetea el índice a 0,
  // - dispara `onRestart` (para que el flujo externo se reinicie si es necesario),
  // - cierra el modal.
  const handleNextStep = useCallback(() => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      if (taskId) {
        updateTaskState(taskId, "Completado");
      }
      setCurrentStepIndex(0);
      onRestart();
      onClose();
    }
  }, [
    currentStepIndex,
    totalSteps,
    taskId,
    updateTaskState,
    onRestart,
    onClose,
  ]);

  // Permite retroceder un paso siempre que no estemos en el primero.
  const handleBackStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  // Cierra el modal de pasos sin completar la tarea.
  // En este caso se asegura de dejar la tarea al menos en estado
  // "En Proceso" (si existe id), resetea el índice y llama a `onClose`.
  const handleClose = useCallback(() => {
    if (taskId) {
      updateTaskState(taskId, "En Proceso");
    }
    setCurrentStepIndex(0);
    onClose();
  }, [taskId, updateTaskState, onClose]);

  return {
    currentStepIndex,
    handleNextStep,
    handleBackStep,
    handleClose,
  };
};
