import { useCallback, useState } from "react";

export const useTaskStepModal = (
  taskId: string | undefined,
  totalSteps: number,
  updateTaskState: (taskId: string, newState: string) => void,
  onRestart: () => void,
  onClose: () => void,
) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

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

  const handleBackStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

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
