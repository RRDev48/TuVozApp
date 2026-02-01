import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export const useHomeStyles = () => {
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  return useMemo(() => {
    return StyleSheet.create({
      screenContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: themedColors.background,
      },
      headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        gap: 15,
      },
      userIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: themedColors.primary,
      },
      greetingText: {
        fontSize: 24,
        color: themedColors.text,
        fontWeight: "bold",
        flex: 1,
      },
      itemContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
      },
      buttonContainer: {
        width: 130,
        height: 130,
        backgroundColor: themedColors.cardBackground,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
      },
      textCard: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        color: themedColors.text,
        marginTop: 5,
      },
      icon: {
        width: 70,
        height: 70,
      },
    });
  }, [themedColors]);
};
