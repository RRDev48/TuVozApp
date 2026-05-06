import {
    ImageSourcePropType,
    ImageStyle,
    StyleProp,
    TextStyle,
    ViewStyle,
} from "react-native";
import { Task } from "./task.types";

export interface AchievementModalProps {
  visible: boolean;
  onClose: () => void;
  autoCloseDelay?: number;
}

export interface DayCalendarViewProps {
  tasks: Task[];
  onTaskTimeChange: (
    taskId: string,
    newStartTime: string,
    newEndTime: string,
  ) => void;
  onTaskPress: (task: Task) => void;
  onHourPress: (hour: string) => void;
}

export interface DraggableTaskItemProps {
  task: Task;
  topPosition: number;
  height: number;
  hourHeight: number;
  columnIndex: number;
  totalColumns: number;
  onPositionChange: (newTop: number, newHeight: number) => void;
  onPress: () => void;
}

export interface CalendarModalProps {
  visible: boolean;
  selectedDate?: string | null;
  onClose: () => void;
  onDateSelect: (date: string) => void;
}

export interface RoutineTimeModalProps {
  visible: boolean;
  onClose: () => void;
  onTimeSelected: (startTime: string, endTime: string) => void;
}

export interface ReminderModalProps {
  visible: boolean;
  initialSelectedOption?: string | null;
  onClose: () => void;
  onSetReminder: (reminder: { label: string; offsetMs: number }) => void;
}

export interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onCategorySelect: (
    selectedCategoryId: string,
    selectedCategoryName: string,
  ) => void;
}

export interface AddTaskModalProps {
  visible: boolean;
  selectedDate: Date | null;
  selectedStartHour: string;
  calculateEndHour: string;
  onClose: () => void;
  updateTasks: (newTask: Task) => void;
  profileId: string;
  taskToEdit?: Task | null;
  onTaskUpdated?: (task: Task) => void;
}

export interface TaskStepModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onRestart: () => void;
  updateTaskState: (taskId: string, newState: string) => void;
}

export interface TaskDetailsModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onStartTask: () => void;
  onEditTask?: () => void;
  onDeleteTask?: () => void;
}

export interface StepItemModalProps {
  id: number;
  text: string;
  index: number;
  stepsCount: number;
  onTextChange: (text: string, index: number) => void;
  onRemove: (index: number) => void;
}

export interface DaysOfWeekProps {
  currentWeekStart: Date;
  selectedDayIndex: number;
  setSelectedDayIndex: (index: number) => void;
  routineId: number;
  profileId: string;
  onChangeWeek?: (newStartDate: Date) => void;
}

export interface ChangeWeekProps {
  currentWeekStart: Date;
  onChangeWeek: (newStartDate: Date) => void;
}

export interface TasksItemProps {
  titulo: string;
  estado: string;
  categoriaId: string;
  pasos: string[];
}

export interface ProgressItemProps {
  routineId: number | string;
  refreshTrigger?: number | string;
  tasks?: Task[];
}

export interface ReminderOptionButtonProps {
  label: string;
  value: string;
  isSelected: boolean;
  onPress: (value: string) => void;
}

export interface TimeInputFieldProps {
  label: string;
  value: string;
  error: boolean;
  placeholder: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
  icon?: React.ReactNode;
}

export interface MenuItemProps {
  name: string;
  route: string;
  image: ImageSourcePropType;
  styles: {
    itemContainer: StyleProp<ViewStyle>;
    buttonContainer: StyleProp<ViewStyle>;
    icon: StyleProp<ImageStyle>;
    textCard: StyleProp<TextStyle>;
  };
}
