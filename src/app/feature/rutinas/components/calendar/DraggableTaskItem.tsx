import i18n from "@/src/app/i18n";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import CustomText from "../../../common/CustomText";
import { STATUS_COLOR_MAP } from "../../constants/task.constants";
import { useCategories } from "../../hooks/useCategories";
import { useTaskGestures } from "../../hooks/useTaskGestures";
import { DraggableTaskItemProps } from "../../models/component.props";

const styles = StyleSheet.create({
  taskContainer: {
    position: "absolute",
    paddingHorizontal: 2,
    borderRadius: 8,
    overflow: "visible",
  },
  taskContent: {
    flex: 1,
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 8,
    paddingTop: 18,
    paddingBottom: 18,
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  resizeIndicatorTop: {
    position: "absolute",
    top: 4,
    left: 0,
    right: 0,
    height: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  taskInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 4,
    justifyContent: "center",
  },
  categoryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    overflow: "hidden",
  },
  categoryIcon: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    flex: 1,
  },
  taskTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  taskMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepsText: {
    color: "#fff",
    fontSize: 11,
    opacity: 0.9,
    marginLeft: 4,
  },
  resizeIndicatorBottom: {
    position: "absolute",
    bottom: 4,
    left: 0,
    right: 0,
    height: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  resizeIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 2,
  },
});

export const DraggableTaskItem = ({
  task,
  topPosition,
  height,
  hourHeight,
  columnIndex,
  totalColumns,
  onPositionChange,
  onPress,
}: DraggableTaskItemProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { categories } = useCategories();

  const { translateY, taskHeight, composedGesture } = useTaskGestures({
    hourHeight,
    initialTop: topPosition,
    initialHeight: height,
    onPositionChange,
    onPress,
    setIsDragging,
  });

  const columnWidthPercent = totalColumns > 1 ? 100 / totalColumns : 100;
  const leftPositionPercent =
    totalColumns > 1 ? (columnIndex * 100) / totalColumns : 0;

  const statusColor = useMemo(() => {
    return STATUS_COLOR_MAP[task.estado || "Pendiente"] ?? colors.red;
  }, [task.estado]);

  const categoryImage = useMemo(() => {
    const category = categories.find((cat) => cat.id === task.categoriaId);
    return category?.image || null;
  }, [task.categoriaId, categories]);

  const isCompactMode = columnWidthPercent < 50;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    height: taskHeight.value,
    opacity: isDragging ? 0.8 : 1,
  }));

  return (
    <Animated.View
      style={[
        styles.taskContainer,
        animatedStyle,
        { width: `${columnWidthPercent}%`, left: `${leftPositionPercent}%` },
      ]}
    >
      <GestureDetector gesture={composedGesture}>
        <View
          style={[
            styles.taskContent,
            { backgroundColor: statusColor, borderLeftColor: statusColor },
          ]}
        >
          {/* Indicador visual en la parte superior que permite redimensionar la tarea. */}
          <View style={styles.resizeIndicatorTop}>
            <View style={styles.resizeIndicator} />
          </View>

          {/* Contenido principal de la tarjeta de tarea con nuevo diseño */}
          <View style={styles.taskInfo}>
            {/* Icono circular de categoría */}
            <View
              style={
                isCompactMode
                  ? [
                      styles.categoryIconContainer,
                      {
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        marginRight: 0,
                      },
                    ]
                  : styles.categoryIconContainer
              }
            >
              {categoryImage ? (
                <Image
                  source={{ uri: categoryImage }}
                  style={styles.categoryIcon}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons
                  name="folder-outline"
                  size={isCompactMode ? 20 : 24}
                  color="#fff"
                />
              )}
            </View>

            {/* Información de la tarea - Solo se muestra si NO está en modo compacto */}
            {!isCompactMode && (
              <View style={styles.textContainer}>
                <CustomText style={styles.taskTitle} numberOfLines={2}>
                  {task.titulo}
                </CustomText>
                {task.pasos && task.pasos.length > 0 && (
                  <View style={styles.taskMeta}>
                    <Ionicons name="list-outline" size={12} color="#fff" />
                    <CustomText style={styles.stepsText}>
                      {task.pasos.length}{" "}
                      {i18n.t(task.pasos.length !== 1 ? 'stepsAbbrev' : 'step')}
                    </CustomText>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Indicador visual en la parte inferior que permite redimensionar la tarea. */}
          <View style={styles.resizeIndicatorBottom}>
            <View style={styles.resizeIndicator} />
          </View>
        </View>
      </GestureDetector>
    </Animated.View>
  );
};

export default DraggableTaskItem;
