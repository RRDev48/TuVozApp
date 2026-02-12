import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { BackButtonProps } from "./(models)/component.types";

const BackButton = ({ onPress }: BackButtonProps) => {
  const { getThemedColors, transformText } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = StyleSheet.create({
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 40,
      paddingBottom: 10,
    },
    backText: {
      fontSize: 16,
      fontWeight: "bold",
      color: themedColors.text,
      marginLeft: 4,
    },
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.backButton}>
      <Ionicons name="chevron-back" size={24} color={themedColors.text} />
      <CustomText style={styles.backText}>{transformText("Atrás")}</CustomText>
    </TouchableOpacity>
  );
};

export default BackButton;
