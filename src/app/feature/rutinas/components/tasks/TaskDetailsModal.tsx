// React
import React from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

// Componentes

// Constantes

// Modelos
import { TaskDetailsModalProps } from "../../(models)/component.props";

// Hooks

// Servicios

// Acciones

// Visuales
import {
  addTaskStyles,
  taskDetailsStyles,
} from "@/src/app/design-system/styles/tasks-Styles";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";

/**
 * Muestra un modal con el detalle de una tarea seleccionada.
 *
 * Responsabilidades principales:
 * - Presentar la información de la tarea (título, fecha, horario).
 * - Listar los pasos definidos para la tarea de forma ordenada.
 * - Resaltar visualmente el estado actual de la tarea mediante el color del borde.
 * - Permitir cerrar el modal o iniciar la tarea (lo que normalmente abre el flujo de pasos).
 *
 * Este componente es puramente de presentación: recibe la tarea a mostrar y
 * callbacks para cerrar el modal o iniciar la tarea. La lógica de qué ocurre
 * después de "Iniciar Tarea" se maneja en la pantalla que lo utiliza
 * (por ejemplo, RoutineScreen).
 */
export const TaskDetailsModal = ({
  visible,
  task,
  onClose,
  onStartTask,
}: TaskDetailsModalProps) => {
  // const { formatText } = usePersonalization();

  // Si por algún motivo no hay tarea seleccionada, no se renderiza nada.
  if (!task) return null;

  // Devuelve un color asociado al estado actual de la tarea para mostrarlo
  // en el borde del contenedor.
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendiente":
        return colors.red;
      case "En Proceso":
        return colors.yellow;
      case "Completado":
        return colors.green;
      default:
        return colors.darkGray;
    }
  };

  // El color del borde depende del estado de la tarea; por defecto se
  // considera "Pendiente" si no viene definido.
  const borderColor = getStatusColor(task.estado || "Pendiente");

  return (
    // Modal nativo de React Native que se muestra sobre el contenido actual.
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={taskDetailsStyles.detailsOverlay}>
        {/* Contenedor principal del detalle de la tarea, con un borde
            grueso coloreado según el estado (pendiente, en proceso, etc.). */}
        <View
          style={[
            taskDetailsStyles.detailsContainer,
            { borderColor, borderWidth: 5 },
          ]}
        >
          {/* Botón "X" para cerrar el modal sin iniciar la tarea. */}
          <TouchableOpacity
            onPress={onClose}
            style={addTaskStyles.closeXButton}
          >
            <Text style={addTaskStyles.closeXButtonText}>×</Text>
          </TouchableOpacity>

          {/* Título principal de la tarea. */}
          <Text style={taskDetailsStyles.taskDetailsTitle}>{task.titulo}</Text>
          {/* Información de fecha y hora planificada para la tarea. */}
          <Text style={taskDetailsStyles.taskDateDetailsText}>
            {`Fecha: ${task.diaRutina} - Hora: ${task.horarioDesde}`}
          </Text>

          <View style={taskDetailsStyles.stepsContainer}>
            {/* Lista simple de pasos de la tarea. Cada paso se muestra con
                su índice (1-based) y el texto correspondiente. */}
            <FlatList
              data={task.pasos}
              renderItem={({ item, index }) => (
                <View style={taskDetailsStyles.stepItem}>
                  <Text style={taskDetailsStyles.stepText}>
                    {index + 1} - {item}
                  </Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>

          {/* Botón que dispara el callback para "iniciar" la tarea.
              Normalmente esto cambiará el estado a "En Proceso" y abrirá
              el modal donde se muestran los pasos interactivos. */}
          <TouchableOpacity
            style={taskDetailsStyles.startTaskButton}
            onPress={onStartTask}
          >
            <Text style={taskDetailsStyles.startTaskButtonText}>
              {"Iniciar Tarea"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TaskDetailsModal;
