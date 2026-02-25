import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAddTaskForm } from "../../hooks/useAddTaskForm";
import { useAddTaskModals } from "../../hooks/useAddTaskModals";
import { useAddTaskSubmit } from "../../hooks/useAddTaskSubmit";
import { AddTaskModalProps } from "../../models/component.props";
import { CategorPickeryModal } from "../pickers/CategoryPickerModal";
import { DatePickerModal } from "../pickers/DatePickerModal";
import { ReminderPickerModal } from "../pickers/ReminderPickerModal";
import { TimePickerModal } from "../pickers/TimePickerModal";
import { StepItem } from "../steps/StepsItemsModal";
import { ConfirmCancelModal } from "./ConfirmCancelModal";
import { SuccessModal } from "./SuccessModal";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.transparent,
    justifyContent: "center",
    alignItems: "center",
  },

  addTaskModalContainer: {
    width: "90%",
    height: "90%",
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },

  emoji: {
    fontSize: 60,
    marginBottom: 20,
  },

  inputTitleTask: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.black,
    borderBottomWidth: 10,
    borderColor: colors.lightGray,
    borderRadius: 40,
    padding: 10,
    marginVertical: 10,
    width: "90%",
  },

  dataFields: {
    flexDirection: "row",
    alignItems: "center",
  },

  datetButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 10,
  },

  dateTextButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    color: colors.blue,
    borderBottomWidth: 1,
    borderColor: colors.lightGray,
    padding: 10,
    marginVertical: 10,
    width: "90%",
    marginLeft: 10,
  },

  categoryField: {
    width: "100%",
    marginBottom: 20,
  },

  categoryButtonText: {
    fontSize: 18,
    color: colors.white,
    fontWeight: "bold",
  },

  categoryButton: {
    backgroundColor: colors.blue,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  mainStepsContainer: {
    width: "100%",
    flex: 1,
  },

  stepsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.blue,
    borderColor: colors.blue,
  },

  addStepButton: {
    backgroundColor: colors.blue,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  addStepButtonText: {
    color: colors.white,
    fontSize: 24,
  },

  createTaskButton: {
    position: "absolute",
    top: 5,
    left: 10,
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: 10,
  },

  createTaskButtonText: {
    color: colors.blue,
    fontSize: 20,
    fontWeight: "bold",
  },

  createTaskButtonDisabled: {
    backgroundColor: colors.white,
  },

  closeXButton: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 20,
    padding: 5,
  },

  closeXButtonText: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.red,
  },
});

const AddTaskModal = ({
  visible,
  onClose,
  selectedDate,
  selectedStartHour,
  calculateEndHour,
  updateTasks,
  profileId,
}: AddTaskModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
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

  const { handleAddTask: submitTask } = useAddTaskSubmit(
    setIsLoading,
    setShowSuccessModal,
    resetFields,
    updateTasks,
    profileId,
  );
  const flatListRef = useRef<FlatList<{ id: number; text: string }> | null>(
    null,
  );

  const scrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handleAddStepAndScroll = () => {
    handleAddStep();
    setTimeout(scrollToEnd, 100);
  };

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

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleCancelClick = () => {
    setShowConfirmCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setShowConfirmCancelModal(false);
    setTimeout(() => {
      resetFields();
      onClose();
    }, 100);
  };

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
      <View style={styles.overlay}>
        <View style={styles.addTaskModalContainer}>
          {/* Botón de cierre (X) que dispara el flujo de confirmación de cancelación. */}
          <TouchableOpacity
            onPress={handleCancelClick}
            style={styles.closeXButton}
          >
            <Text style={styles.closeXButtonText}>×</Text>
          </TouchableOpacity>

          {/* Botón para crear la tarea. Muestra estado de carga y se deshabilita
              mientras la tarea se está enviando. */}
          <TouchableOpacity
            style={[
              styles.createTaskButton,
              isLoading && styles.createTaskButtonDisabled,
            ]}
            onPress={handleAddTask}
            disabled={isLoading}
          >
            <Text style={styles.createTaskButtonText}>
              {isLoading ? "Creando..." : "Crear"}
            </Text>
          </TouchableOpacity>

          {/* Emoji contextual según la hora del día (sol/luna). */}
          <Text style={styles.emoji}>
            {new Date().getHours() >= 6 && new Date().getHours() < 18
              ? "🌞"
              : "🌙"}
          </Text>

          {/* Campo de texto para el título de la nueva tarea. */}
          <TextInput
            placeholder={'"Nueva tarea"'}
            placeholderTextColor="black"
            style={styles.inputTitleTask}
            value={taskName}
            onChangeText={setTaskName}
          />

          {/* Selector de fecha de vencimiento de la tarea con su modal asociado. */}
          <View style={styles.dataFields}>
            <TouchableOpacity
              style={styles.datetButton}
              onPress={() => setIsCalendarVisible(true)}
            >
              <Ionicons name="calendar-outline" size={24} color="#394A72" />
              <TextInput
                placeholder={"Hoy"}
                placeholderTextColor="#394A72"
                style={styles.dateTextButton}
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
          <View style={styles.dataFields}>
            <TouchableOpacity
              style={styles.datetButton}
              onPress={() => setIsRoutineTimeVisible(true)}
            >
              <Ionicons name="time-outline" size={24} color="#394A72" />
              <TextInput
                placeholder={"Seleccionar horario"}
                placeholderTextColor="#394A72"
                style={styles.dateTextButton}
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
          <View style={styles.dataFields}>
            <TouchableOpacity
              style={styles.datetButton}
              onPress={() => setIsReminderVisible(true)}
            >
              <Ionicons name="alarm-outline" size={24} color="#394A72" />
              <TextInput
                placeholder={"Añadir recordatorio"}
                placeholderTextColor="#394A72"
                style={styles.dateTextButton}
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
          <View style={styles.categoryField}>
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => setIsCategoryVisible(true)}
            >
              <Text style={styles.categoryButtonText}>
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
          <View style={styles.mainStepsContainer}>
            <Text style={styles.stepsTitle}>{"Pasos"}</Text>

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
              style={styles.addStepButton}
              onPress={handleAddStepAndScroll}
            >
              <Text style={styles.addStepButtonText}>+</Text>
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
