import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import React from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCategories } from "../../hooks/useCategories";
import { CategoryModalProps } from "../../models/component.props";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.transparent,
    justifyContent: "center",
    alignItems: "center",
  },

  sharedModalContainer: {
    width: "80%",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },

  categoryTitle: {
    paddingTop: 40,
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    color: colors.blue,
  },

  optionsContainer: {
    width: "100%",
    marginBottom: 20,
  },

  optionButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
  },

  optionText: {
    color: colors.blue,
    fontWeight: "bold",
  },

  closeXButton: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 20,
    padding: 5,
  },

  closeXButtonText: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.red,
  },
});

export const CategorPickeryModal = ({
  visible,
  onClose,
  onCategorySelect,
}: CategoryModalProps) => {
  const { categories, loading } = useCategories(visible);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.sharedModalContainer, { height: "60%" }]}>
          {/* Botón de cierre (X) en la esquina superior derecha del modal */}
          <TouchableOpacity onPress={onClose} style={styles.closeXButton}>
            <Text style={styles.closeXButtonText}>×</Text>
          </TouchableOpacity>

          <Text style={styles.categoryTitle}>{"Selecciona una categoría"}</Text>

          {loading ? (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              {"Cargando..."}
            </Text>
          ) : (
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              style={styles.optionsContainer}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => {
                    onCategorySelect(item.id, item.nombre);
                    onClose();
                  }}
                >
                  <Text style={styles.optionText}>{item.nombre}</Text>
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
