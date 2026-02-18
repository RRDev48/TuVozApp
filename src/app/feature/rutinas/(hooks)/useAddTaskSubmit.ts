// React
import { Alert } from "react-native";

// Componentes

// Constantes

// Modelos
import { Task } from "../(models)/task.types";

// Hooks

// Servicios
import { supabase } from "@/src/lib/supabaseClient";
import { createRoutine, getRoutineByDate } from "../(services)/routine.service";
import {
  createTask,
  createTaskSteps,
  linkTaskToRoutine,
} from "../(services)/task.service";

// Acciones

// Visuales

/**
 * Hook que encapsula toda la lógica de envío del formulario de "Agregar tarea".
 *
 * Responsabilidades:
 * - Validar los campos obligatorios antes de crear la tarea.
 * - Asegurar que exista una rutina para la fecha seleccionada (crearla si no).
 * - Construir el payload en formato de BD y llamar al servicio `createTask`.
 * - Vincular la tarea a la rutina mediante `linkTaskToRoutine`.
 * - Crear los pasos de la tarea mediante `createTaskSteps`.
 * - Mapear la tarea creada al modelo de UI y actualizar la lista local.
 * - Manejar estados de carga, reseteo de campos y despliegue del modal de éxito.
 */
export const useAddTaskSubmit = (
  setIsLoading: (loading: boolean) => void,
  setShowSuccessModal: (show: boolean) => void,
  resetFields: () => void,
  updateTasks: (task: Task) => void,
  profileId: string,
) => {
  // Función principal que se llama al confirmar la creación de una tarea
  // desde el modal `AddTaskModal`.
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

      // Validar campos obligatorios
      if (!taskName.trim()) {
        Alert.alert("Error", "Por favor, ingresa el nombre de la tarea.");
        setIsLoading(false);
        return;
      }

      if (!taskStartTime || !taskEndTime) {
        Alert.alert("Error", "Por favor, selecciona el horario de la tarea.");
        setIsLoading(false);
        return;
      }

      if (!category) {
        Alert.alert("Error", "Por favor, selecciona una categoría.");
        setIsLoading(false);
        return;
      }

      if (!dueDate) {
        Alert.alert("Error", "Por favor, selecciona una fecha.");
        setIsLoading(false);
        return;
      }

      // Se obtiene (o crea) la rutina correspondiente a la fecha escogida.
      const formattedDate = formatDateToDB(dueDate);
      let routine = await getRoutineByDate(profileId, formattedDate);

      if (!routine) {
        routine = await createRoutine(profileId, formattedDate);
      }

      // Limpia los pasos, quedándose solo con los textos no vacíos.
      const validSteps = steps
        .map((step) => step.text.trim())
        .filter((text) => text.length > 0);

      // Calcula, si corresponde, la fecha/hora exacta del recordatorio.
      const reminderDate = calculateReminderDate();

      // Payload en formato de BD para crear la tarea en Supabase.
      const newTaskData = {
        profile_id: profileId,
        category_id: parseInt(category, 10),
        title: taskName.trim(),
        status: "Pendiente" as const,
        start_time: taskStartTime,
        end_time: taskEndTime,
        reminder: reminderDate ? reminderDate.toISOString() : null,
      };

      // 1. Crear la tarea
      const createdTask = await createTask(newTaskData);

      // 2. Obtener el número de tareas existentes para determinar el orden
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

      // 3. Vincular la tarea a la rutina
      await linkTaskToRoutine(routine.id, createdTask.id, nextOrder);

      // 4. Crear los pasos de la tarea si existen
      if (validSteps.length > 0) {
        const stepsToCreate = validSteps.map((stepTitle, index) => ({
          title: stepTitle,
          step_order: index + 1,
        }));
        await createTaskSteps(createdTask.id, stepsToCreate);
      }

      // Mapeo de la tarea creada al modelo `Task` usado en la UI.
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

      // Actualiza la lista de tareas en la pantalla, limpia el formulario
      // y muestra el modal de éxito.
      updateTasks(taskForUI);
      resetFields();
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al crear la tarea:", error);
      Alert.alert(
        "Error",
        "No se pudo crear la tarea. Por favor, inténtalo de nuevo.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { handleAddTask };
};
