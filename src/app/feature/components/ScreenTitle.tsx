import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { StyleSheet, Text, View } from "react-native";
import { ScreenTitleProps } from "./(models)/component.types";

const ScreenTitle = ({ text }: ScreenTitleProps) => {
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = StyleSheet.create({
    titleContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      color: themedColors.primary,
    },
  });

  return (
    <View style={styles.titleContainer}>
      <Text style={styles.headerTitle}>{text}</Text>
    </View>
  );
};

export default ScreenTitle;
