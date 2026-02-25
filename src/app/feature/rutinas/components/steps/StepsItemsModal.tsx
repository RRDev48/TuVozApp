import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StepItemModalProps } from "../../models/component.props";

const styles = StyleSheet.create({
  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  stepNumber: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 5,
    color: colors.blue,
  },

  stepsInput: {
    fontSize: 18,
    fontWeight: "bold",
    borderWidth: 1,
    color: colors.blue,
    borderRadius: 10,
    padding: 10,
    flex: 1,
    borderColor: colors.darkGray,
    marginVertical: 10,
    width: "90%",
  },

  removeStepButton: {
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});

export const StepItem = ({
  id,
  text,
  index,
  stepsCount,
  onTextChange,
  onRemove,
}: StepItemModalProps) => {
  return (
    <View style={styles.stepsContainer}>
      {/* Número ordinal del paso (solo visual). */}
      <Text style={styles.stepNumber}>{id}.</Text>

      <TextInput
        placeholder={"Paso"}
        placeholderTextColor="black"
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
