import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { StyleSheet, TouchableOpacity } from "react-native";

interface AddButtonProps {
  onPress: () => void;
  text: string;
}

const AddButton = ({ onPress, text }: AddButtonProps) => {
  const { temaOscuro } = usePersonalization();
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = StyleSheet.create({
    addButton: {
      width: "100%",
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: temaOscuro ? colors.white : themedColors.primary,
      borderRadius: 16,
      paddingVertical: 18,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    addButtonText: {
      fontSize: 18,
      fontWeight: "600",
      color: temaOscuro ? colors.white : themedColors.primary,
    },
  });

  return (
    <TouchableOpacity style={styles.addButton} onPress={onPress}>
      <CustomText style={styles.addButtonText}>+ {text}</CustomText>
    </TouchableOpacity>
  );
};

export default AddButton;
