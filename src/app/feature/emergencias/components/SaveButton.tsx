import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface SaveButtonProps {
  onPress: () => void;
  text?: string;
  bottom?: number;
}

const SaveButton = ({ onPress, text, bottom = 40 }: SaveButtonProps) => {
  const { transformText } = usePersonalization();

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
        {text || transformText("Guardar cambios")}
      </Text>
    </TouchableOpacity>
  );
};

export default SaveButton;
