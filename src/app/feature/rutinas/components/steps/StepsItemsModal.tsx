import i18n from "@/src/app/i18n";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import CustomText from "../../../common/CustomText";
import { StepItemModalProps } from "../../models/component.props";

export const StepItem = ({
  id,
  text,
  index,
  stepsCount,
  onTextChange,
  onRemove,
}: StepItemModalProps) => {
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        stepsContainer: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
        },
        stepNumber: {
          fontSize: 20,
          fontWeight: "bold",
          marginRight: 5,
          color: themedColors.primary,
        },
        stepsInput: {
          fontSize: 18,
          fontWeight: "bold",
          borderWidth: 1,
          color: themedColors.primary,
          borderRadius: 10,
          padding: 10,
          flex: 1,
          borderColor: themedColors.primary,
          marginVertical: 10,
          width: "90%",
        },
        removeStepButton: {
          padding: 5,
          alignItems: "center",
          justifyContent: "center",
        },
      }),
    [themedColors],
  );
  return (
    <View style={styles.stepsContainer}>
      {/* Número ordinal del paso (solo visual). */}
      <CustomText style={styles.stepNumber}>{id}.</CustomText>

      <TextInput
        placeholder={i18n.t('stepPlaceholder')}
        placeholderTextColor={themedColors.primary}
        style={styles.stepsInput}
        value={text}
        onChangeText={(newText) => onTextChange(newText, index)}
      />

      {/* Botón para eliminar el paso actual. Solo se muestra si hay más de un paso
          para evitar dejar la tarea sin ningún paso. */}
      {stepsCount > 1 && (
        <TouchableOpacity
          onPress={() => onRemove(index)}
          style={styles.removeStepButton}
        >
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default StepItem;
