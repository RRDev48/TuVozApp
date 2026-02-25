import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import React from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TaskDetailsModalProps } from "../../models/component.props";

const styles = StyleSheet.create({
  detailsOverlay: {
    flex: 1,
    backgroundColor: colors.transparent,
    justifyContent: "center",
    alignItems: "center",
  },

  detailsContainer: {
    width: "90%",
    height: "70%",
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },

  taskDetailsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.blue,
    marginBottom: 10,
  },

  taskDateDetailsText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    color: colors.darkGray,
    marginBottom: 20,
  },

  stepsContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  stepItem: {
    backgroundColor: colors.blue,
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
  },

  stepText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },

  startTaskButton: {
    backgroundColor: "#8BC34A",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    width: "90%",
  },

  startTaskButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
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

export const TaskDetailsModal = ({
  visible,
  task,
  onClose,
  onStartTask,
}: TaskDetailsModalProps) => {
  if (!task) return null;

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

  const borderColor = getStatusColor(task.estado || "Pendiente");

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.detailsOverlay}>
        {/* Contenedor principal del detalle de la tarea, con un borde
            grueso coloreado según el estado (pendiente, en proceso, etc.). */}
        <View
          style={[styles.detailsContainer, { borderColor, borderWidth: 5 }]}
        >
          {/* Botón "X" para cerrar el modal sin iniciar la tarea. */}
          <TouchableOpacity onPress={onClose} style={styles.closeXButton}>
            <Text style={styles.closeXButtonText}>×</Text>
          </TouchableOpacity>

          {/* Título principal de la tarea. */}
          <Text style={styles.taskDetailsTitle}>{task.titulo}</Text>
          {/* Información de fecha y hora planificada para la tarea. */}
          <Text style={styles.taskDateDetailsText}>
            {`Fecha: ${task.diaRutina} - Hora: ${task.horarioDesde}`}
          </Text>

          <View style={styles.stepsContainer}>
            {/* Lista simple de pasos de la tarea. Cada paso se muestra con
                su índice (1-based) y el texto correspondiente. */}
            <FlatList
              data={task.pasos}
              renderItem={({ item, index }) => (
                <View style={styles.stepItem}>
                  <Text style={styles.stepText}>
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
            style={styles.startTaskButton}
            onPress={onStartTask}
          >
            <Text style={styles.startTaskButtonText}>{"Iniciar Tarea"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TaskDetailsModal;
