import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export const useSettingsStyles = () => {
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: themedColors.background,
        },
        userInfoContainer: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          marginBottom: 40,
        },
        avatarContainer: {
          marginRight: 20,
        },
        avatarCircle: {
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: themedColors.primary,
          justifyContent: "center",
          alignItems: "center",
        },
        avatarImage: {
          width: 60,
          height: 60,
        },
        greetingText: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.text,
          flex: 1,
        },
        buttonsContainer: {
          paddingHorizontal: 20,
        },
        buttonsContainerView: {
          paddingHorizontal: 20,
          gap: 16,
        },
        button: {
          backgroundColor: themedColors.cardBackground,
          paddingVertical: 16,
          paddingHorizontal: 20,
          borderRadius: 15,
          flexDirection: "row",
          alignItems: "center",
        },
        buttonIcon: {
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: themedColors.transparent,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 16,
        },
        buttonTextContainer: {
          flex: 1,
        },
        buttonTitle: {
          color: themedColors.background,
          fontSize: 18,
          fontWeight: "bold",
        },
        buttonSubtitle: {
          color: themedColors.background,
          fontSize: 14,
          opacity: 0.8,
          marginTop: 2,
        },
        buttonChevron: {
          marginLeft: 10,
        },
      }),
    [themedColors],
  );
};
