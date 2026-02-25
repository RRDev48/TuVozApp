import { useCallback, useState } from "react";

export const useModals = () => {
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [isTaskDetailsModalVisible, setIsTaskDetailsModalVisible] =
    useState(false);
  const [isTaskStepModalVisible, setIsTaskStepModalVisible] = useState(false);
  const [isAchievementModalVisible, setIsAchievementModalVisible] =
    useState(false);

  const toggleAddTask = useCallback(() => {
    setIsAddTaskModalVisible((prev) => !prev);
  }, []);

  const openTaskDetails = useCallback(() => {
    setIsTaskDetailsModalVisible(true);
  }, []);

  const closeTaskDetails = useCallback(() => {
    setIsTaskDetailsModalVisible(false);
  }, []);

  const openTaskStepModal = useCallback(() => {
    setIsTaskStepModalVisible(true);
  }, []);

  const closeTaskStepModal = useCallback(() => {
    setIsTaskStepModalVisible(false);
  }, []);

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
    setIsAddTaskModalVisible,
  };
};
