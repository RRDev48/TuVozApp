import ZenithXAnimado from "@/src/app/assets/icon/ZenithXAnimado.svg";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import BackButton from "@/src/app/feature/common/BackButton";
import CachedPictogramImage from "@/src/app/feature/common/CachedPictogramImage";
import CustomText from "@/src/app/feature/common/CustomText";
import ScreenTitle from "@/src/app/feature/common/ScreenTitle";
import { useFavoritePictograms } from "@/src/app/feature/expresate/hooks/useFavoritePictograms";
import { usePaginatedCategories } from "@/src/app/feature/expresate/hooks/usePaginatedCategories";
import { usePaginatedPictograms } from "@/src/app/feature/expresate/hooks/usePaginatedPictograms";
import { usePictogramCategories } from "@/src/app/feature/expresate/hooks/usePictogramCategories";
import { useSearchPictograms } from "@/src/app/feature/expresate/hooks/useSearchPictograms";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Haptics from "expo-haptics";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import MenuItem from "../../common/menu/MenuItem";
import { Pictogram, PictogramCategory } from "../models/pictogram.types";
import { speakPictogramText } from "../services/speech.Service";

const { width } = Dimensions.get("window");
const PAGE_WIDTH = width - 40;

const ExpresateScreen = () => {
  const { transformText, getThemedColors, temaOscuro } = usePersonalization();
  const themedColors = getThemedColors();
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();
  const { categories, isLoading, error } = usePictogramCategories();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { favoriteIds, toggleFavorite } = useFavoritePictograms();

  const {
    pictograms: searchResults,
    isLoading: isSearching,
    error: searchError,
  } = useSearchPictograms(searchQuery);

  const isKeyboardOpen = keyboardHeight > 0;
  const categoryItemsPerPage = isKeyboardOpen ? 2 : 4;
  const pictogramItemsPerPage = 6;

  const isSearchMode = searchQuery.trim().length > 0;

  const { paginatedCategories, totalPages: totalCategoryPages } =
    usePaginatedCategories({
      categories,
      itemsPerPage: categoryItemsPerPage,
    });

  const { paginatedPictograms, totalPages: totalPictogramPages } =
    usePaginatedPictograms({
      pictograms: searchResults,
      itemsPerPage: pictogramItemsPerPage,
    });

  const totalPages = isSearchMode ? totalPictogramPages : totalCategoryPages;

  useEffect(() => {
    setCurrentPage(0);
    flatListRef.current?.scrollToIndex({ index: 0, animated: false });
  }, [isSearchMode]);

  useEffect(() => {
    setCurrentPage(0);
    flatListRef.current?.scrollToIndex({ index: 0, animated: false });
  }, [isKeyboardOpen]);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      },
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const hasError = !isLoading && (!!error || categories.length === 0);

  const handleMenuItemPress = useCallback(
    (categoryId: string, categorySlug: string, categoryName: string) => {
      navigation.navigate("CategoryPictograms", {
        categoryId,
        categoryName,
      });
    },
    [navigation],
  );

  const handlePictogramPress = useCallback((pictogram: Pictogram) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    void speakPictogramText(pictogram.keyword, pictogram.language);
  }, []);

  const normalizeCategoryName = useCallback((name: string) => {
    return name;
  }, []);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const index = viewableItems[0].index ?? 0;
        setCurrentPage(index);
      }
    },
    [],
  );

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };
  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  const containerStyles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: themedColors.background,
        },
        carouselContainer: {
          flex: 1,
          paddingHorizontal: 20,
          marginBottom: 10,
        },
        paginationContainer: {
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 10,
          gap: 8,
        },
        paginationDot: {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: temaOscuro ? "#FFFFFF" : "#006F9E",
        },
        paginationDotActive: {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: "#03A503",
        },
        pageContainer: {
          width: PAGE_WIDTH,
          paddingHorizontal: 5,
        },
        gridRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 15,
        },
        itemContainer: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginVertical: 10,
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
        cardWrapper: {
          position: "relative",
        },
        heartButton: {
          position: "absolute",
          top: -8,
          right: -8,
          backgroundColor: themedColors.background,
          borderRadius: 12,
          padding: 4,
          zIndex: 1,
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
        image: {
          width: 70,
          height: 70,
          resizeMode: "contain",
        },
        searchContainer: {
          paddingHorizontal: 20,
          paddingVertical: 15,
          backgroundColor: themedColors.background,
          flexDirection: "row",
          alignItems: "center",
        },
        searchInputWrapper: {
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: themedColors.cardBackground,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: themedColors.secondary + "30",
          paddingHorizontal: 15,
        },
        searchIcon: {
          marginRight: 10,
        },
        searchInput: {
          flex: 1,
          paddingVertical: 12,
          fontSize: 16,
          color: themedColors.secondary,
        },
      }),
    [themedColors, temaOscuro],
  );

  const renderCategoryItem = useCallback(
    (item: PictogramCategory) => (
      <MenuItem
        name={normalizeCategoryName(item.name)}
        route={item.slug}
        image={require("@/src/app/assets/icon/Ajustes.png")}
        styles={containerStyles}
        onPress={() => handleMenuItemPress(item.id, item.slug, item.name)}
      />
    ),
    [containerStyles, handleMenuItemPress, normalizeCategoryName],
  );

  const renderPictogramItem = useCallback(
    (item: Pictogram) => {
      const capitalizedKeyword =
        item.keyword.charAt(0).toUpperCase() + item.keyword.slice(1);
      const isFavorite = favoriteIds.has(item.id);

      return (
        <TouchableOpacity
          style={containerStyles.itemContainer}
          onPress={() => handlePictogramPress(item)}
          activeOpacity={0.7}
        >
          <View style={containerStyles.cardWrapper}>
            <View style={containerStyles.buttonContainer}>
              <CachedPictogramImage
                arasaacId={item.arasaac_id}
                style={containerStyles.image}
                placeholder={require("@/src/app/assets/icon/Ajustes.png")}
              />
            </View>
            <TouchableOpacity
              style={containerStyles.heartButton}
              onPress={() => void toggleFavorite(item.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={20}
                color={isFavorite ? "#E53935" : "#9E9E9E"}
              />
            </TouchableOpacity>
          </View>
          <CustomText style={containerStyles.textCard}>
            {transformText(capitalizedKeyword)}
          </CustomText>
        </TouchableOpacity>
      );
    },
    [
      containerStyles,
      handlePictogramPress,
      transformText,
      favoriteIds,
      toggleFavorite,
    ],
  );

  const renderPage = useCallback(
    (page: Array<PictogramCategory | Pictogram>) => {
      const renderGridItem = (item?: PictogramCategory | Pictogram) => {
        if (!item) {
          return <View style={{ flex: 1 }} />;
        }

        return isSearchMode
          ? renderPictogramItem(item as Pictogram)
          : renderCategoryItem(item as PictogramCategory);
      };

      return (
        <View style={containerStyles.pageContainer}>
          <View style={containerStyles.gridRow}>
            {renderGridItem(page[0])}
            {renderGridItem(page[1])}
          </View>
          {!isKeyboardOpen || isSearchMode ? (
            <View style={containerStyles.gridRow}>
              {renderGridItem(page[2])}
              {renderGridItem(page[3])}
            </View>
          ) : null}
          {isSearchMode ? (
            <View style={containerStyles.gridRow}>
              {renderGridItem(page[4])}
              {renderGridItem(page[5])}
            </View>
          ) : null}
        </View>
      );
    },
    [
      isSearchMode,
      isKeyboardOpen,
      renderCategoryItem,
      renderPictogramItem,
      containerStyles.pageContainer,
      containerStyles.gridRow,
    ],
  );

  const renderCarousel = useCallback(
    () => (
      <FlatList
        ref={flatListRef}
        data={isSearchMode ? paginatedPictograms : paginatedCategories}
        renderItem={({ item }) => renderPage(item)}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
    ),
    [isSearchMode, paginatedCategories, paginatedPictograms, renderPage],
  );

  const renderPagination = useCallback(
    () => (
      <View style={containerStyles.paginationContainer}>
        {Array.from({ length: totalPages }).map((_, index) => (
          <View
            key={index}
            style={
              index === currentPage
                ? containerStyles.paginationDotActive
                : containerStyles.paginationDot
            }
          />
        ))}
      </View>
    ),
    [
      totalPages,
      currentPage,
      containerStyles.paginationContainer,
      containerStyles.paginationDot,
      containerStyles.paginationDotActive,
    ],
  );

  const errorScreenStyles = useMemo(
    () =>
      StyleSheet.create({
        errorContainer: {
          flex: 1,
          backgroundColor: themedColors.background,
          paddingTop: 50,
        },
        errorContent: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 30,
          marginTop: -80,
        },
        errorIcon: {
          width: 180,
          height: 180,
        },
        errorText: {
          fontSize: 24,
          fontWeight: "700",
          color: themedColors.text,
          textAlign: "center",
          paddingHorizontal: 20,
        },
      }),
    [themedColors],
  );

  const renderErrorScreen = useCallback(
    () => (
      <View style={errorScreenStyles.errorContainer}>
        <BackButton onPress={handleGoBack} />

        <View style={errorScreenStyles.errorContent}>
          <ZenithXAnimado width={180} height={180} />
          <CustomText style={errorScreenStyles.errorText}>
            {transformText(
              error || "Vaya... Parece que algo salio mal, intente mas tarde",
            )}
          </CustomText>
        </View>
      </View>
    ),
    [error, errorScreenStyles, handleGoBack, transformText],
  );

  if (isLoading) {
    return (
      <View style={containerStyles.container}>
        <BackButton onPress={handleGoBack} />
        <ScreenTitle text={transformText("Expresate con tarjetas")} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomText>{transformText("Cargando categorías...")}</CustomText>
        </View>
      </View>
    );
  }

  if (hasError) {
    return renderErrorScreen();
  }

  return (
    <View
      style={[
        containerStyles.container,
        { paddingBottom: keyboardHeight > 0 ? keyboardHeight - 50 : 0 },
      ]}
    >
      <BackButton onPress={handleGoBack} />
      <ScreenTitle text={transformText("Expresate con tarjetas")} />

      {isSearchMode && isSearching ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomText>{transformText("Buscando pictogramas...")}</CustomText>
        </View>
      ) : isSearchMode && (searchError || searchResults.length === 0) ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomText>
            {transformText(searchError || "No se encontraron pictogramas")}
          </CustomText>
        </View>
      ) : (
        <>
          <View style={containerStyles.carouselContainer}>
            {renderCarousel()}
          </View>

          {totalPages > 1 && renderPagination()}
        </>
      )}

      <View style={containerStyles.searchContainer}>
        <View style={containerStyles.searchInputWrapper}>
          <Ionicons
            name="search"
            size={20}
            color={themedColors.secondary}
            style={containerStyles.searchIcon}
          />
          <TextInput
            style={containerStyles.searchInput}
            placeholder={transformText("Buscar pictograma...")}
            placeholderTextColor={themedColors.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={themedColors.secondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default ExpresateScreen;
