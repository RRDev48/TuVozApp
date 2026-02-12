// React
import { useEffect, useState } from "react";

// Componentes

// Constantes

// Modelos

// Hooks

// Servicios

// Acciones

// Visuales

/**
 * Hook que maneja todo el estado del formulario de "Agregar tarea".
 *
 * Orquesta:
 * - Nombre de la tarea.
 * - Fecha seleccionada.
 * - Horario de inicio y fin.
 * - Categoría (id + nombre mostrado).
 * - Recordatorio (label + offset en ms).
 * - Lista de pasos de la tarea.
 *
 * Además ofrece helpers para:
 * - Resetear el formulario.
 * - Calcular la fecha/hora exacta del recordatorio.
 * - Formatear fechas para mostrar y para guardar en BD.
 */
export const useAddTaskForm = (
  selectedDate: Date | null,
  selectedStartHour: string,
  calculateEndHour: string,
) => {
  // Nombre de la tarea.
  const [taskName, setTaskName] = useState("");
  // Fecha de la tarea (inicialmente la seleccionada en el calendario).
  const [dueDate, setDueDate] = useState<Date | null>(selectedDate);
  // Hora de inicio/fin propuestas a partir del slot seleccionado.
  const [taskStartTime, setTaskStartTime] = useState<string>(selectedStartHour);
  const [taskEndTime, setTaskEndTime] = useState<string>(calculateEndHour);
  // Categoría seleccionada (id) y su nombre amigable.
  const [category, setCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");
  // Información del recordatorio asociado a la tarea.
  const [reminder, setReminder] = useState<{
    label: string | null;
    offsetMs: number | null;
  }>({ label: null, offsetMs: null });
  // Lista de pasos (al menos uno vacío por defecto).
  const [steps, setSteps] = useState<{ id: number; text: string }[]>([
    { id: 1, text: "" },
  ]);

  // Cuando cambian la fecha/hora iniciales (por ejemplo al seleccionar
  // otro slot en el calendario), se sincroniza el formulario con esos
  // nuevos valores por defecto.
  useEffect(() => {
    setDueDate(selectedDate);
    setTaskStartTime(selectedStartHour);
    setTaskEndTime(calculateEndHour);
  }, [selectedDate, selectedStartHour, calculateEndHour]);

  // Actualiza horario de inicio y fin cuando el usuario selecciona un rango
  // en el modal de tiempo.
  const handleTimeSelected = (startTime: string, endTime: string) => {
    setTaskStartTime(startTime);
    setTaskEndTime(endTime);
  };

  // Guarda la opción de recordatorio seleccionada (label + offset ms).
  const handleReminderSet = (reminderData: {
    label: string;
    offsetMs: number;
  }) => {
    setReminder({ label: reminderData.label, offsetMs: reminderData.offsetMs });
  };

  // Actualiza la categoría elegida en el picker de categorías.
  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    setCategory(categoryId);
    setCategoryName(categoryName);
  };

  // Añade un nuevo paso vacío al final de la lista.
  const handleAddStep = () => {
    setSteps((prev) => [...prev, { id: prev.length + 1, text: "" }]);
  };

  // Elimina un paso por índice y reenumera los ids para mantenerlos
  // consecutivos.
  const handleRemoveStep = (index: number) => {
    const updatedSteps = steps
      .filter((_, idx) => idx !== index)
      .map((step, idx) => ({ ...step, id: idx + 1 }));
    setSteps(updatedSteps);
  };

  // Actualiza el texto de un paso concreto.
  const handleStepChange = (text: string, index: number) => {
    const updatedSteps = steps.map((step, idx) =>
      idx === index ? { ...step, text } : step,
    );
    setSteps(updatedSteps);
  };

  // Devuelve el formulario a su estado inicial (sin datos).
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

  // Calcula la fecha/hora exacta del recordatorio a partir de la fecha
  // y hora de la tarea y el offset seleccionado.
  const calculateReminderDate = (): Date | null => {
    if (!reminder.offsetMs || !dueDate || !taskStartTime) return null;

    const [hours, minutes] = taskStartTime.split(":").map(Number);
    const taskDateTime = new Date(dueDate);
    taskDateTime.setHours(hours, minutes, 0, 0);

    const reminderTime = taskDateTime.getTime() - reminder.offsetMs;
    return new Date(reminderTime);
  };

  // Formatea la fecha a formato YYYY-MM-DD para guardarla en la BD.
  const formatDateToDB = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Formatea la fecha a DD-MM-YYYY para mostrarla en la UI.
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
