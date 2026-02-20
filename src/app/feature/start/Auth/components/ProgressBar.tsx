import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${progress}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: colors.lightGray,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.green,
    borderRadius: 2,
  },
});

export default ProgressBar;
