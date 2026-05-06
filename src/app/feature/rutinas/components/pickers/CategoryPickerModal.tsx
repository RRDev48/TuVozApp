import i18n from "@/src/app/i18n";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import React, { useMemo } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import CustomText from "../../../common/CustomText";
import { useCategories } from "../../hooks/useCategories";
import { CategoryModalProps } from "../../models/component.props";

export const CategorPickeryModal = ({
  visible,
  onClose,
  onCategorySelect,
}: CategoryModalProps) => {
  const { categories, loading } = useCategories(visible);
  const { getThemedColors, temaOscuro } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "center",
          alignItems: "center",
        },
        sharedModalContainer: {
          width: "80%",
          backgroundColor: themedColors.background,
          borderRadius: 16,
          padding: 20,
          alignItems: "center",
          borderWidth: 1.5,
          borderColor: themedColors.primary,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: temaOscuro ? 0.45 : 0.18,
          shadowRadius: 10,
          elevation: 8,
        },
        categoryTitle: {
          paddingTop: 40,
          fontSize: 20,
          marginBottom: 10,
          fontWeight: "bold",
          color: themedColors.primary,
        },
        optionsContainer: {
          width: "100%",
          marginBottom: 20,
        },
        optionButton: {
          padding: 10,
          backgroundColor: themedColors.cardBackground,
          borderRadius: 10,
          marginVertical: 5,
          alignItems: "center",
        },
        optionText: {
          color: themedColors.secondary,
          fontWeight: "bold",
        },
        closeXButton: {
          position: "absolute",
          right: 10,
          borderRadius: 20,
          padding: 5,
        },
        closeXButtonText: {
          fontSize: 30,
          fontWeight: "bold",
          color: colors.red,
        },
      }),
    [themedColors, temaOscuro],
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.sharedModalContainer, { height: "60%" }]}>
          {/* Botón de cierre (X) en la esquina superior derecha del modal */}
          <TouchableOpacity onPress={onClose} style={styles.closeXButton}>
            <CustomText style={styles.closeXButtonText}>×</CustomText>
          </TouchableOpacity>

          <CustomText style={styles.categoryTitle}>
            {i18n.t('selectCategory')}
          </CustomText>

          {loading ? (
            <CustomText style={{ textAlign: "center", marginTop: 20 }}>
              {i18n.t('loading')}
            </CustomText>
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
                  <CustomText style={styles.optionText}>
                    {item.nombre}
                  </CustomText>
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
