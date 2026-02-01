import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export const useAllergyFormStyles = () => {
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
        },
        sectionTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.text,
          marginBottom: 20,
          textAlign: "center",
        },
        firstSection: {
          marginBottom: 30,
        },
        dropdownButton: {
          backgroundColor: themedColors.primary,
          borderRadius: 16,
          paddingVertical: 18,
          paddingHorizontal: 24,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
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

export const useEditAllergyScreenStyles = () => {
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
          paddingBottom: 180,
        },
        sectionTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.text,
          marginBottom: 20,
          textAlign: "center",
        },
        firstSection: {
          marginBottom: 30,
        },
        dropdownButton: {
          backgroundColor: themedColors.primary,
          borderRadius: 16,
          paddingVertical: 18,
          paddingHorizontal: 24,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        dropdownButtonText: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.secondary,
        },
        deleteButton: {
          position: "absolute",
          bottom: 28,
          left: 20,
          right: 20,
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: colors.red,
          borderRadius: 16,
          paddingVertical: 16,
          alignItems: "center",
          justifyContent: "center",
        },
        deleteButtonText: {
          color: colors.red,
          fontSize: 18,
          fontWeight: "bold",
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

export const useAllergiesScreenStyles = () => {
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
        },
        sectionTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.text,
          textAlign: "center",
          marginBottom: 30,
        },
      }),
    [themedColors],
  );
};
