import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { StyleSheet, TextInput } from "react-native";
import { ThemedTextInputProps } from "../models/component.props";

const ThemedTextInput = ({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines,
  minHeight,
  ...rest
}: ThemedTextInputProps) => {
  const { getThemedColors } = usePersonalization();
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
