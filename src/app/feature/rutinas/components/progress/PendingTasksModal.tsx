import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import CustomText from "../../../common/CustomText";
import { useCategories } from "../../hooks/useCategories";
import { Task } from "../../models/task.types";

interface PendingTasksModalProps {
  visible: boolean;
  onClose: () => void;
  tasks: Task[];
  completed: number;
  total: number;
  percent: number;
}

export const PendingTasksModal = ({
  visible,
  onClose,
  tasks,
  completed,
  total,
  percent,
}: PendingTasksModalProps) => {
  const { t } = useLanguageRefresh();
  const { getThemedColors, temaOscuro } = usePersonalization();
  const themedColors = getThemedColors();
  const { categories } = useCategories(visible);

  const pendingTasks = tasks.filter(
    (task) => task.estado === "Pendiente" || task.estado === "En Proceso",
  );

  const getCategoryImage = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.image;
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 100) {
      return "#4caf50";
    } else if (percentage >= 50) {
      return "#ffc107";
    } else {
      return "#f44336";
    }
  };

  const progressColor = getProgressColor(percent);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        modalOverlay: {
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
        },
        modalContainer: {
          backgroundColor: themedColors.background,
          borderRadius: 20,
          width: "90%",
          height: "90%",
          padding: 20,
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        closeButton: {
          position: "absolute",
          right: 15,
          top: 15,
          zIndex: 1,
          padding: 5,
        },
        header: {
          alignItems: "center",
          paddingVertical: 15,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: themedColors.secondary + "40",
        },
        title: {
          fontSize: 22,
          fontWeight: "bold",
          color: themedColors.text,
          marginBottom: 15,
        },
        progressCircle: {
          width: 100,
          height: 100,
          borderRadius: 50,
          borderWidth: 6,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 12,
          backgroundColor: colors.white,
        },
        percentText: {
          fontSize: 28,
          fontWeight: "bold",
        },
        completedText: {
          fontSize: 14,
          color: themedColors.primary,
          marginBottom: 4,
        },
        encouragementText: {
          fontSize: 16,
          fontWeight: "600",
          color: themedColors.primary,
        },
        tasksSection: {
          flex: 1,
          marginTop: 15,
          minHeight: 300,
        },
        sectionTitle: {
          fontSize: 17,
          fontWeight: "bold",
          color: themedColors.text,
          marginBottom: 12,
        },
        tasksList: {
          paddingBottom: 10,
          flexGrow: 1,
        },
        taskItem: {
          flexDirection: "row",
          backgroundColor: themedColors.cardBackground,
          borderRadius: 12,
          padding: 12,
          marginBottom: 10,
          width: "100%",
          alignItems: "center",
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: themedColors.secondary + "30",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: temaOscuro ? 0.3 : 0.08,
          shadowRadius: 4,
          elevation: 2,
        },
        categoryIconContainer: {
          width: 45,
          height: 45,
          borderRadius: 22.5,
          backgroundColor: themedColors.background,
          borderWidth: 2,
          borderColor: themedColors.primary,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
          overflow: "hidden",
        },
        categoryImage: {
          width: "100%",
          height: "100%",
        },
        taskInfo: {
          flex: 1,
        },
        taskTitle: {
          fontSize: 16,
          fontWeight: "600",
          color: themedColors.secondary,
          marginBottom: 6,
        },
        taskMeta: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 6,
        },
        taskSteps: {
          fontSize: 14,
          color: themedColors.secondary,
          marginLeft: 5,
        },
        statusBadge: {
          alignSelf: "flex-start",
          backgroundColor: themedColors.cardBackground,
          borderWidth: 1,
          borderColor: "#f57c00",
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 12,
        },
        statusBadgeInProgress: {
          borderColor: "#4caf50",
        },
        statusText: {
          fontSize: 12,
          color: "#f57c00",
          fontWeight: "600",
        },
        statusTextInProgress: {
          color: "#4caf50",
        },
        emptyState: {
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 40,
        },
        emptyText: {
          fontSize: 16,
          color: themedColors.primary,
          marginTop: 10,
          textAlign: "center",
        },
      }),
    [themedColors, temaOscuro],
  );

  const renderTaskItem = ({ item }: { item: Task }) => {
    const categoryImage = getCategoryImage(item.categoriaId);

    return (
      <View style={styles.taskItem}>
        {/* Icono/Imagen de la categoría */}
        <View style={styles.categoryIconContainer}>
          {categoryImage ? (
            <Image
              source={{ uri: categoryImage }}
              style={styles.categoryImage}
              resizeMode="cover"
            />
          ) : (
            <Ionicons
              name="folder-outline"
              size={28}
              color={themedColors.primary}
            />
          )}
        </View>

        {/* Información de la tarea */}
        <View style={styles.taskInfo}>
          <CustomText style={styles.taskTitle} numberOfLines={2}>
            {item.titulo}
          </CustomText>
          <View style={styles.taskMeta}>
            <Ionicons
              name="list-outline"
              size={16}
              color={themedColors.secondary}
            />
            <CustomText style={styles.taskSteps}>
              {item.pasos?.length || 0} {t('stepsAbbrev')}
            </CustomText>
          </View>
          <View
            style={[
              styles.statusBadge,
              item.estado === "En Proceso" && styles.statusBadgeInProgress,
            ]}
          >
            <CustomText
              style={[
                styles.statusText,
                item.estado === "En Proceso" && styles.statusTextInProgress,
              ]}
            >
              {item.estado}
            </CustomText>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Botón de cerrar */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color={colors.red} />
          </TouchableOpacity>

          {/* Encabezado con progreso */}
          <View style={styles.header}>
            <CustomText style={styles.title}>
              {t('routineProgress')}
            </CustomText>

            {/* Círculo de progreso */}
            <View
              style={[styles.progressCircle, { borderColor: progressColor }]}
            >
              <CustomText
                style={[styles.percentText, { color: progressColor }]}
              >
                {percent.toFixed(0)}%
              </CustomText>
            </View>

            <CustomText style={styles.completedText}>
              {t('completedTasks')} {completed}{" "}
              {t('of')} {total}
            </CustomText>
            {completed > 0 && (
              <CustomText style={styles.encouragementText}>
                {t('keepItUp')}
              </CustomText>
            )}
          </View>

          {/* Lista de tareas pendientes */}
          <View style={styles.tasksSection}>
            <CustomText style={styles.sectionTitle}>
              {t('pendingTasks')} ({pendingTasks.length})
            </CustomText>
            {pendingTasks.length > 0 ? (
              <FlatList
                data={pendingTasks}
                renderItem={renderTaskItem}
                keyExtractor={(item, index) =>
                  item.id ? item.id.toString() : `task-${index}`
                }
                contentContainerStyle={styles.tasksList}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons
                  name="checkmark-circle"
                  size={48}
                  color={themedColors.primary}
                />
                <CustomText style={styles.emptyText}>
                  {t('allTasksCompleted')}
                </CustomText>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PendingTasksModal;
