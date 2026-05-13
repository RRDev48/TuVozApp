import { useExpresate } from "@/src/app/contexts/ExpresateContext";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo, useState, useEffect } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../../common/BackButton";
import CachedPictogramImage from "../../common/CachedPictogramImage";
import CustomText from "../../common/CustomText";
import ScreenTitle from "../../common/ScreenTitle";
import { arasaacService } from "../services/arasaac.Service";
import RootStackParamsList from "@/src/app/navigation/navigation.types";

type EditCategoryRouteProp = RouteProp<RootStackParamsList, "EditCategory">;

const EditCategoryScreen = () => {
  const { t } = useLanguageRefresh();
  const navigation = useNavigation();
  const route = useRoute<EditCategoryRouteProp>();
  const category = route.params?.category;

  const { getThemedColors, transformText, temaOscuro } = usePersonalization();
  const themedColors = getThemedColors();
  const { 
    updateCategoryLocally, 
    addCustomCategory,
    getPictogramsByCategory,
    deleteCustomPictogram,
    togglePictogramVisibility,
    hiddenPictogramIds
  } = useExpresate();

  const [newName, setNewName] = useState(category?.name || "");
  const [newIconUrl, setNewIconUrl] = useState(category?.image_url || "");
  const [iconSearchQuery, setIconSearchQuery] = useState("");
  const [categoryPictograms, setCategoryPictograms] = useState<any[]>([]);
  const [loadingPictograms, setLoadingPictograms] = useState(false);
  const [iconResults, setIconResults] = useState<any[]>([]);
  const [isSearchingIcon, setIsSearchingIcon] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const styles = useMemo(() => createStyles(themedColors, temaOscuro), [themedColors, temaOscuro]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (category?.id) {
      loadPictograms();
    }
  }, [category?.id]);

  const loadPictograms = async () => {
    if (!category?.id) return;
    setLoadingPictograms(true);
    try {
      const { data } = await getPictogramsByCategory(category.id, true);
      setCategoryPictograms(data || []);
    } finally {
      setLoadingPictograms(false);
    }
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Se requieren permisos para acceder a la galería");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0].uri) {
      setNewIconUrl(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!newName.trim()) return;
    if (category?.id) {
      await updateCategoryLocally(category.id, newName, newIconUrl);
    } else {
      await addCustomCategory(newName, newIconUrl);
    }
    navigation.goBack();
  };

  const searchIcon = async () => {
    if (!iconSearchQuery.trim()) return;
    setIsSearchingIcon(true);
    const data = await arasaacService.searchPictograms(iconSearchQuery);
    setIconResults(data || []);
    setIsSearchingIcon(false);
  };

  const handleDeletePictogram = async (pictogramId: string) => {
    if (!category?.id) return;
    await deleteCustomPictogram(pictogramId, category.id);
    setCategoryPictograms(prev => prev.filter(p => p.id.toString() !== pictogramId.toString()));
  };

  const handleToggleVisibility = async (pictogramId: string) => {
    if (!category?.id) return;
    await togglePictogramVisibility(pictogramId, category.id);
  };

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />
      <ScreenTitle 
        text={transformText(category ? t("editCategoryTitle") || "Editar Categoría" : t("newCategoryTitle") || "Nueva Categoría")} 
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.content} 
          contentContainerStyle={{ paddingBottom: 40 }}
          scrollEnabled={categoryPictograms.length > 0 || isKeyboardVisible}
          bounces={categoryPictograms.length > 0}
        >
          <View style={styles.iconPreviewContainer}>
            <Image
              source={newIconUrl ? { uri: newIconUrl } : require("../../../assets/image/adip_icon.png")}
              style={styles.iconPreview}
            />
            <TouchableOpacity 
              style={[styles.saveButton, { marginTop: 15, paddingVertical: 10, backgroundColor: themedColors.primary }]}
              onPress={handlePickImage}
            >
              <CustomText style={{ color: colors.white, fontWeight: 'bold' }}>{t("pickFromGallery") || "Cargar Foto"}</CustomText>
            </TouchableOpacity>
            <CustomText style={{ marginTop: 10, color: themedColors.text, opacity: 0.6 }}>{t("orSearchIcon") || "O busca un icono de ARASAAC abajo"}</CustomText>
          </View>

          <CustomText style={styles.inputLabel}>{t("categoryNameLabel") || "Nombre de la categoría"}</CustomText>
          <TextInput
            style={styles.input}
            value={newName}
            onChangeText={setNewName}
            placeholder={t("categoryNamePlaceholder") || "Ej: Comida, Juegos..."}
            placeholderTextColor={themedColors.background + "80"}
          />

          <CustomText style={styles.inputLabel}>{t("searchArasaacIcon") || "Buscar nuevo icono (ARASAAC)"}</CustomText>
          <View style={styles.searchIconWrapper}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              value={iconSearchQuery}
              onChangeText={setIconSearchQuery}
              placeholder={t("searchIconPlaceholder") || "Buscar icono..."}
              placeholderTextColor={themedColors.background + "80"}
              onSubmitEditing={searchIcon}
            />
            <TouchableOpacity
              style={[styles.searchButton]}
              onPress={searchIcon}
            >
              <Ionicons name="search" size={24} color={themedColors.background} />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal style={styles.iconResultsList} showsHorizontalScrollIndicator={false}>
            {iconResults.map((res) => (
              <TouchableOpacity key={res.id} onPress={() => setNewIconUrl(res.image_url)}>
                <Image source={{ uri: res.image_url }} style={styles.miniIconResult} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <CustomText style={styles.saveButtonText}>{t("saveChanges") || "Guardar Cambios"}</CustomText>
          </TouchableOpacity>

          {category?.id && (
            <View style={styles.pictogramsSection}>
              <CustomText style={[styles.inputLabel, { marginBottom: 15 }]}>{t("categoryPictograms") || "Pictogramas en esta categoría"}</CustomText>
              {loadingPictograms ? (
                <CustomText style={{ color: themedColors.text }}>{t("loading") || "Cargando..."}</CustomText>
              ) : categoryPictograms.length === 0 ? (
                <CustomText style={{ color: themedColors.text, opacity: 0.6 }}>{t("noPictogramsInCategory") || "No hay pictogramas en esta categoría."}</CustomText>
              ) : (
                categoryPictograms.map((pic) => {
                  const isHidden = hiddenPictogramIds.has(pic.id.toString());
                  return (
                    <View key={pic.id} style={[styles.pictogramItem, isHidden && { opacity: 0.5 }]}>
                      {pic.arasaac_id ? (
                        <CachedPictogramImage 
                          arasaacId={pic.arasaac_id} 
                          style={styles.pictogramThumb} 
                        />
                      ) : (
                        <Image source={{ uri: pic.image_url }} style={styles.pictogramThumb} />
                      )}
                      <View style={styles.pictogramInfo}>
                        <CustomText style={{ color: themedColors.secondary, fontWeight: 'bold' }}>
                          {transformText(
                            pic.keyword.charAt(0).toUpperCase() + pic.keyword.slice(1)
                          )}
                        </CustomText>
                        {isHidden && <CustomText style={{ color: colors.red, fontSize: 12 }}>{t("hiddenLabel") || "Oculto"}</CustomText>}
                      </View>
                      <View style={styles.pictogramActions}>
                        <TouchableOpacity 
                          style={styles.actionButton} 
                          onPress={() => handleToggleVisibility(pic.id)}
                        >
                          <Ionicons 
                            name={isHidden ? "eye" : "eye-off"} 
                            size={20} 
                            color={themedColors.text} 
                          />
                        </TouchableOpacity>
                        {pic.is_custom && (
                          <TouchableOpacity 
                            style={[styles.actionButton, { backgroundColor: colors.red + '20' }]} 
                            onPress={() => handleDeletePictogram(pic.id)}
                          >
                            <Ionicons name="trash" size={20} color={colors.red} />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const createStyles = (themedColors: any, temaOscuro: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themedColors.background,
    },
    content: {
      padding: 20,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: themedColors.text,
    },
    input: {
      backgroundColor: themedColors.cardBackground,
      borderRadius: 12,
      padding: 15,
      color: themedColors.background,
      fontSize: 16,
      marginBottom: 20,
    },
    iconPreviewContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    iconPreview: {
      width: 100,
      height: 100,
      borderRadius: 20,
      backgroundColor: themedColors.cardBackground,
    },
    searchIconWrapper: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 15,
    },
    searchButton: {
      width: 50,
      height: 50,
      borderRadius: 12,
      backgroundColor: themedColors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconResultsList: {
      height: 120,
      marginBottom: 20,
    },
    miniIconResult: {
      width: 70,
      height: 70,
      marginRight: 10,
      borderRadius: 10,
      backgroundColor: themedColors.cardBackground,
      padding: 5,
    },
    pictogramsSection: {
      marginTop: 30,
      borderTopWidth: 1,
      borderTopColor: themedColors.text + "20",
      paddingTop: 20,
    },
    pictogramItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: themedColors.cardBackground,
      borderRadius: 15,
      padding: 10,
      marginBottom: 10,
      gap: 15,
    },
    pictogramThumb: {
      width: 50,
      height: 50,
      borderRadius: 10,
    },
    pictogramInfo: {
      flex: 1,
    },
    pictogramActions: {
      flexDirection: 'row',
      gap: 10,
    },
    actionButton: {
      padding: 8,
      borderRadius: 10,
      backgroundColor: themedColors.background,
    },
    saveButton: {
      backgroundColor: colors.green,
      padding: 18,
      borderRadius: 15,
      alignItems: 'center',
      marginTop: 20,
    },
    saveButtonText: {
      color: colors.white,
      fontSize: 18,
      fontWeight: 'bold',
    },
    buttonContainer: {
      width: 130,
      height: 130,
      backgroundColor: themedColors.cardBackground,
      borderRadius: 30,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: temaOscuro ? 0.35 : 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    textCard: {
      fontSize: 18,
      fontWeight: "bold",
      lineHeight: 22,
      textAlign: "center",
      color: themedColors.text,
      marginTop: 5,
      minHeight: 44,
    },
    icon: {
      width: 70,
      height: 70,
    },
  });

export default EditCategoryScreen;
