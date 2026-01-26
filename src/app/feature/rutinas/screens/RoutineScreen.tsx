import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { StyleSheet, View } from "react-native";

const RoutineScreen = () => {
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themedColors.background,
      padding: 20,
    },
    text: {
      color: themedColors.text,
    },
  });

  return (
    <View style={styles.container}>
      <CustomText style={styles.text}>Texto por defecto</CustomText>
    </View>
  );
};

export default RoutineScreen;
