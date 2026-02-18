// React
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Componentes
import { AchievementModal } from "../components/achievement/AchievementModal";
import { DayCalendarView } from "../components/calendar/DayCalendarView";
import { DaysOfWeek } from "../components/days/DaysOfWeek";
import { ProgressItem } from "../components/progress/ProgressItem";
import AddTaskModal from "../components/tasks/AddTaskModal";
import { TaskDetailsModal } from "../components/tasks/TaskDetailsModal";
import { TaskStepModal } from "../components/tasks/TaskStepModal";
import ChangeWeek from "../components/week/ChangeWeek";

// Constantes

// Modelos
import { Task } from "../(models)/task.types";

// Hooks
import { useAchievementCelebration } from "../(hooks)/useAchievementCelebration";
import { useModals } from "../(hooks)/useModals";
import { useRoutineProgress } from "../(hooks)/useRoutineProgress";
import { useRoutineTasks } from "../(hooks)/useRoutineTasks";
import { useWeekRoutine } from "../(hooks)/useWeekRoutine";
import { useCurrentUserProfile } from "../../ajustes/(hooks)/useCurrentUserProfile";

// Servicios

// Acciones

// Visuales
import { colors } from "@/src/app/design-system/themes/globalColors-theme";

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },

  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
    paddingTop: 5,
  },

  backButton: {
    position: "absolute",
    left: 0,
    top: 5,
    zIndex: 10,
    padding: 5,
  },

  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.blue,
  },

  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },

  selectedDay: {
    width: "13%",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    minWidth: 50,
  },

  dayText: {
    fontSize: 14,
    textAlign: "center",
    width: "100%",
  },

  numberDayText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },

  hoursContainer: {
    flex: 1,
  },

  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: colors.blue,
    borderRadius: 50,
    padding: 15,
    elevation: 5,
  },
});

/**
 * RoutineScreen
 * --------------
 * Pantalla principal de gestión de rutinas.
 *
 * Responsabilidades:
 * - Mostrar el calendario diario con las tareas programadas para la rutina actual.
 * - Permitir cambiar de semana y de día dentro de la rutina.
 * - Gestionar el ciclo de vida de una tarea: creación, visualización de detalles,
 *   ejecución por pasos y actualización de su estado.
 * - Mostrar el progreso global de la rutina y disparar un modal de logro
 *   cuando se alcanzan ciertos umbrales de porcentaje.
 */
export const RoutineScreen = () => {
  const navigation = useNavigation();
  // const { formatText } = usePersonalization();

  // -----------------------------
  // Obtener profileId del usuario actual
  // -----------------------------
  const { profileId, loading: profileLoading } = useCurrentUserProfile();

  // -----------------------------
  // Estado local de la pantalla
  // -----------------------------
  // Hora inicial seleccionada al crear una tarea desde el calendario (HH:mm).
  const [startSelectedHour, setSelectedHour] = useState("");
  // Hora final calculada automáticamente a partir de la hora inicial (por defecto +1h).
  const [endSelectedHour, setEndSelectedHour] = useState("");
  // Fecha completa seleccionada (día y hora) para la nueva tarea.
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // Tarea actualmente seleccionada para mostrar detalles o ejecutar sus pasos.
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // ----------------------------------------
  // Gestión de semana y día de la rutina
  // ----------------------------------------
  const {
    currentWeekStart, // Fecha del lunes (o día inicial) de la semana actual.
    selectedDayIndex, // Índice del día seleccionado dentro de la semana (0-6).
    setSelectedDayIndex, // Setter para cambiar el día activo.
    routineId, // Identificador de la rutina actual que se está visualizando.
    daysOfWeek, // Arreglo de fechas que representan cada día de la semana.
    handleChangeWeek, // Función para avanzar o retroceder de semana.
  } = useWeekRoutine(profileId || "");

  // -----------------------------------------------------------------
  // Obtención y actualización de tareas asociadas a la rutina actual
  // -----------------------------------------------------------------
  const { tasks, addTask, updateTaskState, handleTaskTimeChange } =
    useRoutineTasks(routineId);

  // Calcula un hash de las tareas para detectar cambios no solo en cantidad
  // sino también en el estado de las tareas (Pendiente, Completado, etc.)
  const tasksRefreshTrigger = useMemo(() => {
    return tasks.map((t) => `${t.id}-${t.estado}`).join(",");
  }, [tasks]);

  // --------------------------------------------
  // Control centralizado de todos los modales
  // --------------------------------------------
  const {
    isAddTaskModalVisible, // Modal para crear/editar una tarea.
    isTaskDetailsModalVisible, // Modal que muestra la información de la tarea.
    isTaskStepModalVisible, // Modal que guía al usuario por los pasos.
    isAchievementModalVisible, // Modal de celebración de logros.
    toggleAddTask, // Abre/cierra el modal de creación de tarea.
    openTaskDetails, // Abre el modal de detalles de tarea.
    closeTaskDetails, // Cierra el modal de detalles de tarea.
    openTaskStepModal, // Abre el modal de pasos de tarea.
    closeTaskStepModal, // Cierra el modal de pasos de tarea.
    openAchievementModal, // Muestra el modal de logro.
    closeAchievementModal, // Oculta el modal de logro.
  } = useModals();

  // ---------------------------------
  // Progreso global de la rutina
  // ---------------------------------
  // `percent` indica qué porcentaje de tareas de la rutina está completado.
  // Se pasa tasksRefreshTrigger para recalcular cuando cambian las tareas.
  const { percent } = useRoutineProgress(routineId, tasksRefreshTrigger);

  // Lanza la animación / modal de logro cuando el porcentaje alcanza un umbral.
  // El umbral concreto se define dentro del hook useAchievementCelebration.
  useAchievementCelebration({
    percent,
    onShowAchievement: openAchievementModal,
  });

  // ---------------------------------
  // Manejadores de interacción
  // ---------------------------------

  // Cuando el usuario toca una tarea en el calendario:
  // - se guarda la tarea seleccionada en `selectedTask`.
  // - se abre el modal de detalles para que el usuario pueda revisarla o iniciarla.
  const handleTaskPress = useCallback(
    (task: Task) => {
      setSelectedTask(task);
      openTaskDetails();
    },
    [openTaskDetails],
  );

  // Inicia la tarea seleccionada:
  // - cambia su estado a "En Proceso" en la fuente de datos.
  // - cierra el modal de detalles.
  // - abre el modal de pasos para guiar al usuario.
  const startTask = useCallback(() => {
    if (selectedTask?.id) {
      updateTaskState(selectedTask.id, "En Proceso");
    }
    closeTaskDetails();
    openTaskStepModal();
  }, [closeTaskDetails, openTaskStepModal, selectedTask, updateTaskState]);

  // Cierra el modal de pasos y limpia la tarea actualmente seleccionada.
  // Esto evita que quede una referencia obsoleta cuando el usuario salga.
  const closeTaskStep = useCallback(() => {
    closeTaskStepModal();
    setSelectedTask(null);
  }, [closeTaskStepModal]);

  // Maneja el toque en una hora del calendario para preconfigurar la creación de una tarea:
  // - construye la fecha completa combinando el día seleccionado y la hora pulsada.
  // - calcula automáticamente una hora de fin una hora después.
  // - guarda estos valores en el estado local.
  // - abre el modal de creación de tarea con la información prellenada.
  const handleHourPress = useCallback(
    (hour: string) => {
      const selectedDay = daysOfWeek[selectedDayIndex];
      const selectedDateTime = new Date(selectedDay);
      const [hourStr, minuteStr] = hour.split(":");
      selectedDateTime.setHours(parseInt(hourStr), parseInt(minuteStr));

      // Por defecto la tarea dura 1 hora desde la hora seleccionada.
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

  // Si está cargando el perfil o no hay profileId, mostrar indicador de carga
  if (profileLoading || !profileId) {
    return (
      <View style={styles.screenContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Cargando...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      {/*
        Encabezado de la pantalla de rutinas:
        - Botón de volver atrás a la pantalla anterior de navegación.
        - Título "Rutinas".
        - Componente ProgressItem que muestra el progreso global de la rutina.
      */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#2196F3" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{"Rutinas"}</Text>
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
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
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
