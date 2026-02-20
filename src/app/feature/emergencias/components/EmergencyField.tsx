import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { EmergencyFieldProps } from "../models/component.props";

export const EmergencyField = ({
  icon,
  label,
  value,
  onPress,
  showArrow = true,
}: EmergencyFieldProps) => {
  const { getThemedColors, transformText } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: themedColors.cardBackground,
      padding: 16,
      borderRadius: 15,
      marginBottom: 20,
    },
    iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: themedColors.transparent,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 20,
    },
    textContainer: {
      flex: 1,
    },
    label: {
      color: themedColors.secondary,
      fontWeight: "bold",
      fontSize: 18,
      marginBottom: 4,
    },
    value: {
      color: themedColors.secondary,
      fontSize: 14,
      opacity: 0.8,
    },
    arrow: {
      color: themedColors.secondary,
      fontSize: 30,
      fontWeight: "bold",
    },
  });

  const content = (
    <View style={styles.container}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{transformText(label)}</Text>
        <Text style={styles.value}>{value || "Ninguna"}</Text>
      </View>
      {showArrow && <Text style={styles.arrow}>›</Text>}
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
  }

  return content;
};
