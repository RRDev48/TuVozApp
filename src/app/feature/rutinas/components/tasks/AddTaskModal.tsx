// React
import React, { useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Componentes
import { CategorPickeryModal } from "../pickers/CategoryPickerModal";
import { DatePickerModal } from "../pickers/DatePickerModal";
import { ReminderPickerModal } from "../pickers/ReminderPickerModal";
import { TimePickerModal } from "../pickers/TimePickerModal";
import { StepItem } from "../steps/StepsItemsModal";
import { ConfirmCancelModal } from "./ConfirmCancelModal";
import { SuccessModal } from "./SuccessModal";

// Constantes

// Modelos
import { AddTaskModalProps } from "../../(models)/component.props";

// Hooks
import { useAddTaskForm } from "../../(hooks)/useAddTaskForm";
import { useAddTaskModals } from "../../(hooks)/useAddTaskModals";
import { useAddTaskSubmit } from "../../(hooks)/useAddTaskSubmit";

// Servicios

// Acciones

// Visuales
import { addTaskStyles } from "@/src/app/design-system/styles/tasks-Styles";
import { Ionicons } from "@expo/vector-icons";

/**
 * AddTaskModal
 * ------------
 * Modal principal para crear una nueva tarea dentro de una rutina.
 *
 * Responsabilidades:
 * - Gestionar el formulario de creación de tarea (título, fecha, horario,
 *   recordatorio, categoría y pasos).
 * - Coordinar la apertura/cierre de los sub-modales (fecha, hora, recordatorio,
 *   categoría, confirmación de cancelación y éxito).
 * - Orquestar el envío de la tarea usando `useAddTaskSubmit`, incluyendo
 *   estado de carga y reseteo de campos.
 */
const AddTaskModal = ({
  visible,
  onClose,
  selectedDate,
  selectedStartHour,
  calculateEndHour,
  updateTasks,
}: AddTaskModalProps) => {
  // Indica si se está enviando la tarea para evitar envíos duplicados
  // y deshabilitar el botón mientras se realiza la operación.
  const [isLoading, setIsLoading] = useState(false);
  // const { formatText } = usePersonalization();

  // Hook que encapsula todo el estado del formulario de tarea:
  // - título, fecha de vencimiento, horario, categoría, recordatorio y pasos.
  // - callbacks para actualizar estos valores y formatear fechas.
  const {
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
  } = useAddTaskForm(selectedDate, selectedStartHour, calculateEndHour);

  // Hook que administra la visibilidad de todos los modales relacionados
  // con la creación de la tarea (fecha, hora, recordatorio, categoría, éxito, confirmación).
  const {
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
  } = useAddTaskModals();

  // Hook responsable de construir y enviar la tarea a la capa de datos.
  // Recibe setters para controlar el estado de carga, mostrar el modal de éxito,
  // resetear el formulario y actualizar la lista de tareas en la pantalla padre.
  const { handleAddTask: submitTask } = useAddTaskSubmit(
    setIsLoading,
    setShowSuccessModal,
    resetFields,
    updateTasks,
  );

  // Referencia al FlatList de pasos para poder hacer scroll automático
  // hacia el final cuando se agregan nuevos pasos.
  const flatListRef = useRef<FlatList<{ id: number; text: string }> | null>(
    null,
  );

  const scrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  // Agrega un nuevo paso y desplaza la lista al final para que sea visible.
  const handleAddStepAndScroll = () => {
    handleAddStep();
    setTimeout(scrollToEnd, 100);
  };

  // Arma los datos necesarios y delega el envío de la tarea al hook de submit.
  const handleAddTask = () => {
    submitTask(
      taskName,
      taskStartTime,
      taskEndTime,
      category,
      dueDate,
      steps,
      calculateReminderDate,
      formatDateToDB,
    );
  };

  // Cierra el modal de éxito y, tras un pequeño retraso, cierra también
  // el modal principal de creación de tarea.
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Al pulsar la X de cierre se muestra primero un modal de confirmación
  // para evitar perder cambios sin querer.
  const handleCancelClick = () => {
    setShowConfirmCancelModal(true);
  };

  // Confirma la cancelación: cierra el modal de confirmación, resetea
  // los campos del formulario y cierra el modal principal.
  const handleConfirmCancel = () => {
    setShowConfirmCancelModal(false);
    // Pequeño delay para permitir que el modal de confirmación se cierre antes
    setTimeout(() => {
      resetFields();
      onClose();
    }, 100);
  };

  // Cancela la acción de cancelar: solo oculta el modal de confirmación.
  const handleCancelCancel = () => {
    setShowConfirmCancelModal(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancelClick}
    >
      <View style={addTaskStyles.overlay}>
        <View style={addTaskStyles.addTaskModalContainer}>
          {/* Botón de cierre (X) que dispara el flujo de confirmación de cancelación. */}
          <TouchableOpacity
            onPress={handleCancelClick}
            style={addTaskStyles.closeXButton}
          >
            <Text style={addTaskStyles.closeXButtonText}>×</Text>
          </TouchableOpacity>

          {/* Botón para crear la tarea. Muestra estado de carga y se deshabilita
              mientras la tarea se está enviando. */}
          <TouchableOpacity
            style={[
              addTaskStyles.createTaskButton,
              isLoading && addTaskStyles.createTaskButtonDisabled,
            ]}
            onPress={handleAddTask}
            disabled={isLoading}
          >
            <Text style={addTaskStyles.createTaskButtonText}>
              {isLoading ? "Creando..." : "Crear"}
            </Text>
          </TouchableOpacity>

          {/* Emoji contextual según la hora del día (sol/luna). */}
          <Text style={addTaskStyles.emoji}>
            {new Date().getHours() >= 6 && new Date().getHours() < 18
              ? "🌞"
              : "🌙"}
          </Text>

          {/* Campo de texto para el título de la nueva tarea. */}
          <TextInput
            placeholder={'"Nueva tarea"'}
            placeholderTextColor="black"
            style={addTaskStyles.inputTitleTask}
            value={taskName}
            onChangeText={setTaskName}
          />

          {/* Selector de fecha de vencimiento de la tarea con su modal asociado. */}
          <View style={addTaskStyles.dataFields}>
            <TouchableOpacity
              style={addTaskStyles.datetButton}
              onPress={() => setIsCalendarVisible(true)}
            >
              <Ionicons name="calendar-outline" size={24} color="#394A72" />
              <TextInput
                placeholder={"Hoy"}
                placeholderTextColor="#394A72"
                style={addTaskStyles.dateTextButton}
                value={formatDate(dueDate)}
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>

            <DatePickerModal
              visible={isRoutineCalendarVisible}
              onClose={() => setIsCalendarVisible(false)}
              onDateSelect={(dateString: string) => {
                const selectedDate = new Date(dateString);
                const localDate = new Date(
                  selectedDate.getTime() +
                    selectedDate.getTimezoneOffset() * 60000,
                );
                setDueDate(localDate);
              }}
            />
          </View>

          {/* Selector de horario de la tarea (desde/hasta) con su modal asociado. */}
          <View style={addTaskStyles.dataFields}>
            <TouchableOpacity
              style={addTaskStyles.datetButton}
              onPress={() => setIsRoutineTimeVisible(true)}
            >
              <Ionicons name="time-outline" size={24} color="#394A72" />
              <TextInput
                placeholder={"Seleccionar horario"}
                placeholderTextColor="#394A72"
                style={addTaskStyles.dateTextButton}
                value={
                  taskStartTime && taskEndTime
                    ? `${taskStartTime} - ${taskEndTime}`
                    : ""
                }
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>

            <TimePickerModal
              visible={isRoutineTimeVisible}
              onClose={() => setIsRoutineTimeVisible(false)}
              onTimeSelected={handleTimeSelected}
            />
          </View>

          {/* Selector de recordatorio para la tarea con su modal asociado. */}
          <View style={addTaskStyles.dataFields}>
            <TouchableOpacity
              style={addTaskStyles.datetButton}
              onPress={() => setIsReminderVisible(true)}
            >
              <Ionicons name="alarm-outline" size={24} color="#394A72" />
              <TextInput
                placeholder={"Añadir recordatorio"}
                placeholderTextColor="#394A72"
                style={addTaskStyles.dateTextButton}
                value={reminder.label ? `Recordatorio: ${reminder.label}` : ""}
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>

            <ReminderPickerModal
              visible={isReminderVisible}
              onClose={() => setIsReminderVisible(false)}
              onSetReminder={handleReminderSet}
              initialSelectedOption={reminder.label ?? null}
            />
          </View>

          {/* Selector de categoría de la tarea con listado de categorías disponibles. */}
          <View style={addTaskStyles.categoryField}>
            <TouchableOpacity
              style={addTaskStyles.categoryButton}
              onPress={() => setIsCategoryVisible(true)}
            >
              <Text style={addTaskStyles.categoryButtonText}>
                {categoryName || "Seleccionar categoría"}
              </Text>
            </TouchableOpacity>

            <CategorPickeryModal
              visible={isCategoryVisible}
              onClose={() => setIsCategoryVisible(false)}
              onCategorySelect={(
                selectedCategoryId: string,
                selectedCategoryName: string,
              ) => {
                handleCategorySelect(selectedCategoryId, selectedCategoryName);
                setIsCategoryVisible(false);
              }}
            />
          </View>

          {/* Sección de gestión de pasos de la tarea (lista + botón para agregar). */}
          <View style={addTaskStyles.mainStepsContainer}>
            <Text style={addTaskStyles.stepsTitle}>{"Pasos"}</Text>

            <FlatList
              ref={flatListRef}
              data={steps}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <StepItem
                  id={item.id}
                  text={item.text}
                  index={index}
                  stepsCount={steps.length}
                  onTextChange={handleStepChange}
                  onRemove={handleRemoveStep}
                />
              )}
              onContentSizeChange={scrollToEnd}
            />

            {/* Botón para agregar un nuevo paso al final de la lista. */}
            <TouchableOpacity
              style={addTaskStyles.addStepButton}
              onPress={handleAddStepAndScroll}
            >
              <Text style={addTaskStyles.addStepButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modal de éxito que se muestra cuando la tarea se creó correctamente. */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={handleSuccessModalClose}
      />

      {/* Modal de confirmación que aparece al intentar cerrar sin guardar cambios. */}
      <ConfirmCancelModal
        visible={showConfirmCancelModal}
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelCancel}
      />
    </Modal>
  );
};

export default AddTaskModal;
