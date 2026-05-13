import { useExpresate } from "@/src/app/contexts/ExpresateContext";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../../common/BackButton";
import CustomText from "../../common/CustomText";
import ScreenTitle from "../../common/ScreenTitle";
import { Pictogram } from "../../expresate/models/pictogram.types";
import { arasaacService } from "../services/arasaac.Service";
import MenuItem from "../../common/menu/MenuItem";

const AddPictogramsScreen = () => {
  const { t } = useLanguageRefresh();
  const navigation = useNavigation();
  const { transformText, getThemedColors, temaOscuro } = usePersonalization();
  const themedColors = getThemedColors();
  const { categories, addCustomPictogram } = useExpresate();

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Pictogram[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPic, setSelectedPic] = useState<Pictogram | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    Keyboard.dismiss();
    setLoading(true);
    const data = await arasaacService.searchPictograms(searchQuery);
    setResults(data);
    setLoading(false);
  };

  const handleSelectPictogram = (pic: Pictogram) => {
    setSelectedPic(pic);
    setShowCategoryModal(true);
  };

  const handleSaveToCategory = async (categoryId: string) => {
    if (selectedPic) {
      await addCustomPictogram(selectedPic, categoryId);
      setShowCategoryModal(false);
      setSelectedPic(null);
      // Opcional: Mostrar mensaje de éxito
    }
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themedColors.background,
    },
    searchContainer: {
      flexDirection: "row",
      padding: 20,
      gap: 10,
    },
    inputWrapper: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: themedColors.cardBackground,
      borderRadius: 15,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: themedColors.primary + "30",
    },
    input: {
      flex: 1,
      height: 50,
      color: themedColors.background,
      fontSize: 16,
    },
    searchButton: {
      backgroundColor: themedColors.primary,
      width: 50,
      height: 50,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
    },
    list: {
      padding: 10,
    },
    columnWrapper: {
      justifyContent: 'flex-start',
      paddingHorizontal: 10,
    },
    itemContainer: {
      flex: 1,
      maxWidth: '50%',
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 10,
    },
    buttonContainer: {
      width: 130,
      height: 130,
      backgroundColor: themedColors.cardBackground,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: temaOscuro ? 0.35 : 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    icon: {
      width: 70,
      height: 70,
    },
    textCard: {
      fontSize: 18,
      fontWeight: 'bold',
      lineHeight: 22,
      textAlign: 'center',
      color: themedColors.text,
      marginTop: 5,
      minHeight: 44,
      width: 130,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      backgroundColor: themedColors.background,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: 20,
      maxHeight: "80%",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
      color: themedColors.text,
    },
    categoryItem: {
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: themedColors.text + "20",
    },
    categoryItemText: {
      fontSize: 18,
      color: themedColors.text,
    },
    emptyText: {
      textAlign: "center",
      marginTop: 50,
      color: themedColors.text,
      opacity: 0.6,
    }
  }), [themedColors]);

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />
      <ScreenTitle text={transformText(t("addPictogramsTitle"))} />

      <View style={styles.searchContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={t("searchPlaceholder")}
            placeholderTextColor={themedColors.background + "80"}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color={themedColors.background} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={themedColors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={results}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <MenuItem
                name={transformText(item.keyword.charAt(0).toUpperCase() + item.keyword.slice(1))}
                route={item.id.toString()}
                image={{ uri: item.image_url }}
                styles={styles}
                onPress={() => handleSelectPictogram(item)}
              />
            </View>
          )}
          ListEmptyComponent={
            <CustomText style={styles.emptyText}>
              {searchQuery ? t("noResultsFound") : t("searchPictogramsHint")}
            </CustomText>
          }
        />
      )}

      {/* Modal para elegir categoría */}
      <Modal visible={showCategoryModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <CustomText style={styles.modalTitle}>{t("saveToCategoryTitle")}</CustomText>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.categoryItem} onPress={() => handleSaveToCategory(item.id)}>
                  <CustomText style={styles.categoryItemText}>{item.name}</CustomText>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={{ marginTop: 20, padding: 15, alignItems: 'center' }}
              onPress={() => setShowCategoryModal(false)}
            >
              <CustomText style={{ color: colors.red, fontWeight: 'bold' }}>{t("cancel")}</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddPictogramsScreen;
