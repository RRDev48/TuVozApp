import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export const usePersonalizationStyles = () => {
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: themedColors.background,
        },
        content: {
          flex: 1,
          paddingHorizontal: 16,
        },
        optionContainer: {
          marginBottom: 40,
        },
        optionRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        optionTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.text,
        },
        sizeContainer: {
          flexDirection: "row",
          gap: 8,
          marginTop: 16,
        },
        sizeContainerColumn: {
          flexDirection: "column",
          gap: 12,
        },
        sizeButton: {
          flex: 1,
          paddingVertical: 12,
          paddingHorizontal: 10,
          borderRadius: 20,
          backgroundColor: themedColors.cardBackground,
          alignItems: "center",
          justifyContent: "center",
          minHeight: 44,
        },
        sizeButtonColumn: {
          flex: 0,
          width: "100%",
        },
        sizeButtonActive: {
          backgroundColor: colors.yellow,
        },
        sizeText: {
          fontSize: 14,
          fontWeight: "600",
          color: themedColors.background,
          textAlign: "center",
        },
        sizeTextActive: {
          color: colors.black,
        },
        switchContainer: {
          borderWidth: 2,
          borderRadius: 20,
          padding: 2,
        },
        switchContainerActive: {
          borderColor: colors.green,
        },
        switchContainerInactive: {
          borderColor: colors.red,
        },
      }),
    [themedColors],
  );
};
