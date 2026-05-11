import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import SkeletonButton from "../../components/common/SkeletonButton";
import SkeletonCard from "../../components/common/SkeletonCard";
import SkeletonText from "../../components/common/SkeletonText";

const { width } = Dimensions.get("window");

const ExpresateLoading = () => {
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  return (
    <View style={[styles.container, { backgroundColor: themedColors.background }]}>
      <View style={styles.header}>
        <SkeletonText width={150} height={30} borderRadius={8} />
      </View>

      <View style={styles.grid}>
        <View style={styles.row}>
          <SkeletonCard width={width * 0.4} height={width * 0.4} />
          <SkeletonCard width={width * 0.4} height={width * 0.4} />
        </View>
        <View style={styles.row}>
          <SkeletonCard width={width * 0.4} height={width * 0.4} />
          <SkeletonCard width={width * 0.4} height={width * 0.4} />
        </View>
      </View>

      <View style={styles.footer}>
        <SkeletonButton height={60} borderRadius={15} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  grid: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  footer: {
    marginBottom: 40,
  },
});

export default ExpresateLoading;
