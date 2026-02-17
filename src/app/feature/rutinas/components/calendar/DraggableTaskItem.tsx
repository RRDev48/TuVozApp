// React
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

// Componentes

// Constantes
import { STATUS_COLOR_MAP } from "../../constants/task.constants";

// Modelos
import { Category } from "../../(models)/category.types";
import { DraggableTaskItemProps } from "../../(models)/component.props";

// Hooks
import { useTaskGestures } from "../../(hooks)/useTaskGestures";

// Servicios
import { getCategories } from "../../(services)/category.service";

// Acciones

// Visuales
import { colors } from "@/src/app/design-system/themes/globalColors-theme";

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

/**
 * DraggableTaskItem
 * -----------------
 * Representa visualmente una tarea dentro del calendario diario.
 *
 * Responsabilidades:
 * - Mostrar la información básica de la tarea (título, número de pasos, categoría).
 * - Posicionarse en el calendario según su hora de inicio y duración.
 * - Permitir arrastrar el bloque verticalmente para cambiar la hora.
 * - Permitir redimensionar el bloque desde los extremos para ajustar la duración.
 */
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
  // const { formatText } = usePersonalization();
  // Indica si el usuario está interactuando (arrastrando/redimensionando) con la tarea.
  const [isDragging, setIsDragging] = useState(false);
  // Estado para las categorías cargadas desde Supabase
  const [categories, setCategories] = useState<Category[]>([]);

  // Cargar categorías al montar el componente
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  // Hook que encapsula toda la lógica de gestos (drag + resize) de la tarea.
  // Devuelve:
  // - translateY: posición vertical animada del bloque.
  // - taskHeight: altura animada del bloque.
  // - composedGesture: gesto combinado que se pasa al GestureDetector.
  const { translateY, taskHeight, composedGesture } = useTaskGestures({
    hourHeight,
    initialTop: topPosition,
    initialHeight: height,
    onPositionChange,
    onPress,
    setIsDragging,
  });

  // Cálculo del ancho de la columna cuando existen colisiones de tareas.
  // Si hay varias tareas en paralelo, se reparten equitativamente el ancho.
  const columnWidthPercent = totalColumns > 1 ? 100 / totalColumns : 100;
  const leftPositionPercent =
    totalColumns > 1 ? (columnIndex * 100) / totalColumns : 0;

  // Color de fondo asociado al estado actual de la tarea (Pendiente, En Proceso, etc.).
  // Si el estado no está definido, se toma "Pendiente" como valor por defecto.
  const statusColor = useMemo(() => {
    return STATUS_COLOR_MAP[task.estado || "Pendiente"] ?? colors.red;
  }, [task.estado]);

  // Icono asociado a la categoría de la tarea desde Supabase.
  // Si no se encuentra, se intenta usar el mapeo local como fallback.
  const categoryImage = useMemo(() => {
    const category = categories.find((cat) => cat.id === task.categoriaId);
    return category?.image || null;
  }, [task.categoriaId, categories]);

  // Determinar si hay suficiente espacio para mostrar todo el contenido
  // Si el ancho de la columna es menor al 50% (cuando hay 2+ tareas en paralelo),
  // solo mostramos el ícono de categoría
  const isCompactMode = columnWidthPercent < 50;

  // Estilos animados del contenedor de la tarea.
  // - translateY y height provienen de la lógica de gestos.
  // - opacity se reduce ligeramente mientras se arrastra para dar feedback visual.
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
        // Posicionamiento horizontal en función del número de columnas y el índice.
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
                <Text style={styles.taskTitle} numberOfLines={2}>
                  {task.titulo}
                </Text>
                {task.pasos && task.pasos.length > 0 && (
                  <View style={styles.taskMeta}>
                    <Ionicons name="list-outline" size={12} color="#fff" />
                    <Text style={styles.stepsText}>
                      {task.pasos.length}{" "}
                      {task.pasos.length !== 1 ? "pasos" : "paso"}
                    </Text>
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
