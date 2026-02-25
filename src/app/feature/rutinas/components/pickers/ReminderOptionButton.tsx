import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import CustomText from "../../../common/CustomText";
import { ReminderOptionButtonProps } from "../../models/component.props";

const styles = StyleSheet.create({
  optionButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
  },

  optionText: {
    color: colors.blue,
    fontWeight: "bold",
  },

  selectedOption: {
    backgroundColor: colors.blue,
  },

  selectedOptionText: {
    color: "white",
  },
});

export const ReminderOptionButton = ({
  label,
  value,
  isSelected,
  onPress,
}: ReminderOptionButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.optionButton, isSelected && styles.selectedOption]}
      onPress={() => onPress(value)}
    >
      <CustomText
        style={[
          styles.optionText,
          isSelected ? styles.selectedOptionText : null,
        ]}
      >
        {label}
      </CustomText>
    </TouchableOpacity>
  );
};
