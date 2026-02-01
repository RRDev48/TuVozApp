import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export const useEditAddressScreenStyles = () => {
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
        deleteButton: {
          position: "absolute",
          bottom: 28,
          left: 20,
          right: 20,
          backgroundColor: "transparent",
          paddingVertical: 18,
          borderRadius: 16,
          alignItems: "center",
          borderWidth: 2,
          borderColor: colors.red,
        },
        deleteButtonText: {
          fontSize: 18,
          fontWeight: "bold",
          color: colors.red,
        },
      }),
    [themedColors],
  );
};
