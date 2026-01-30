import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { StyleSheet, View } from "react-native";

interface ScreenTitleProps {
  text: string;
}

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
      fontSize: 30,
      fontWeight: "bold",
      textAlign: "center",
      color: themedColors.primary,
    },
  });

  return (
    <View style={styles.titleContainer}>
      <CustomText style={styles.headerTitle}>{text}</CustomText>
    </View>
  );
};

export default ScreenTitle;
