import i18n from "@/src/app/i18n";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SaveButtonProps } from "../models/component.props";

const SaveButton = ({ onPress, text, bottom = 40 }: SaveButtonProps) => {
  const { getThemedColors } = usePersonalization();

  const styles = StyleSheet.create({
    saveButton: {
      position: "absolute",
      bottom: bottom,
      left: 20,
      right: 20,
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
  });

  return (
    <TouchableOpacity style={styles.saveButton} onPress={onPress}>
      <Text style={styles.saveButtonText}>
        {text || i18n.t('saveChanges')}
      </Text>
    </TouchableOpacity>
  );
};

export default SaveButton;
