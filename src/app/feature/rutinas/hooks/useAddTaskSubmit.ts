import { supabase } from "@/src/lib/supabaseClient";
import { useState } from "react";
import { Task } from "../models/task.types";
import { createRoutine, getRoutineByDate } from "../services/routine.service";
import {
  createTask,
  createTaskSteps,
  linkTaskToRoutine,
} from "../services/task.service";

export const useAddTaskSubmit = (
  setIsLoading: (loading: boolean) => void,
  setShowSuccessModal: (show: boolean) => void,
  resetFields: () => void,
  updateTasks: (task: Task) => void,
  profileId: string,
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
        profile_id: profileId,
        category_id: parseInt(category, 10),
        title: taskName.trim(),
        status: "Pendiente" as const,
        start_time: taskStartTime,
        end_time: taskEndTime,
        reminder: reminderDate ? reminderDate.toISOString() : null,
      };

      const createdTask = await createTask(newTaskData);

      const { data: existingRoutineTasks } = await supabase
        .from("routine_tasks")
        .select("task_order")
        .eq("routine_id", routine.id)
        .order("task_order", { ascending: false })
        .limit(1);

      const nextOrder =
        existingRoutineTasks && existingRoutineTasks.length > 0
          ? existingRoutineTasks[0].task_order + 1
          : 1;

      await linkTaskToRoutine(routine.id, createdTask.id, nextOrder);

      if (validSteps.length > 0) {
        const stepsToCreate = validSteps.map((stepTitle, index) => ({
          title: stepTitle,
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
      console.error("Error al crear la tarea:", error);
      showError(
        "Error",
        "No se pudo crear la tarea. Por favor, inténtalo de nuevo.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleAddTask,
    errorModalVisible,
    errorTitle,
    errorMessage,
    closeErrorModal,
  };
};
