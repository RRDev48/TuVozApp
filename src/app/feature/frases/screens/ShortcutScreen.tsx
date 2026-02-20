import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import CustomText from "@/src/app/feature/common/CustomText";
import { StyleSheet, View } from "react-native";

const ShortcutScreen = () => {
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

export default ShortcutScreen;
