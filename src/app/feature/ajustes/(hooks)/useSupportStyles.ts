import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export const useSupportStyles = () => {
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
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 40,
        },
        emptyStateTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.text,
          textAlign: "center",
          marginBottom: 16,
        },
        emptyStateText: {
          fontSize: 16,
          color: themedColors.text,
          textAlign: "center",
          opacity: 0.7,
        },
        buttonContainer: {
          paddingHorizontal: 20,
          paddingBottom: 30,
          paddingTop: 10,
        },
        newEntryButton: {
          backgroundColor: themedColors.cardBackground,
          borderRadius: 25,
          paddingVertical: 16,
          paddingHorizontal: 24,
          alignItems: "center",
          justifyContent: "center",
        },
        newEntryButtonText: {
          fontSize: 18,
          fontWeight: "600",
          color: themedColors.secondary,
        },
        ticketCard: {
          backgroundColor: themedColors.cardBackground,
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
        },
        ticketHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
        },
        ticketSubject: {
          fontSize: 16,
          fontWeight: "700",
          color: themedColors.secondary,
          flex: 1,
          marginRight: 8,
        },
        ticketStatus: {
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 12,
          borderWidth: 2,
        },
        ticketStatusText: {
          fontSize: 12,
          fontWeight: "bold",
        },
        ticketMessage: {
          fontSize: 14,
          color: themedColors.secondary,
          opacity: 0.8,
          marginBottom: 8,
        },
        ticketDate: {
          fontSize: 12,
          color: themedColors.secondary,
          opacity: 0.6,
        },
        ticketsContainer: {
          paddingHorizontal: 20,
          paddingBottom: 20,
        },
      }),
    [themedColors],
  );
};
