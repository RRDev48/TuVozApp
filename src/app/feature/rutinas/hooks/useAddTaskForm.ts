import { useEffect, useState } from "react";

export const useAddTaskForm = (
  selectedDate: Date | null,
  selectedStartHour: string,
  calculateEndHour: string,
) => {
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(selectedDate);
  const [taskStartTime, setTaskStartTime] = useState<string>(selectedStartHour);
  const [taskEndTime, setTaskEndTime] = useState<string>(calculateEndHour);
  const [category, setCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [reminder, setReminder] = useState<{
    label: string | null;
    offsetMs: number | null;
  }>({ label: null, offsetMs: null });
  const [steps, setSteps] = useState<{ id: number; text: string }[]>([
    { id: 1, text: "" },
  ]);

  useEffect(() => {
    setDueDate(selectedDate);
    setTaskStartTime(selectedStartHour);
    setTaskEndTime(calculateEndHour);
  }, [selectedDate, selectedStartHour, calculateEndHour]);

  const handleTimeSelected = (startTime: string, endTime: string) => {
    setTaskStartTime(startTime);
    setTaskEndTime(endTime);
  };

  const handleReminderSet = (reminderData: {
    label: string;
    offsetMs: number;
  }) => {
    setReminder({ label: reminderData.label, offsetMs: reminderData.offsetMs });
  };

  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    setCategory(categoryId);
    setCategoryName(categoryName);
  };

  const handleAddStep = () => {
    setSteps((prev) => [...prev, { id: prev.length + 1, text: "" }]);
  };

  const handleRemoveStep = (index: number) => {
    const updatedSteps = steps
      .filter((_, idx) => idx !== index)
      .map((step, idx) => ({ ...step, id: idx + 1 }));
    setSteps(updatedSteps);
  };

  const handleStepChange = (text: string, index: number) => {
    const updatedSteps = steps.map((step, idx) =>
      idx === index ? { ...step, text } : step,
    );
    setSteps(updatedSteps);
  };

  const resetFields = () => {
    setTaskName("");
    setSteps([{ id: 1, text: "" }]);
    setDueDate(null);
    setCategory("");
    setCategoryName("");
    setReminder({ label: null, offsetMs: null });
    setTaskStartTime("");
    setTaskEndTime("");
  };

  const calculateReminderDate = (): Date | null => {
    if (!reminder.offsetMs || !dueDate || !taskStartTime) return null;

    const [hours, minutes] = taskStartTime.split(":").map(Number);
    const taskDateTime = new Date(dueDate);
    taskDateTime.setHours(hours, minutes, 0, 0);

    const reminderTime = taskDateTime.getTime() - reminder.offsetMs;
    return new Date(reminderTime);
  };

  const formatDateToDB = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return {
    taskName,
    setTaskName,
    dueDate,
    setDueDate,
    taskStartTime,
    taskEndTime,
    category,
    categoryName,
    reminder,
    steps,
    handleTimeSelected,
    handleReminderSet,
    handleCategorySelect,
    handleAddStep,
    handleRemoveStep,
    handleStepChange,
    resetFields,
    calculateReminderDate,
    formatDateToDB,
    formatDate,
  };
};
