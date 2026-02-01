import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export const useBloodTypeSelectionStyles = () => {
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: themedColors.background,
        },
        contentContainer: {
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 120,
          alignItems: "center",
        },
        sectionTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.text,
          textAlign: "center",
          marginBottom: 30,
        },
        dropdownButton: {
          width: "100%",
          backgroundColor: themedColors.primary,
          borderRadius: 16,
          paddingVertical: 18,
          paddingHorizontal: 24,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        },
        dropdownButtonText: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.secondary,
        },
        overlay: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
      }),
    [themedColors],
  );
};

export const useAlertModeSelectionStyles = () => {
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: themedColors.background,
        },
        contentContainer: {
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 120,
          alignItems: "center",
        },
        sectionTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.text,
          textAlign: "center",
          marginBottom: 30,
        },
        dropdownButton: {
          width: "100%",
          backgroundColor: themedColors.primary,
          borderRadius: 16,
          paddingVertical: 18,
          paddingHorizontal: 24,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        },
        dropdownButtonText: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.secondary,
        },
        overlay: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
      }),
    [themedColors],
  );
};
