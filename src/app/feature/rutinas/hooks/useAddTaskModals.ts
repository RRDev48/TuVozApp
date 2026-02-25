import { useState } from "react";

export const useAddTaskModals = () => {
  const [isRoutineCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isRoutineTimeVisible, setIsRoutineTimeVisible] = useState(false);
  const [isReminderVisible, setIsReminderVisible] = useState(false);
  const [isCategoryVisible, setIsCategoryVisible] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
