import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Category } from "../../models/category.types";
import { Task } from "../../models/task.types";
import { getCategories } from "../../services/category.service";

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
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (visible) {
      getCategories().then(setCategories);
    }
  }, [visible, tasks]);

  const pendingTasks = tasks.filter(
    (task) => task.estado === "Pendiente" || task.estado === "En Proceso",
  );

  const getCategoryImage = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.image;
  };

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
            <Ionicons name="folder-outline" size={32} color={colors.blue} />
          )}
        </View>

        {/* Información de la tarea */}
        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle} numberOfLines={2}>
            {item.titulo}
          </Text>
          <View style={styles.taskMeta}>
            <Ionicons name="list-outline" size={16} color="#666" />
            <Text style={styles.taskSteps}>
              {item.pasos?.length || 0} {"pasos"}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              item.estado === "En Proceso" && styles.statusBadgeInProgress,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                item.estado === "En Proceso" && styles.statusTextInProgress,
              ]}
            >
              {item.estado}
            </Text>
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
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>

          {/* Encabezado con progreso */}
          <View style={styles.header}>
            <Text style={styles.title}>{"Progreso de Rutina"}</Text>

            {/* Círculo de progreso */}
            <View style={styles.progressCircle}>
              <Text style={styles.percentText}>{percent.toFixed(0)}%</Text>
            </View>

            <Text style={styles.completedText}>
              {"Tareas Completadas:"} {completed} {"de"} {total}
            </Text>
            {completed > 0 && (
              <Text style={styles.encouragementText}>{"¡Sigue así!"}</Text>
            )}
          </View>

          {/* Lista de tareas pendientes */}
          <View style={styles.tasksSection}>
            <Text style={styles.sectionTitle}>
              {"Tareas pendientes:"} ({pendingTasks.length})
            </Text>
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
                  color={colors.blue}
                />
                <Text style={styles.emptyText}>
                  {"¡Todas las tareas completadas!"}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
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
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 6,
    borderColor: colors.blue,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#f5f5f5",
  },
  percentText: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.blue,
  },
  completedText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  encouragementText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.blue,
  },
  tasksSection: {
    flex: 1,
    marginTop: 15,
    minHeight: 300,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  tasksList: {
    paddingBottom: 10,
    flexGrow: 1,
  },
  taskItem: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categoryIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#e3f2fd",
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
    color: "#333",
    marginBottom: 6,
  },
  taskMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  taskSteps: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#fff3e0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeInProgress: {
    backgroundColor: "#e8f5e9",
  },
  statusText: {
    fontSize: 12,
    color: "#f57c00",
    fontWeight: "600",
  },
  statusTextInProgress: {
    color: "#2e7d32",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
});

export default PendingTasksModal;
