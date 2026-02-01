import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export const useNotesScreenStyles = () => {
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
      }),
    [themedColors],
  );
};

export const useEmergencyContactScreenStyles = () => {
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
        phoneContainer: {
          flexDirection: "row",
          gap: 10,
          marginBottom: 30,
        },
        countryCodeButton: {
          backgroundColor: themedColors.primary,
          borderRadius: 12,
          paddingVertical: 16,
          paddingHorizontal: 15,
          flexDirection: "row",
          alignItems: "center",
          minWidth: 120,
        },
        flagText: {
          fontSize: 24,
          marginRight: 8,
        },
        countryCodeText: {
          fontSize: 16,
          fontWeight: "bold",
          color: themedColors.secondary,
          marginRight: 4,
        },
        phoneInput: {
          flex: 1,
          backgroundColor: themedColors.primary,
          borderRadius: 12,
          paddingVertical: 16,
          paddingHorizontal: 20,
          fontSize: 16,
          fontWeight: "bold",
          color: themedColors.secondary,
        },
        countryCodeList: {
          backgroundColor: themedColors.primary,
          borderRadius: 16,
          paddingVertical: 8,
          marginBottom: 20,
          maxHeight: 300,
        },
        countryCodeItem: {
          paddingVertical: 12,
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: themedColors.secondary,
        },
        countryCodeItemLast: {
          borderBottomWidth: 0,
        },
        countryFlag: {
          fontSize: 24,
          marginRight: 12,
        },
        countryInfo: {
          flex: 1,
        },
        countryName: {
          fontSize: 16,
          fontWeight: "bold",
          color: themedColors.secondary,
          marginBottom: 2,
        },
        countryCode: {
          fontSize: 14,
          fontWeight: "bold",
          color: themedColors.secondary,
        },
        overlay: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "transparent",
        },
        dropdownWrapper: {
          marginBottom: 20,
        },
      }),
    [themedColors],
  );
};

export const useEmergencyScreenStyles = () => {
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: themedColors.background,
        },
        scrollContent: {
          padding: 20,
          paddingBottom: 120,
        },
        loadingContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        buttonsContainer: {
          position: "absolute",
          bottom: 40,
          left: 20,
          right: 20,
          flexDirection: "row",
          gap: 12,
        },
        cancelButton: {
          flex: 1,
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: colors.red,
          borderRadius: 16,
          paddingVertical: 16,
          alignItems: "center",
          justifyContent: "center",
        },
        cancelButtonText: {
          color: colors.red,
          fontSize: 18,
          fontWeight: "bold",
        },
        nextButton: {
          flex: 1,
          backgroundColor: colors.green,
          borderRadius: 16,
          paddingVertical: 16,
          alignItems: "center",
          justifyContent: "center",
        },
        nextButtonText: {
          color: colors.black,
          fontSize: 18,
          fontWeight: "bold",
        },
      }),
    [themedColors],
  );
};

export const useEmergencyScreen2Styles = () => {
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: themedColors.background,
        },
        scrollContent: {
          padding: 20,
          paddingBottom: 120,
        },
        loadingContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        buttonsContainer: {
          position: "absolute",
          bottom: 40,
          left: 20,
          right: 20,
          flexDirection: "row",
          gap: 12,
        },
        cancelButton: {
          flex: 1,
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: colors.red,
          borderRadius: 16,
          paddingVertical: 16,
          alignItems: "center",
          justifyContent: "center",
        },
        cancelButtonText: {
          color: colors.red,
          fontSize: 18,
          fontWeight: "bold",
        },
        saveButton: {
          flex: 1,
          backgroundColor: colors.green,
          borderRadius: 16,
          paddingVertical: 16,
          alignItems: "center",
          justifyContent: "center",
        },
        saveButtonText: {
          color: colors.black,
          fontSize: 18,
          fontWeight: "bold",
        },
      }),
    [themedColors],
  );
};

export const useEmergencyProfileScreenStyles = () => {
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: themedColors.background,
        },
        scrollContent: {
          padding: 20,
          paddingBottom: 150,
        },
        loadingContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        section: {
          backgroundColor: themedColors.primary,
          borderRadius: 16,
          padding: 20,
          marginBottom: 5,
        },
        sectionTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.secondary,
          marginBottom: 12,
          textAlign: "center",
        },
        infoRow: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 8,
        },
        infoLabel: {
          fontSize: 16,
          fontWeight: "medium",
          color: themedColors.secondary,
          marginLeft: 8,
        },
        infoValue: {
          fontSize: 16,
          color: themedColors.secondary,
          marginLeft: 8,
          flex: 1,
          textAlign: "right",
        },
        buttonsContainer: {
          position: "absolute",
          bottom: 25,
          left: 20,
          right: 20,
          gap: 12,
        },
        emergencyButton: {
          backgroundColor: colors.red,
          borderRadius: 16,
          paddingVertical: 16,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 8,
        },
        emergencyButtonText: {
          color: colors.white,
          fontSize: 18,
          fontWeight: "bold",
        },
        alertButton: {
          backgroundColor: colors.blue,
          borderRadius: 16,
          paddingVertical: 16,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 8,
        },
        alertButtonText: {
          color: colors.white,
          fontSize: 18,
          fontWeight: "bold",
        },
      }),
    [themedColors],
  );
};
