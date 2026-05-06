import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import CustomText from "../../../common/CustomText";
import { TaskDetailsModalProps } from "../../models/component.props";

export const TaskDetailsModal = ({
  visible,
  task,
  onClose,
  onStartTask,
  onEditTask,
  onDeleteTask,
}: TaskDetailsModalProps) => {
  const { t } = useLanguageRefresh();
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        detailsOverlay: {
          flex: 1,
          backgroundColor: colors.transparent,
          justifyContent: "center",
          alignItems: "center",
        },
        detailsContainer: {
          width: "90%",
          height: "70%",
          backgroundColor: themedColors.background,
          borderRadius: 20,
          padding: 20,
          alignItems: "center",
          justifyContent: "space-between",
        },
        taskDetailsTitle: {
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          color: themedColors.primary,
          marginBottom: 10,
        },
        taskDateDetailsText: {
          fontSize: 16,
          textAlign: "center",
          fontWeight: "bold",
          color: themedColors.text,
          marginBottom: 20,
        },
        stepsContainer: {
          flex: 1,
          width: "100%",
          paddingHorizontal: 10,
          marginBottom: 10,
        },
        stepItem: {
          backgroundColor: themedColors.cardBackground,
          padding: 12,
          borderRadius: 10,
          marginVertical: 5,
        },
        stepText: {
          color: themedColors.background,
          fontWeight: "bold",
          fontSize: 16,
        },
        headerRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: 16,
        },
        actionIcons: {
          flexDirection: "row",
          gap: 6,
        },
        iconButton: {
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: "center",
          justifyContent: "center",
        },
        closeButton: {
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: "center",
          justifyContent: "center",
        },
        startTaskButton: {
          backgroundColor: "#8BC34A",
          padding: 12,
          borderRadius: 20,
          alignItems: "center",
          width: "90%",
        },
        startTaskButtonDisabled: {
          backgroundColor: themedColors.secondary,
          opacity: 0.5,
        },
        startTaskButtonText: {
          color: colors.white,
          fontSize: 16,
          fontWeight: "bold",
        },
      }),
    [themedColors],
  );
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
  const isTaskCompleted = task.estado === "Completado";
  const canEditOrDelete = task.estado === "Pendiente" || !task.estado;

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.detailsOverlay}>
        {/* Contenedor principal del detalle de la tarea, con un borde
            grueso coloreado según el estado (pendiente, en proceso, etc.). */}
        <View
          style={[styles.detailsContainer, { borderColor, borderWidth: 5 }]}
        >
          {/* Fila de cabecera: iconos editar/eliminar a la izquierda, cerrar a la derecha */}
          <View style={styles.headerRow}>
            <View style={styles.actionIcons}>
              {onEditTask && canEditOrDelete && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={onEditTask}
                >
                  <Ionicons
                    name="pencil-outline"
                    size={25}
                    color={themedColors.primary}
                  />
                </TouchableOpacity>
              )}
              {onDeleteTask && canEditOrDelete && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={onDeleteTask}
                >
                  <Ionicons
                    name="trash-outline"
                    size={25}
                    color={themedColors.primary}
                  />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={25} color={colors.red} />
            </TouchableOpacity>
          </View>

          {/* Título principal de la tarea. */}
          <CustomText style={styles.taskDetailsTitle}>{task.titulo}</CustomText>
          {/* Información de fecha y hora planificada para la tarea. */}
          <CustomText style={styles.taskDateDetailsText}>
            {t('dateAndHour', { date: task.diaRutina, hour: task.horarioDesde })}
          </CustomText>

          <View style={styles.stepsContainer}>
            {/* Lista simple de pasos de la tarea. Cada paso se muestra con
                su índice (1-based) y el texto correspondiente. */}
            <FlatList
              data={task.pasos}
              renderItem={({ item, index }) => (
                <View style={styles.stepItem}>
                  <CustomText style={styles.stepText}>
                    {index + 1} - {item}
                  </CustomText>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>

          {/* Botón que dispara el callback para "iniciar" la tarea.
              Normalmente esto cambiará el estado a "En Proceso" y abrirá
              el modal donde se muestran los pasos interactivos.
              Se deshabilita si la tarea ya está completada. */}
          <TouchableOpacity
            style={[
              styles.startTaskButton,
              isTaskCompleted && styles.startTaskButtonDisabled,
            ]}
            onPress={onStartTask}
            disabled={isTaskCompleted}
          >
            <CustomText style={styles.startTaskButtonText}>
              {isTaskCompleted
                ? t('taskCompleted')
                : t('startTask')}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TaskDetailsModal;
