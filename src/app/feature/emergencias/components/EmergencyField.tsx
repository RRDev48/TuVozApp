import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface EmergencyFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onPress?: () => void;
  showArrow?: boolean;
}

export const EmergencyField: React.FC<EmergencyFieldProps> = ({
  icon,
  label,
  value,
  onPress,
  showArrow = true,
}) => {
  const { getThemedColors, transformText } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: themedColors.cardBackground,
      padding: 16,
      borderRadius: 15,
      marginBottom: 16,
    },
    iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    textContainer: {
      flex: 1,
    },
    label: {
      color: themedColors.background,
      fontWeight: "700",
      fontSize: 18,
      marginBottom: 2,
    },
    value: {
      color: themedColors.background,
      fontSize: 14,
      opacity: 0.8,
    },
    arrow: {
      color: themedColors.background,
      fontSize: 24,
      marginLeft: 10,
    },
  });

  const content = (
    <View style={styles.container}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.textContainer}>
        <CustomText style={styles.label}>{transformText(label)}</CustomText>
        <CustomText style={styles.value}>{value || "Ninguna"}</CustomText>
      </View>
      {showArrow && <CustomText style={styles.arrow}>›</CustomText>}
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
  }

  return content;
};
