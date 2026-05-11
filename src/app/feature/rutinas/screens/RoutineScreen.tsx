import SkeletonAvatar from "@/src/app/components/common/SkeletonAvatar";
import SkeletonButton from "@/src/app/components/common/SkeletonButton";
import SkeletonText from "@/src/app/components/common/SkeletonText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useCurrentUserProfile } from "../../ajustes/hooks/useCurrentUserProfile";
import ConfirmationModal from "../../common/alerts/ConfirmationModal";
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
import { useTaskOperations } from "../hooks/useTaskOperations";
import { useWeekRoutine } from "../hooks/useWeekRoutine";
import { useWeekTasksPreload } from "../hooks/useWeekTasksPreload";
import { Task } from "../models/task.types";

export const RoutineScreen = () => {
  const { t } = useLanguageRefresh();
  const navigation = useNavigation();
  const { profileId, loading: profileLoading } = useCurrentUserProfile();
  const { getThemedColors, temaOscuro } = usePersonalization();
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
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: temaOscuro ? 0.45 : 0.2,
          shadowRadius: 6,
        },
      }),
    [themedColors, temaOscuro],
  );

  const {
    currentWeekStart,
    selectedDayIndex,
    setSelectedDayIndex,
    routineId,
    daysOfWeek,
    handleChangeWeek,
  } = useWeekRoutine(profileId || "");

  const renderSkeletonRoutine = () => (
    <View style={styles.screenContainer}>
      <BackButton onPress={() => navigation.goBack()} />
      <ScreenTitle text={t("routines")} />

      {/* Skeleton Progreso (Mismo estilo que un título) */}
      <View style={{ paddingHorizontal: 20, marginTop: 10, alignItems: "center", marginBottom: 30 }}>
        <SkeletonText width={200} height={32} borderRadius={8} />
        <SkeletonText width={120} height={16} marginTop={12} borderRadius={4} />
      </View>

      {/* Skeleton Cambio de Semana */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 15, paddingHorizontal: 20 }}>
        <SkeletonButton width={30} height={30} borderRadius={15} />
        <View style={{ marginHorizontal: 20 }}>
          <SkeletonText width={150} height={20} borderRadius={6} />
        </View>
        <SkeletonButton width={30} height={30} borderRadius={15} />
      </View>

      {/* Skeleton Selector de Días (Usando rectángulos tipo título pequeño) */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 30 }}>
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <View key={i} style={{ alignItems: "center" }}>
            <SkeletonText width={35} height={35} borderRadius={8} />
            <SkeletonText width={20} height={10} marginTop={8} borderRadius={4} />
          </View>
        ))}
      </View>

      {/* Skeleton Calendario / Comenzamos el día */}
      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <View style={{ marginBottom: 20 }}>
          <SkeletonText width={180} height={24} borderRadius={8} />
        </View>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={{ flexDirection: 'row', marginBottom: 25, alignItems: 'center' }}>
            <View style={{ marginRight: 15 }}>
              <SkeletonText width={50} height={16} borderRadius={4} />
            </View>
            <View style={{ flex: 1, height: 2, backgroundColor: themedColors.cardBackground, opacity: 0.2 }} />
          </View>
        ))}
      </View>
    </View>
  );

  // Precargar todas las tareas de la semana
  const { getTasksForDay, reloadWeekTasks, isLoading: isTasksLoading } = useWeekTasksPreload(
    profileId || "",
    daysOfWeek,
  );

  // Obtener tareas del día seleccionado (ya precargadas)
  const selectedDayTasks = useMemo(() => {
    if (!daysOfWeek[selectedDayIndex]) return [];
    return getTasksForDay(daysOfWeek[selectedDayIndex]);
  }, [daysOfWeek, selectedDayIndex, getTasksForDay]);

  // Todas las tareas de la semana para progress
  const allWeekTasks = useMemo(() => {
    return daysOfWeek.flatMap((day) => getTasksForDay(day));
  }, [daysOfWeek, getTasksForDay]);

  // Calcular progreso localmente
  const completedCount = useMemo(() =>
    allWeekTasks.filter((task) => task.estado === "Completado").length,
    [allWeekTasks]
  );
  const totalCount = allWeekTasks.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Calcular medallas de toda la semana (instantáneo con las tareas precargadas)
  const weekMedals = useMemo(() => {
    return daysOfWeek.map((day) => {
      const dateStr = day.toISOString().slice(0, 10);
      const dayTasks = getTasksForDay(day);

      if (dayTasks.length === 0) return "none";

      const completed = dayTasks.filter((t) => t.estado === "Completado").length;
      const dayPercent = (completed / dayTasks.length) * 100;

      if (dayPercent === 100) return "oro";
      if (dayPercent >= 50) return "plata";
      if (dayPercent > 0) return "bronce";
      return "none";
    });
  }, [daysOfWeek, getTasksForDay, allWeekTasks]);

  // Operaciones sobre tareas
  const {
    addTask,
    removeTask,
    replaceTask,
    updateTaskState,
    handleTaskTimeChange,
  } = useTaskOperations(selectedDayTasks, reloadWeekTasks);

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

  const tasksRefreshTrigger = useMemo(() => {
    return allWeekTasks.length;
  }, [allWeekTasks]);

  useAchievementCelebration({
    percent,
    routineId,
    onShowAchievement: openAchievementModal,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const taskToEdit = isEditingTask ? selectedTask : null;

  const handleEditTask = useCallback(() => {
    setIsEditingTask(true);
    closeTaskDetails();
    toggleAddTask();
  }, [closeTaskDetails, toggleAddTask]);

  const handleCloseAddTaskModal = useCallback(() => {
    toggleAddTask();
    setIsEditingTask(false);
    setSelectedTask(null);
  }, [toggleAddTask]);

  const handleDeleteTask = useCallback(() => {
    closeTaskDetails();
    setShowDeleteConfirm(true);
  }, [closeTaskDetails]);

  const confirmDeleteTask = useCallback(async () => {
    if (selectedTask?.id) {
      await removeTask(selectedTask.id);
    }
    setShowDeleteConfirm(false);
    setSelectedTask(null);
  }, [selectedTask, removeTask]);

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

  if (profileLoading || !profileId || (isTasksLoading && allWeekTasks.length === 0)) {
    return renderSkeletonRoutine();
  }

  return (
    <View style={styles.screenContainer}>
      <BackButton onPress={() => navigation.goBack()} />

      <ScreenTitle text={t('routines')} />

      <View style={styles.headerContainer}>
        <ProgressItem
          routineId={routineId}
          refreshTrigger={tasksRefreshTrigger}
          tasks={selectedDayTasks}
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
        onChangeWeek={handleChangeWeek}
        medals={weekMedals}
      />

      {/*
        Vista del calendario diario con las tareas:
        - Muestra las tareas programadas en bloques de tiempo.
        - Permite ajustar la hora de una tarea (onTaskTimeChange).
        - Permite abrir los detalles de una tarea (onTaskPress).
        - Permite crear una tarea nueva tocando una hora vacía (onHourPress).
        Key única por día para forzar re-render limpio al cambiar de día.
      */}
      <DayCalendarView
        key={`day-${selectedDayIndex}-${routineId}`}
        tasks={selectedDayTasks}
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
        onClose={handleCloseAddTaskModal}
        selectedDate={selectedDate}
        selectedStartHour={startSelectedHour}
        calculateEndHour={endSelectedHour}
        updateTasks={addTask}
        profileId={profileId}
        taskToEdit={taskToEdit}
        onTaskUpdated={replaceTask}
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
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
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

      <ConfirmationModal
        visible={showDeleteConfirm}
        title={t('deleteTaskConfirm')}
        confirmText={t('delete')}
        cancelText={t('cancel')}
        onConfirm={confirmDeleteTask}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </View>
  );
};

export default RoutineScreen;
