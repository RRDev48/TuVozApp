import { useEffect, useState } from "react";
import { Task } from "../models/task.types";

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

  const loadTaskForEdit = (task: Task) => {
    setTaskName(task.titulo);
    if (task.diaRutina) {
      const [year, month, day] = task.diaRutina.split("-").map(Number);
      setDueDate(new Date(year, month - 1, day));
    }
    setTaskStartTime(task.horarioDesde || "");
    setTaskEndTime(task.horarioHasta || "");
    setCategory(task.categoriaId || "");
    setCategoryName(task.categoriaNombre || "");
    setSteps(
      task.pasos.length > 0
        ? task.pasos.map((text, i) => ({ id: i + 1, text }))
        : [{ id: 1, text: "" }],
    );
    if (task.recordatorio && task.horarioDesde && task.diaRutina) {
      const [h, m] = task.horarioDesde.split(":").map(Number);
      const [yr, mo, dy] = task.diaRutina.split("-").map(Number);
      const taskStart = new Date(yr, mo - 1, dy, h, m, 0, 0).getTime();
      const reminderTime = new Date(task.recordatorio).getTime();
      const offsetMs = taskStart - reminderTime;
      const REMINDER_OPTIONS = [
        { label: "10 Minutos Antes", value: 600000 },
        { label: "1 Hora Antes", value: 3600000 },
        { label: "1 D\u00eda Antes", value: 86400000 },
      ];
      const match = REMINDER_OPTIONS.find((opt) => opt.value === offsetMs);
      setReminder(
        match
          ? { label: match.label, offsetMs: match.value }
          : { label: null, offsetMs: null },
      );
    } else {
      setReminder({ label: null, offsetMs: null });
    }
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
    loadTaskForEdit,
    calculateReminderDate,
    formatDateToDB,
    formatDate,
  };
};
