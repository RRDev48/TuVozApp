import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
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
      backgroundColor: themedColors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 20,
      fontSize: 18,
      fontWeight: "bold",
      color: themedColors.secondary,
      minHeight: minHeight || (multiline ? 100 : undefined),
      textAlignVertical: multiline ? "top" : "center",
    },
  });

  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={themedColors.secondary}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      numberOfLines={numberOfLines}
      {...rest}
    />
  );
};

export default ThemedTextInput;
