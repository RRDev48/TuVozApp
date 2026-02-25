import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRoutineProgress } from "../../hooks/useRoutineProgress";
import { ProgressItemProps } from "../../models/component.props";
import { PendingTasksModal } from "./PendingTasksModal";

export const ProgressItem = ({
  routineId,
  refreshTrigger,
  tasks = [],
}: ProgressItemProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

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
