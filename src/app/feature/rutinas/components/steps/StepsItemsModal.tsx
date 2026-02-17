// React
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Componentes

// Constantes

// Modelos
import { StepItemModalProps } from "../../(models)/component.props";

// Hooks

// Servicios

// Acciones

// Visuales
import { colors } from "@/src/app/design-system/themes/globalColors-theme";

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

/**
 * StepItem
 * --------
 * Representa un paso individual dentro de la lista de pasos
 * de una tarea. Permite editar el texto del paso y, cuando
 * hay más de un paso, eliminarlo.
 *
 * Recibe desde StepItemModalProps:
 * - id: número visible del paso (1, 2, 3, ...).
 * - text: contenido actual del paso.
 * - index: posición del paso en el arreglo de pasos.
 * - stepsCount: cantidad total de pasos de la tarea.
 * - onTextChange: callback para actualizar el texto de un paso.
 * - onRemove: callback para eliminar el paso en `index`.
 */
export const StepItem = ({
  id,
  text,
  index,
  stepsCount,
  onTextChange,
  onRemove,
}: StepItemModalProps) => {
  // const { formatText } = usePersonalization();
  return (
    // Contenedor horizontal de un paso con número, campo de texto y botón de eliminar.
    <View style={styles.stepsContainer}>
      {/* Número ordinal del paso (solo visual). */}
      <Text style={styles.stepNumber}>{id}.</Text>

      <TextInput
        placeholder={"Paso"}
        placeholderTextColor="black"
        style={styles.stepsInput}
        value={text}
        // Notifica al padre el cambio de texto, identificando el paso por su índice.
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
