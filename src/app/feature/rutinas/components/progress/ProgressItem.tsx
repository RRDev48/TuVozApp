import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "../../../common/CustomText";
import { ProgressItemProps } from "../../models/component.props";
import { PendingTasksModal } from "./PendingTasksModal";

export const ProgressItem = ({
  routineId,
  refreshTrigger,
  tasks = [],
}: ProgressItemProps) => {
  const { t } = useLanguageRefresh();
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const completed = useMemo(() => 
    tasks.filter((task) => task.estado === "Completado").length,
    [tasks]
  );
  const total = tasks.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const styles = useMemo(
    () =>
      StyleSheet.create({
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
          color: themedColors.text,
        },
        percentText: {
          fontSize: 20,
          fontWeight: "bold",
          color: themedColors.text,
        },
        countText: {
          fontSize: 16,
          fontWeight: "500",
          color: themedColors.text,
        },
      }),
    [themedColors],
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
            color={themedColors.primary}
            style={styles.icon}
          />
          <CustomText style={styles.progressText}>
            {t('progress')}{" "}
            <CustomText style={styles.percentText}>
              {percent.toFixed(0)}%
            </CustomText>{" "}
            <CustomText style={styles.countText}>
              ({completed}/{total})
            </CustomText>
          </CustomText>
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

export default ProgressItem;
