import i18n from "@/src/app/i18n";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import ConfirmationModal from "@/src/app/feature/common/alerts/ConfirmationModal";
import SuccessModal from "@/src/app/feature/common/alerts/SuccessModal";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ErrorModal from "../../../common/alerts/ErrorModal";
import CustomText from "../../../common/CustomText";
import { useAddTaskForm } from "../../hooks/useAddTaskForm";
import { useAddTaskModals } from "../../hooks/useAddTaskModals";
import { useAddTaskSubmit } from "../../hooks/useAddTaskSubmit";
import { AddTaskModalProps } from "../../models/component.props";
import { CategorPickeryModal } from "../pickers/CategoryPickerModal";
import { DatePickerModal } from "../pickers/DatePickerModal";
import { ReminderPickerModal } from "../pickers/ReminderPickerModal";
import { TimeInputField } from "../pickers/TimeInputField";
import { StepItem } from "../steps/StepsItemsModal";

const AddTaskModal = ({
  visible,
  onClose,
  selectedDate,
  selectedStartHour,
  calculateEndHour,
  updateTasks,
  profileId,
  taskToEdit,
  onTaskUpdated,
}: AddTaskModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAllDayEnabled, setIsAllDayEnabled] = useState(false);
  const isEditMode = !!taskToEdit;
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: colors.transparent,
        },
        addTaskModalContainer: {
          width: "100%",
          height: "100%",
          backgroundColor: themedColors.background,
          paddingTop: (StatusBar.currentHeight || 0) + 40,
          paddingHorizontal: 20,
          paddingBottom: 20,
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
          color: themedColors.text,
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
          color: themedColors.primary,
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
          color: themedColors.background,
          fontWeight: "bold",
        },
        categoryButton: {
          backgroundColor: themedColors.cardBackground,
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
          color: themedColors.primary,
          borderColor: themedColors.primary,
        },
        addStepButton: {
          backgroundColor: themedColors.cardBackground,
          padding: 10,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 10,
        },
        addStepButtonText: {
          color: themedColors.background,
          fontSize: 24,
        },
        createTaskButton: {
          position: "absolute",
          top: (StatusBar.currentHeight || 0) + 45,
          left: 10,
          backgroundColor: themedColors.background,
          borderRadius: 5,
          padding: 10,
        },
        createTaskButtonText: {
          color: themedColors.primary,
          fontSize: 20,
          fontWeight: "bold",
        },
        createTaskButtonDisabled: {
          backgroundColor: themedColors.background,
        },
        closeXButton: {
          position: "absolute",
          top: (StatusBar.currentHeight || 0) + 40,
          right: 10,
          borderRadius: 20,
          padding: 5,
        },
        closeXButtonText: {
          fontSize: 30,
          fontWeight: "bold",
          color: colors.red,
        },
        timeInputsContainer: {
          width: "100%",
          marginBottom: 10,
          marginLeft: -15,
        },
        timeInputsRow: {
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          marginBottom: 10,
        },
        switchContainer: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          paddingHorizontal: 10,
          marginBottom: 20,
        },
        switchWrapper: {
          borderRadius: 20,
          borderWidth: 2,
          padding: 1,
        },
        switchLabel: {
          fontSize: 16,
          fontWeight: "bold",
          color: themedColors.text,
        },
      }),
    [themedColors],
  );

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
    loadTaskForEdit,
    calculateReminderDate,
    formatDateToDB,
    formatDate,
  } = useAddTaskForm(selectedDate, selectedStartHour, calculateEndHour);

  const {
    isRoutineCalendarVisible,
    setIsCalendarVisible,
    isReminderVisible,
    setIsReminderVisible,
    isCategoryVisible,
    setIsCategoryVisible,
    showSuccessModal,
    setShowSuccessModal,
    showConfirmCancelModal,
    setShowConfirmCancelModal,
  } = useAddTaskModals();

  const {
    handleAddTask: submitTask,
    handleEditTask: submitEditTask,
    errorModalVisible,
    errorTitle,
    errorMessage,
    closeErrorModal,
  } = useAddTaskSubmit(
    setIsLoading,
    setShowSuccessModal,
    resetFields,
    updateTasks,
    profileId,
    onTaskUpdated,
  );

  useEffect(() => {
    if (visible && taskToEdit) {
      loadTaskForEdit(taskToEdit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, taskToEdit]);
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

  const toggleAllDaySwitch = () => {
    const newValue = !isAllDayEnabled;
    setIsAllDayEnabled(newValue);
    if (newValue) {
      handleTimeSelected("00:00", "23:59");
    } else {
      handleTimeSelected("", "");
    }
  };

  const formatTimeInput = (text: string, currentValue: string): string => {
    let filteredText = text.replace(/[^0-9]/g, "");

    const currentFiltered = currentValue.replace(/[^0-9]/g, "");

    const isDeleting =
      text.length < currentValue.length ||
      filteredText.length < currentFiltered.length;

    if (isDeleting) {
      if (filteredText.length > 4) {
        filteredText = filteredText.substring(0, 4);
      }
      return filteredText;
    }

    if (filteredText.length > 4) {
      filteredText = filteredText.substring(0, 4);
    }

    if (filteredText.length >= 1) {
      const firstDigit = parseInt(filteredText[0], 10);
      if (firstDigit > 2) {
        return currentValue;
      }
    }

    if (filteredText.length >= 2) {
      const hours = parseInt(filteredText.substring(0, 2), 10);
      if (hours > 23) {
        return currentValue;
      }
    }

    if (filteredText.length >= 3) {
      const firstMinuteDigit = parseInt(filteredText[2], 10);
      if (firstMinuteDigit > 5) {
        return currentValue;
      }
    }

    if (filteredText.length === 4) {
      const minutes = parseInt(filteredText.substring(2, 4), 10);
      if (minutes > 59) {
        return currentValue;
      }
    }

    if (filteredText.length >= 2) {
      const hours = filteredText.substring(0, 2);
      const minutes = filteredText.substring(2, 4);
      return `${hours}:${minutes}`;
    }

    return filteredText;
  };

  const handleStartTimeChange = (text: string) => {
    const formattedTime = formatTimeInput(text, taskStartTime);
    handleTimeSelected(formattedTime, taskEndTime);
  };

  const handleEndTimeChange = (text: string) => {
    const formattedTime = formatTimeInput(text, taskEndTime);
    handleTimeSelected(taskStartTime, formattedTime);
  };

  const handleAddTask = () => {
    if (isEditMode && taskToEdit?.id) {
      submitEditTask(
        taskToEdit.id,
        taskName,
        taskStartTime,
        taskEndTime,
        category,
        dueDate,
        steps,
        calculateReminderDate,
        formatDateToDB,
      );
    } else {
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
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setTimeout(() => {
      setIsAllDayEnabled(false);
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
      setIsAllDayEnabled(false);
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView
            style={styles.addTaskModalContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
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
              <CustomText style={styles.createTaskButtonText}>
                {isLoading
                  ? i18n.t(isEditMode ? 'saving' : 'creating')
                  : i18n.t(isEditMode ? 'save' : 'create')}
              </CustomText>
            </TouchableOpacity>

            {/* Emoji contextual según la hora del día (sol/luna). */}
            <Text style={styles.emoji}>
              {new Date().getHours() >= 6 && new Date().getHours() < 18
                ? "🌞"
                : "🌙"}
            </Text>

            {/* Campo de texto para el título de la nueva tarea. */}
            <TextInput
              placeholder={i18n.t('newTaskPlaceholder')}
              placeholderTextColor={themedColors.text}
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
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={themedColors.primary}
                />
                <TextInput
                  placeholder={i18n.t('today')}
                  placeholderTextColor={themedColors.primary}
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

            {/* Selector de horario de la tarea (desde/hasta) con campos de entrada directos. */}
            <View style={styles.timeInputsContainer}>
              <View style={styles.timeInputsRow}>
                <TimeInputField
                  icon={
                    <Ionicons
                      name="time-outline"
                      size={24}
                      color={themedColors.primary}
                    />
                  }
                  label={i18n.t('from')}
                  value={taskStartTime}
                  error={false}
                  placeholder="00:00"
                  onChangeText={handleStartTimeChange}
                  editable={!isAllDayEnabled}
                />

                <TimeInputField
                  icon={
                    <Ionicons
                      name="time-outline"
                      size={24}
                      color={themedColors.text}
                    />
                  }
                  label={i18n.t('to')}
                  value={taskEndTime}
                  error={false}
                  placeholder="23:59"
                  onChangeText={handleEndTimeChange}
                  editable={!isAllDayEnabled}
                />
              </View>

              {/* Switch para activar/desactivar "Todo el día" */}
              <View style={styles.switchContainer}>
                <CustomText style={styles.switchLabel}>
                  {i18n.t('allDay')}
                </CustomText>
                <View
                  style={[
                    styles.switchWrapper,
                    {
                      borderColor: isAllDayEnabled
                        ? colors.green
                        : themedColors.secondary + "80",
                    },
                  ]}
                >
                  <Switch
                    onValueChange={toggleAllDaySwitch}
                    value={isAllDayEnabled}
                    trackColor={{
                      false: themedColors.secondary,
                      true: colors.green,
                    }}
                    thumbColor={
                      isAllDayEnabled
                        ? themedColors.primary
                        : themedColors.secondary
                    }
                  />
                </View>
              </View>
            </View>

            {/* Selector de recordatorio para la tarea con su modal asociado. */}
            <View style={styles.dataFields}>
              <TouchableOpacity
                style={styles.datetButton}
                onPress={() => setIsReminderVisible(true)}
              >
                <Ionicons
                  name="alarm-outline"
                  size={24}
                  color={themedColors.primary}
                />
                <TextInput
                  placeholder={i18n.t('addReminder')}
                  placeholderTextColor={themedColors.primary}
                  style={styles.dateTextButton}
                  value={
                    reminder.label
                      ? `${i18n.t('reminder')}: ${reminder.label}`
                      : ""
                  }
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
                <CustomText style={styles.categoryButtonText}>
                  {categoryName || i18n.t('selectCategory')}
                </CustomText>
              </TouchableOpacity>

              <CategorPickeryModal
                visible={isCategoryVisible}
                onClose={() => setIsCategoryVisible(false)}
                onCategorySelect={(
                  selectedCategoryId: string,
                  selectedCategoryName: string,
                ) => {
                  handleCategorySelect(
                    selectedCategoryId,
                    selectedCategoryName,
                  );
                  setIsCategoryVisible(false);
                }}
              />
            </View>

            {/* Sección de gestión de pasos de la tarea (lista + botón para agregar). */}
            <View style={styles.mainStepsContainer}>
              <CustomText style={styles.stepsTitle}>
                {i18n.t('steps')}
              </CustomText>

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
                style={{ maxHeight: 180 }}
              />

              {/* Botón para agregar un nuevo paso al final de la lista. */}
              <TouchableOpacity
                style={styles.addStepButton}
                onPress={handleAddStepAndScroll}
              >
                <Text style={styles.addStepButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>

      {/* Modal de éxito que se muestra cuando la tarea se creó/editó correctamente. */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={handleSuccessModalClose}
        title={i18n.t(isEditMode ? 'taskEditedSuccess' : 'taskCreated')}
        message={i18n.t(isEditMode ? 'taskEditedMessage' : 'taskCreatedMessage')}
      />

      {/* Modal de confirmación que aparece al intentar cerrar sin guardar cambios. */}
      <ConfirmationModal
        visible={showConfirmCancelModal}
        title={i18n.t(isEditMode ? 'cancelEditConfirm' : 'cancelCreateConfirm')}
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelCancel}
      />

      {/* Modal de error que se muestra cuando hay campos incompletos o un error al crear la tarea. */}
      <ErrorModal
        visible={errorModalVisible}
        title={errorTitle}
        message={errorMessage}
        onClose={closeErrorModal}
      />
    </Modal>
  );
};

export default AddTaskModal;
