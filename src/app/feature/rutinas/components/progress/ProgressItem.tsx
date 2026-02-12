// React
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Componentes
import { PendingTasksModal } from "./PendingTasksModal";

// Visuales
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { Ionicons } from "@expo/vector-icons";

// Constantes
import { ProgressItemProps } from "../../(models)/component.props";

// Modelos

// Hooks
import { useRoutineProgress } from "../../(hooks)/useRoutineProgress";

// Servicios

// Acciones

// Visuales

/**
 * ProgressItem
 * ------------
 * Pequeño componente de resumen que muestra el progreso de una rutina
 * en formato porcentaje y contador completado/total.
 *
 * Props:
 * - routineId: identificador numérico o string de la rutina sobre la que
 *   se calculará el progreso.
 * - refreshTrigger: valor opcional que al cambiar fuerza la recarga del progreso.
 * - tasks: arreglo de tareas para mostrar en el modal de detalles.
 */
export const ProgressItem = ({
  routineId,
  refreshTrigger,
  tasks = [],
}: ProgressItemProps) => {
  // const { formatText } = usePersonalization();
  // Estado para controlar la visibilidad del modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Obtiene desde el hook de progreso:
  // - completed: cantidad de tareas completadas.
  // - total: cantidad total de tareas de la rutina.
  // - percent: porcentaje de avance (0-100).
  const { completed, total, percent } = useRoutineProgress(
    Number(routineId),
    refreshTrigger,
  );

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.progressContainer}>
          <Ionicons
            name="stats-chart"
            size={20}
            color={colors.blue || "#2196F3"}
            style={styles.icon}
          />
          <Text style={styles.progressText}>
            {"Progreso:"}{" "}
            <Text style={styles.percentText}>{percent.toFixed(0)}%</Text>{" "}
            <Text style={styles.countText}>
              ({completed}/{total})
            </Text>
          </Text>
        </View>
      </TouchableOpacity>

      <PendingTasksModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        tasks={tasks}
        completed={completed}
        total={total}
        percent={percent}
      />
    </>
  );
};

// Estilos mejorados para hacer el componente más llamativo
const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
  },
  progressText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
  },
  percentText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.blue || "#2196F3",
  },
  countText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
});

export default ProgressItem;
