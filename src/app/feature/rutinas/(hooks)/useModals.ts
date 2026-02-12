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
 * Hook centralizado para manejar la visibilidad de los modales principales
 * del flujo de rutinas:
 * - Modal de agregar tarea.
 * - Modal de detalles de tarea.
 * - Modal de pasos de tarea.
 * - Modal de logro/celebración.
 */
export const useModals = () => {
  // Controla si el modal de "Agregar tarea" está visible.
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  // Controla la visibilidad del modal de detalles de la tarea.
  const [isTaskDetailsModalVisible, setIsTaskDetailsModalVisible] =
    useState(false);
  // Controla la visibilidad del modal de pasos de la tarea.
  const [isTaskStepModalVisible, setIsTaskStepModalVisible] = useState(false);
  // Controla la visibilidad del modal de logro (AchievementModal).
  const [isAchievementModalVisible, setIsAchievementModalVisible] =
    useState(false);

  // Alterna la visibilidad del modal de agregar tarea.
  const toggleAddTask = useCallback(() => {
    setIsAddTaskModalVisible((prev) => !prev);
  }, []);

  // Abre y cierra el modal de detalles de la tarea.
  const openTaskDetails = useCallback(() => {
    setIsTaskDetailsModalVisible(true);
  }, []);

  const closeTaskDetails = useCallback(() => {
    setIsTaskDetailsModalVisible(false);
  }, []);

  // Abre y cierra el modal de pasos de la tarea.
  const openTaskStepModal = useCallback(() => {
    setIsTaskStepModalVisible(true);
  }, []);

  const closeTaskStepModal = useCallback(() => {
    setIsTaskStepModalVisible(false);
  }, []);

  // Abre y cierra el modal de logro.
  const openAchievementModal = useCallback(() => {
    setIsAchievementModalVisible(true);
  }, []);

  const closeAchievementModal = useCallback(() => {
    setIsAchievementModalVisible(false);
  }, []);

  return {
    isAddTaskModalVisible,
    isTaskDetailsModalVisible,
    isTaskStepModalVisible,
    isAchievementModalVisible,

    toggleAddTask,
    openTaskDetails,
    closeTaskDetails,
    openTaskStepModal,
    closeTaskStepModal,
    openAchievementModal,
    closeAchievementModal,
    // También se expone el setter directo del modal de agregar tarea por si
    // algún flujo necesita forzar un estado concreto.
    setIsAddTaskModalVisible,
  };
};
