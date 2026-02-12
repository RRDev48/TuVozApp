// React
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

// Componentes
import { TaskStepModalProps } from "../../(models)/component.props";
import { ConfirmCancelModal } from "./ConfirmCancelModal";
import { SuccessModal } from "./SuccessModal";

// Constantes

// Modelos

// Hooks
import { useTaskStepModal } from "../../(hooks)/useTaskStepModal";

// Servicios

// Acciones

// Visuales
import {
  addTaskStyles,
  taskStepsStyles,
} from "@/src/app/design-system/styles/tasks-Styles";

/**
 * Modal que guía al usuario por los pasos de una tarea.
 *
 * Responsabilidades principales:
 * - Mostrar de forma secuencial cada paso de la tarea seleccionada.
 * - Permitir avanzar y retroceder entre pasos.
 * - Notificar el cambio de estado de la tarea (por ejemplo, a "Completada")
 *   cuando se finalizan todos los pasos.
 * - Permitir reiniciar la ejecución de los pasos o cerrar el modal.
 *
 * La lógica de navegación entre pasos y actualización de estado se delega en
 * el hook `useTaskStepModal`, manteniendo este componente enfocado en la
 * presentación y en conectar los callbacks.
 */
export const TaskStepModal = ({
  visible,
  task,
  onClose,
  onRestart,
  updateTaskState,
}: TaskStepModalProps) => {
  // const { formatText } = usePersonalization();

  // Estados para controlar la visibilidad de los modales de confirmación y éxito
  const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Hook que encapsula la lógica de pasos: índice actual, siguiente, anterior
  // y cierre. Recibe la información mínima de la tarea y callbacks externos.
  const { currentStepIndex, handleNextStep, handleBackStep, handleClose } =
    useTaskStepModal(
      task?.id,
      task?.pasos.length || 0,
      updateTaskState,
      onRestart,
      onClose,
    );

  // Muestra el modal de confirmación al presionar X
  const handleCancelClick = () => {
    setShowConfirmCancelModal(true);
  };

  // Confirma el cierre: cambia el estado a "En Proceso" y cierra los modales
  const handleConfirmCancel = () => {
    setShowConfirmCancelModal(false);
    setTimeout(() => {
      if (task?.id) {
        updateTaskState(task.id, "En Proceso");
      }
      onRestart();
      onClose();
    }, 100);
  };

  // Cancela el cierre: solo oculta el modal de confirmación
  const handleCancelCancel = () => {
    setShowConfirmCancelModal(false);
  };

  // Maneja el avance de pasos y finalización
  const handleStepAction = () => {
    if (currentStepIndex < (task?.pasos.length || 0) - 1) {
      // Si no es el último paso, avanzar normalmente
      handleNextStep();
    } else {
      // Si es el último paso, mostrar el modal de éxito
      if (task?.id) {
        updateTaskState(task.id, "Completado");
      }
      setShowSuccessModal(true);
    }
  };

  // Cierra el modal de éxito y cierra el TaskStepModal
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setTimeout(() => {
      onRestart();
      onClose();
    }, 300);
  };

  // Si no hay tarea seleccionada, no se muestra ningún contenido.
  if (!task) return null;

  return (
    // Modal nativo que se superpone al contenido actual de la app.
    <Modal visible={visible} transparent animationType="slide">
      <View style={taskStepsStyles.detailsOverlay}>
        <View style={taskStepsStyles.detailsContainer}>
          {/* Encabezado que muestra el número de paso actual y el total. */}
          <View style={taskStepsStyles.titleTaskContainer}>
            <Text style={taskStepsStyles.taskDetailsTitle}>
              {`Paso ${currentStepIndex + 1} de ${task.pasos.length}`}
            </Text>
          </View>

          {/* Contenedor principal del texto del paso actual. */}
          <View style={taskStepsStyles.stepContainer}>
            <Text style={taskStepsStyles.taskStepText}>
              {task.pasos[currentStepIndex]}
            </Text>
          </View>

          {/* Contenedor de los botones de navegación entre pasos. */}
          <View style={taskStepsStyles.buttonContainer}>
            {/* Botón para volver al paso anterior. Se deshabilita cuando estamos
                en el primer paso (índice 0). */}
            <TouchableOpacity
              style={[
                taskStepsStyles.backButton,
                currentStepIndex === 0 && taskStepsStyles.disabledButton,
              ]}
              onPress={handleBackStep}
              disabled={currentStepIndex === 0}
            >
              <Text style={taskStepsStyles.buttonText}>{"Volver Paso"}</Text>
            </TouchableOpacity>

            {/* Botón que avanza al siguiente paso o finaliza la tarea cuando
                ya estamos en el último paso. */}
            <TouchableOpacity
              style={taskStepsStyles.nextButton}
              onPress={handleStepAction}
            >
              <Text style={taskStepsStyles.buttonText}>
                {currentStepIndex < task.pasos.length - 1
                  ? "Siguiente Paso"
                  : "Terminar Tarea"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botón "X" de cierre rápido del modal, reutilizando el estilo
              general de cierre definido para los modales de tareas. */}
          <TouchableOpacity
            onPress={handleCancelClick}
            style={addTaskStyles.closeXButton}
          >
            <Text style={addTaskStyles.closeXButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de éxito que se muestra cuando la tarea se completa. */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={handleSuccessModalClose}
        message={"Tarea terminada con éxito"}
      />

      {/* Modal de confirmación que aparece al intentar cerrar sin completar. */}
      <ConfirmCancelModal
        visible={showConfirmCancelModal}
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelCancel}
        message={"¿Desea salir sin completar la tarea?"}
      />
    </Modal>
  );
};

export default TaskStepModal;
