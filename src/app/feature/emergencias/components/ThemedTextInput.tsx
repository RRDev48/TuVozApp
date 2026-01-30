import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

interface ThemedTextInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
  numberOfLines?: number;
  minHeight?: number;
}

const ThemedTextInput = ({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines,
  minHeight,
  ...rest
}: ThemedTextInputProps) => {
  const { temaOscuro, getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = StyleSheet.create({
    input: {
      backgroundColor: temaOscuro ? colors.white : themedColors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 20,
      fontSize: 16,
      fontWeight: "bold",
      color: temaOscuro ? colors.blue : colors.white,
      minHeight: minHeight || (multiline ? 100 : undefined),
      textAlignVertical: multiline ? "top" : "center",
    },
  });

  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={temaOscuro ? colors.blue : colors.white}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      numberOfLines={numberOfLines}
      {...rest}
    />
  );
};

export default ThemedTextInput;
