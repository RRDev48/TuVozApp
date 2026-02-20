import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { AddButtonProps } from "../models/component.props";

const AddButton = ({ onPress, text }: AddButtonProps) => {
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = StyleSheet.create({
    addButton: {
      width: "100%",
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: themedColors.primary,
      borderRadius: 16,
      paddingVertical: 18,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    addButtonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: themedColors.primary,
    },
  });

  return (
    <TouchableOpacity style={styles.addButton} onPress={onPress}>
      <Text style={styles.addButtonText}>+ {text}</Text>
    </TouchableOpacity>
  );
};

export default AddButton;
