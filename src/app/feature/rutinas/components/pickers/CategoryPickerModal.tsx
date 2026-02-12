// React
import React from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

// Componentes

// Constantes

// Modelos
import { CategoryModalProps } from "../../(models)/component.props";

// Hooks
import { useCategories } from "../../(hooks)/useCategories";

// Servicios

// Acciones

// Visuales
import { addTaskStyles } from "@/src/app/design-system/styles/tasks-Styles";

/**
 * CategoryPickerModal
 * -------------------
 * Modal que permite al usuario seleccionar una categoría para la tarea.
 *
 * Responsabilidades:
 * - Cargar la lista de categorías disponibles usando `useCategories`.
 * - Mostrar un indicador de carga mientras se obtienen las categorías.
 * - Renderizar la lista de categorías en forma de botones.
 * - Notificar al componente padre qué categoría fue seleccionada y cerrar el modal.
 */
export const CategorPickeryModal = ({
  visible,
  onClose,
  onCategorySelect,
}: CategoryModalProps) => {
  // const { formatText } = usePersonalization();

  // Hook que obtiene desde el backend/listado local las categorías disponibles
  // para las tareas. Se dispara en función de la visibilidad del modal.
  const { categories, loading } = useCategories(visible);

  return (
    // Modal nativo de React Native que muestra el contenido encima de la pantalla actual.
    <Modal visible={visible} transparent animationType="slide">
      <View style={addTaskStyles.overlay}>
        <View style={[addTaskStyles.sharedModalContainer, { height: "60%" }]}>
          {/* Botón de cierre (X) en la esquina superior derecha del modal */}
          <TouchableOpacity
            onPress={onClose}
            style={addTaskStyles.closeXButton}
          >
            <Text style={addTaskStyles.closeXButtonText}>×</Text>
          </TouchableOpacity>

          <Text style={addTaskStyles.categoryTitle}>
            {"Selecciona una categoría"}
          </Text>

          {loading ? (
            // Mensaje sencillo mientras se cargan las categorías.
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              {"Cargando..."}
            </Text>
          ) : (
            // Lista de categorías disponibles para seleccionar.
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              style={addTaskStyles.optionsContainer}
              renderItem={({ item }) => (
                // Cada categoría se muestra como un botón; al pulsar:
                // - se notifica al padre con id y nombre de la categoría.
                // - se cierra el modal.
                <TouchableOpacity
                  style={addTaskStyles.optionButton}
                  onPress={() => {
                    onCategorySelect(item.id, item.nombre);
                    onClose();
                  }}
                >
                  <Text style={addTaskStyles.optionText}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CategorPickeryModal;
