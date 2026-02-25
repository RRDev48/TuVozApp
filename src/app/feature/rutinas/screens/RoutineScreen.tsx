import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useCurrentUserProfile } from "../../ajustes/hooks/useCurrentUserProfile";
import BackButton from "../../common/BackButton";
import ScreenTitle from "../../common/ScreenTitle";
import { AchievementModal } from "../components/achievement/AchievementModal";
import { DayCalendarView } from "../components/calendar/DayCalendarView";
import { DaysOfWeek } from "../components/days/DaysOfWeek";
import { ProgressItem } from "../components/progress/ProgressItem";
import AddTaskModal from "../components/tasks/AddTaskModal";
import { TaskDetailsModal } from "../components/tasks/TaskDetailsModal";
import { TaskStepModal } from "../components/tasks/TaskStepModal";
import ChangeWeek from "../components/week/ChangeWeek";
import { useAchievementCelebration } from "../hooks/useAchievementCelebration";
import { useModals } from "../hooks/useModals";
import { useRoutineProgress } from "../hooks/useRoutineProgress";
import { useRoutineTasks } from "../hooks/useRoutineTasks";
import { useWeekRoutine } from "../hooks/useWeekRoutine";
import { Task } from "../models/task.types";

export const RoutineScreen = () => {
  const navigation = useNavigation();
  const { profileId, loading: profileLoading } = useCurrentUserProfile();
  const { getThemedColors, transformText } = usePersonalization();
  const themedColors = getThemedColors();

  const [startSelectedHour, setSelectedHour] = useState("");
  const [endSelectedHour, setEndSelectedHour] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        screenContainer: {
          flex: 1,
          backgroundColor: themedColors.background,
        },
        headerContainer: {
          alignItems: "center",
          marginBottom: 20,
        },
        floatingButton: {
          position: "absolute",
          bottom: 30,
          right: 30,
          backgroundColor: colors.green,
          borderRadius: 50,
          padding: 15,
          elevation: 5,
        },
      }),
    [themedColors],
  );

  const {
    currentWeekStart,
    selectedDayIndex,
    setSelectedDayIndex,
    routineId,
    daysOfWeek,
    handleChangeWeek,
  } = useWeekRoutine(profileId || "");

  const { tasks, addTask, updateTaskState, handleTaskTimeChange } =
    useRoutineTasks(routineId);
  const tasksRefreshTrigger = useMemo(() => {
    return tasks.map((t) => `${t.id}-${t.estado}`).join(",");
  }, [tasks]);

  const {
    isAddTaskModalVisible,
    isTaskDetailsModalVisible,
    isTaskStepModalVisible,
    isAchievementModalVisible,
    toggleAddTask,
    openTaskDetails,
    closeTaskDetails,
    openTaskStepModal,
    closeTaskStepModal,
    openAchievementModal,
    closeAchievementModal,
  } = useModals();

  const { percent } = useRoutineProgress(routineId, tasksRefreshTrigger);

  useAchievementCelebration({
    percent,
    onShowAchievement: openAchievementModal,
  });

  const handleTaskPress = useCallback(
    (task: Task) => {
      setSelectedTask(task);
      openTaskDetails();
    },
    [openTaskDetails],
  );

  const startTask = useCallback(() => {
    if (selectedTask?.id) {
      updateTaskState(selectedTask.id, "En Proceso");
    }
    closeTaskDetails();
    openTaskStepModal();
  }, [closeTaskDetails, openTaskStepModal, selectedTask, updateTaskState]);

  const closeTaskStep = useCallback(() => {
    closeTaskStepModal();
    setSelectedTask(null);
  }, [closeTaskStepModal]);

  const handleHourPress = useCallback(
    (hour: string) => {
      const selectedDay = daysOfWeek[selectedDayIndex];
      const selectedDateTime = new Date(selectedDay);
      const [hourStr, minuteStr] = hour.split(":");
      selectedDateTime.setHours(parseInt(hourStr), parseInt(minuteStr));

      const selectedEndTime = new Date(selectedDateTime.getTime());
      selectedEndTime.setHours(selectedDateTime.getHours() + 1);

      const endHour = selectedEndTime.toTimeString().slice(0, 5);

      setSelectedDate(selectedDateTime);
      setSelectedHour(hour);
      setEndSelectedHour(endHour);
      toggleAddTask();
    },
    [daysOfWeek, selectedDayIndex, toggleAddTask],
  );

  if (!profileId) {
    return null;
  }

  return (
    <View style={styles.screenContainer}>
      <BackButton onPress={() => navigation.goBack()} />

      <ScreenTitle text={transformText("Rutinas")} />

      <View style={styles.headerContainer}>
        <ProgressItem
          routineId={routineId}
          refreshTrigger={tasksRefreshTrigger}
          tasks={tasks}
        />
      </View>

      {/*
        Selector para cambiar de semana en la vista de rutinas.
        Permite al usuario navegar hacia semanas anteriores o siguientes
        manteniendo la rutina actual seleccionada.
      */}
      <ChangeWeek
        onChangeWeek={handleChangeWeek}
        currentWeekStart={currentWeekStart}
      />

      {/*
        Lista de días de la semana de la rutina actual.
        Resalta el día seleccionado y permite cambiarlo tocando otro día.
      */}
      <DaysOfWeek
        currentWeekStart={currentWeekStart}
        selectedDayIndex={selectedDayIndex}
        setSelectedDayIndex={setSelectedDayIndex}
        routineId={routineId}
        profileId={profileId}
      />

      {/*
        Vista del calendario diario con las tareas:
        - Muestra las tareas programadas en bloques de tiempo.
        - Permite ajustar la hora de una tarea (onTaskTimeChange).
        - Permite abrir los detalles de una tarea (onTaskPress).
        - Permite crear una tarea nueva tocando una hora vacía (onHourPress).
      */}
      <DayCalendarView
        tasks={tasks}
        onTaskTimeChange={handleTaskTimeChange}
        onTaskPress={handleTaskPress}
        onHourPress={handleHourPress}
      />

      {/*
        Botón flotante para agregar una nueva tarea manualmente.
        No preconfigura fecha ni hora; abre el modal de tarea en blanco
        para que el usuario complete todos los datos.
      */}
      <TouchableOpacity style={styles.floatingButton} onPress={toggleAddTask}>
        <Ionicons name="add-circle" size={24} color={colors.white} />
      </TouchableOpacity>

      {/*
        Modal para crear una nueva tarea.
        - Si se abrió desde el calendario, viene prellenado con fecha y horario.
        - Si se abrió desde el botón flotante, puede venir sin valores iniciales.
        El callback `updateTasks` se encarga de añadir la nueva tarea a la lista.
      */}
      <AddTaskModal
        visible={isAddTaskModalVisible}
        onClose={toggleAddTask}
        selectedDate={selectedDate}
        selectedStartHour={startSelectedHour}
        calculateEndHour={endSelectedHour}
        updateTasks={addTask}
        profileId={profileId}
      />

      {/*
        Modal con los detalles de la tarea seleccionada.
        Desde aquí el usuario puede revisar la información y decidir iniciar
        la tarea, lo que disparará `startTask`.
      */}
      <TaskDetailsModal
        visible={isTaskDetailsModalVisible}
        task={selectedTask}
        onClose={closeTaskDetails}
        onStartTask={startTask}
      />

      {/*
        Modal que guía al usuario por los pasos de la tarea.
        Permite avanzar o reiniciar los pasos y actualizar el estado de la tarea
        mediante `updateTaskState`.
      */}
      <TaskStepModal
        visible={isTaskStepModalVisible}
        task={selectedTask}
        onClose={closeTaskStep}
        onRestart={closeTaskStep}
        updateTaskState={updateTaskState}
      />

      {/*
        Modal de celebración cuando se alcanzan logros en la rutina.
        Se muestra de forma automática según la lógica de useAchievementCelebration
        y se oculta con `closeAchievementModal` o tras `autoCloseDelay` milisegundos.
      */}
      <AchievementModal
        visible={isAchievementModalVisible}
        onClose={closeAchievementModal}
        autoCloseDelay={5000}
      />
    </View>
  );
};

export default RoutineScreen;
