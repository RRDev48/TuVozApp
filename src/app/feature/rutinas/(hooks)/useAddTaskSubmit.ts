// React
import { Alert } from "react-native";

// Componentes

// Constantes

// Modelos
import { Task } from "../(models)/task.types";

// Hooks

// Servicios
import { createRoutine, getRoutineByDate } from "../(services)/routine.service";
import { createTask } from "../(services)/task.service";

// Acciones

// Visuales

/**
 * Hook que encapsula toda la lógica de envío del formulario de "Agregar tarea".
 *
 * Responsabilidades:
 * - Validar los campos obligatorios antes de crear la tarea.
 * - Asegurar que exista una rutina para la fecha seleccionada (crearla si no).
 * - Construir el payload en formato de BD y llamar al servicio `createTask`.
 * - Mapear la tarea creada al modelo de UI y actualizar la lista local.
 * - Manejar estados de carga, reseteo de campos y despliegue del modal de éxito.
 */
export const useAddTaskSubmit = (
  setIsLoading: (loading: boolean) => void,
  setShowSuccessModal: (show: boolean) => void,
  resetFields: () => void,
  updateTasks: (task: Task) => void,
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
      let routine = await getRoutineByDate(formattedDate);

      if (!routine) {
        routine = await createRoutine(formattedDate);
      }

      // Limpia los pasos, quedándose solo con los textos no vacíos.
      const validSteps = steps
        .map((step) => step.text.trim())
        .filter((text) => text.length > 0);

      // Calcula, si corresponde, la fecha/hora exacta del recordatorio.
      const reminderDate = calculateReminderDate();

      // Payload en formato de BD para crear la tarea en Supabase.
      const newTaskData = {
        routine_id: routine.id,
        category_id: parseInt(category, 10),
        title: taskName.trim(),
        status: "Pendiente" as const,
        start_time: taskStartTime,
        end_time: taskEndTime,
        steps: validSteps,
        reminder: reminderDate ? reminderDate.toISOString() : null,
      };

      const createdTask = await createTask(newTaskData);

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
