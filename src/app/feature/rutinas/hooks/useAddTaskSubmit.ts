import { useState } from "react";
import { Task } from "../models/task.types";
import { createRoutine, getRoutineByDate } from "../services/routine.service";
import {
  createTask,
  createTaskSteps,
  replaceTaskSteps,
  updateTask,
} from "../services/task.service";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === "object" && error !== null) {
    const possibleError = error as { message?: string };
    return possibleError.message || fallback;
  }

  return fallback;
}

export const useAddTaskSubmit = (
  setIsLoading: (loading: boolean) => void,
  setShowSuccessModal: (show: boolean) => void,
  resetFields: () => void,
  updateTasks: (task: Task) => void,
  profileId: string,
  onTaskUpdated?: (task: Task) => void,
) => {
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const showError = (title: string, message: string) => {
    setErrorTitle(title);
    setErrorMessage(message);
    setErrorModalVisible(true);
  };

  const closeErrorModal = () => {
    setErrorModalVisible(false);
  };

  const handleAddTask = async (
    taskName: string,
    taskStartTime: string,
    taskEndTime: string,
    category: string,
    dueDate: Date | null,
    steps: { id: number; text: string }[],
    calculateReminderDate: () => Date | null,
    formatDateToDB: (date: Date) => string,
  ) => {
    try {
      setIsLoading(true);

      if (!taskName.trim()) {
        showError("Error", "Por favor, ingresa el nombre de la tarea.");
        setIsLoading(false);
        return;
      }

      if (!taskStartTime || !taskEndTime) {
        showError("Error", "Por favor, selecciona el horario de la tarea.");
        setIsLoading(false);
        return;
      }

      if (!category) {
        showError("Error", "Por favor, selecciona una categoría.");
        setIsLoading(false);
        return;
      }

      if (!dueDate) {
        showError("Error", "Por favor, selecciona una fecha.");
        setIsLoading(false);
        return;
      }

      const formattedDate = formatDateToDB(dueDate);
      let routine = await getRoutineByDate(profileId, formattedDate);

      if (!routine) {
        routine = await createRoutine(profileId, formattedDate);
      }

      const validSteps = steps
        .map((step) => step.text.trim())
        .filter((text) => text.length > 0);

      const reminderDate = calculateReminderDate();

      const newTaskData = {
        routine_id: routine.id,
        category_id: parseInt(category, 10),
        title: taskName.trim(),
        status: "Pendiente" as const,
        start_time: taskStartTime,
        end_time: taskEndTime,
        reminder: reminderDate ? reminderDate.toISOString() : null,
      };

      const createdTask = await createTask(newTaskData);

      if (validSteps.length > 0) {
        const stepsToCreate = validSteps.map((stepTitle, index) => ({
          description: stepTitle,
          step_order: index + 1,
        }));
        await createTaskSteps(createdTask.id, stepsToCreate);
      }

      const taskForUI: Task = {
        id: createdTask.id.toString(),
        categoriaId: category,
        horarioDesde: taskStartTime,
        horarioHasta: taskEndTime,
        pasos: validSteps,
        titulo: taskName.trim(),
        diaRutina: formattedDate,
        estado: "Pendiente",
      };

      updateTasks(taskForUI);
      resetFields();
      setShowSuccessModal(true);
    } catch (error) {
      showError(
        "Error",
        getErrorMessage(
          error,
          "No se pudo crear la tarea. Por favor, inténtalo de nuevo.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleAddTask,
    handleEditTask: async (
      taskId: string,
      taskName: string,
      taskStartTime: string,
      taskEndTime: string,
      category: string,
      dueDate: Date | null,
      steps: { id: number; text: string }[],
      calculateReminderDate: () => Date | null,
      formatDateToDB: (date: Date) => string,
    ) => {
      try {
        setIsLoading(true);
        if (!taskName.trim()) {
          showError("Error", "Por favor, ingresa el nombre de la tarea.");
          setIsLoading(false);
          return;
        }
        if (!taskStartTime || !taskEndTime) {
          showError("Error", "Por favor, selecciona el horario de la tarea.");
          setIsLoading(false);
          return;
        }
        if (!category) {
          showError("Error", "Por favor, selecciona una categoría.");
          setIsLoading(false);
          return;
        }
        if (!dueDate) {
          showError("Error", "Por favor, selecciona una fecha.");
          setIsLoading(false);
          return;
        }
        const reminderDate = calculateReminderDate();
        const updatedTaskDb = await updateTask(Number(taskId), {
          category_id: parseInt(category, 10),
          title: taskName.trim(),
          start_time: taskStartTime,
          end_time: taskEndTime,
          reminder: reminderDate ? reminderDate.toISOString() : null,
        });
        const validSteps = steps
          .map((s) => s.text.trim())
          .filter((t) => t.length > 0);
        await replaceTaskSteps(
          updatedTaskDb.id,
          validSteps.map((description, index) => ({
            description,
            step_order: index + 1,
          })),
        );
        const formattedDate = formatDateToDB(dueDate);
        const taskForUI: Task = {
          id: taskId,
          categoriaId: category,
          horarioDesde: taskStartTime,
          horarioHasta: taskEndTime,
          pasos: validSteps,
          titulo: taskName.trim(),
          diaRutina: formattedDate,
          estado: updatedTaskDb.status,
        };
        (onTaskUpdated ?? updateTasks)(taskForUI);
        resetFields();
        setShowSuccessModal(true);
      } catch (error) {
        showError(
          "Error",
          getErrorMessage(
            error,
            "No se pudo guardar la tarea. Por favor, inténtalo de nuevo.",
          ),
        );
      } finally {
        setIsLoading(false);
      }
    },
    errorModalVisible,
    errorTitle,
    errorMessage,
    closeErrorModal,
  };
};
