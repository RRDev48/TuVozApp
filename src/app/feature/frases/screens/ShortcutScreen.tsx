import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import BackButton from "@/src/app/feature/common/BackButton";
import CachedPictogramImage from "@/src/app/feature/common/CachedPictogramImage";
import CustomText from "@/src/app/feature/common/CustomText";
import MenuItem from "@/src/app/feature/common/menu/MenuItem";
import ScreenTitle from "@/src/app/feature/common/ScreenTitle";
import { useFavoritePictograms } from "@/src/app/feature/expresate/hooks/useFavoritePictograms";
import { usePaginatedCategories } from "@/src/app/feature/expresate/hooks/usePaginatedCategories";
import { usePaginatedPictograms } from "@/src/app/feature/expresate/hooks/usePaginatedPictograms";
import { usePictogramCategories } from "@/src/app/feature/expresate/hooks/usePictogramCategories";
import { usePictogramsByCategory } from "@/src/app/feature/expresate/hooks/usePictogramsByCategory";
import { useSearchPictograms } from "@/src/app/feature/expresate/hooks/useSearchPictograms";
import {
  Pictogram,
  PictogramCategory,
} from "@/src/app/feature/expresate/models/pictogram.types";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import { useFrasesPhrase } from "../hooks/useFrasesPhrase";
import i18n from "@/src/app/i18n";

const { width } = Dimensions.get("window");
const PAGE_WIDTH = Math.min(width - 80, 320);
const MAX_VISIBLE_PAGINATION_DOTS = 7;

const ShortcutScreen = () => {
  const { transformText, getThemedColors, temaOscuro } = usePersonalization();
  const themedColors = getThemedColors();
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();

  const { categories, isLoading } = usePictogramCategories();
  const { favoriteIds } = useFavoritePictograms();
  const { selectedPictograms, addPictogram, removeLastPictogram, speakPhrase } =
    useFrasesPhrase();

  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeCategoryName, setActiveCategoryName] = useState<string>("");
  const flatListRef = useRef<FlatList>(null);

  const isSearchMode = searchQuery.trim().length > 0;
  const isCategoryMode = !isSearchMode && activeCategoryId !== null;

  const { pictograms: searchResults, isLoading: isSearching } =
    useSearchPictograms(searchQuery);

  const { pictograms: categoryPictograms, isLoading: isCategoryLoading } =
    usePictogramsByCategory(activeCategoryId ?? "");

  const { paginatedCategories, totalPages: totalCategoryPages } =
    usePaginatedCategories({ categories, itemsPerPage: 4 });

  const { paginatedPictograms: paginatedSearch, totalPages: totalSearchPages } =
    usePaginatedPictograms({ pictograms: searchResults, itemsPerPage: 4 });

  const {
    paginatedPictograms: paginatedCategory,
    totalPages: totalCategoryPictoPages,
  } = usePaginatedPictograms({
    pictograms: categoryPictograms,
    itemsPerPage: 4,
  });

  const activePaginatedData = isSearchMode
    ? paginatedSearch
    : isCategoryMode
      ? paginatedCategory
      : paginatedCategories;

  const totalPages = isSearchMode
    ? totalSearchPages
    : isCategoryMode
      ? totalCategoryPictoPages
      : totalCategoryPages;

  const paginationIndexes = useMemo(() => {
    if (totalPages <= MAX_VISIBLE_PAGINATION_DOTS) {
      return Array.from({ length: totalPages }, (_, index) => index);
    }

    const halfWindow = Math.floor(MAX_VISIBLE_PAGINATION_DOTS / 2);
    const maxStart = totalPages - MAX_VISIBLE_PAGINATION_DOTS;
    const start = Math.min(Math.max(currentPage - halfWindow, 0), maxStart);

    return Array.from(
      { length: MAX_VISIBLE_PAGINATION_DOTS },
      (_, index) => start + index,
    );
  }, [totalPages, currentPage]);

  const showLeadingOverflowDot =
    paginationIndexes.length > 0 && paginationIndexes[0] > 0;
  const showTrailingOverflowDot =
    paginationIndexes.length > 0 &&
    paginationIndexes[paginationIndexes.length - 1] < totalPages - 1;

  const handleCategoryPress = useCallback((category: PictogramCategory) => {
    setActiveCategoryId(category.id);
    setActiveCategoryName(category.name);
    setCurrentPage(0);
    flatListRef.current?.scrollToIndex({ index: 0, animated: false });
  }, []);

  const handleBackToCategories = useCallback(() => {
    setActiveCategoryId(null);
    setActiveCategoryName("");
    setCurrentPage(0);
    flatListRef.current?.scrollToIndex({ index: 0, animated: false });
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

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: themedColors.background,
        },
        // — Phrase bar —
        phraseBar: {
          borderBottomWidth: 1,
          borderBottomColor: themedColors.secondary + "30",
          paddingHorizontal: 16,
          paddingVertical: 10,
          minHeight: 64,
          justifyContent: "center",
        },
        phraseHintText: {
          color: themedColors.primary,
          fontSize: 13,
          opacity: 0.8,
          marginBottom: 8,
          textAlign: "center",
        },
        phraseScroll: {
          flexGrow: 0,
        },
        phraseScrollContent: {
          alignItems: "center",
          gap: 8,
          paddingRight: 4,
        },
        phraseItem: {
          alignItems: "center",
          gap: 4,
          width: 52,
        },
        phraseSlot: {
          width: 44,
          height: 44,
          borderRadius: 8,
          backgroundColor: themedColors.cardBackground,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: themedColors.secondary + "30",
        },
        phraseSlotEmpty: {
          opacity: 0.65,
        },
        phraseSlotMarker: {
          width: 16,
          height: 2,
          borderRadius: 1,
          backgroundColor: themedColors.secondary,
          opacity: 0.55,
        },
        phraseImage: {
          width: 44,
          height: 44,
          resizeMode: "contain",
          backgroundColor: themedColors.cardBackground,
          borderRadius: 8,
        },
        phraseItemText: {
          fontSize: 11,
          color: themedColors.text,
          textAlign: "center",
          maxWidth: 50,
        },
        // — Pagination dots —
        paginationContainer: {
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 8,
          gap: 8,
        },
        paginationOverflowDot: {
          width: 5,
          height: 5,
          borderRadius: 3,
          backgroundColor: themedColors.secondary,
          opacity: 0.45,
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
        // — Carousel —
        carouselContainer: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },
        carouselList: {
          width: PAGE_WIDTH,
          alignSelf: "center",
        },
        pageContainer: {
          width: PAGE_WIDTH,
          paddingHorizontal: 8,
        },
        gridRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 8,
        },
        itemContainer: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginVertical: 4,
        },
        buttonContainer: {
          width: 108,
          height: 108,
          backgroundColor: themedColors.cardBackground,
          borderRadius: 26,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: temaOscuro ? 0.35 : 0.1,
          shadowRadius: 6,
          elevation: 3,
        },
        cardWrapper: {
          position: "relative",
        },
        heartBadge: {
          position: "absolute",
          top: -6,
          right: -6,
          backgroundColor: themedColors.background,
          borderRadius: 10,
          padding: 3,
          zIndex: 1,
        },
        image: {
          width: 68,
          height: 68,
          resizeMode: "contain",
        },
        icon: {
          width: 70,
          height: 70,
        },
        textCard: {
          fontSize: 14,
          fontWeight: "bold",
          lineHeight: 18,
          textAlign: "center",
          color: themedColors.text,
          marginTop: 4,
          minHeight: 32,
          maxWidth: 110,
        },
        // — Search —
        searchContainer: {
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: themedColors.background,
        },
        searchInputWrapper: {
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
        // — Bottom action bar —
        bottomBar: {
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 12,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: themedColors.secondary + "30",
        },
        actionButtonsRow: {
          width: 180,
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        },
        deleteButton: {
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: themedColors.cardBackground,
          alignItems: "center",
          justifyContent: "center",
        },
        deleteButtonLeft: {
          position: "absolute",
          left: 0,
        },
        playButton: {
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: "#03A503",
          alignItems: "center",
          justifyContent: "center",
        },
        // — Breadcrumb —
        breadcrumb: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 8,
          gap: 6,
        },
        breadcrumbBack: {
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
        },
        breadcrumbText: {
          color: themedColors.primary,
          fontSize: 14,
        },
        breadcrumbSeparator: {
          color: themedColors.secondary,
          fontSize: 14,
        },
        breadcrumbCurrent: {
          color: themedColors.text,
          fontSize: 14,
          fontWeight: "bold" as const,
        },
      }),
    [themedColors, temaOscuro],
  );

  const renderPictogramCard = useCallback(
    (item: Pictogram) => {
      const capitalized =
        item.keyword.charAt(0).toUpperCase() + item.keyword.slice(1);
      const isFavorite = favoriteIds.has(item.id);

      return (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => addPictogram(item)}
          activeOpacity={0.7}
        >
          <View style={styles.cardWrapper}>
            <View style={styles.buttonContainer}>
              <CachedPictogramImage
                arasaacId={item.arasaac_id}
                style={styles.image}
                placeholder={require("@/src/app/assets/icon/Ajustes.png")}
              />
            </View>
            {isFavorite && (
              <View style={styles.heartBadge}>
                <Ionicons name="heart" size={16} color="#E53935" />
              </View>
            )}
          </View>
          <CustomText style={styles.textCard}>
            {transformText(capitalized)}
          </CustomText>
        </TouchableOpacity>
      );
    },
    [styles, favoriteIds, transformText, addPictogram],
  );

  const renderCategoryCard = useCallback(
    (item: PictogramCategory) => (
      <MenuItem
        name={item.name}
        route={item.slug}
        image={require("@/src/app/assets/icon/Ajustes.png")}
        styles={styles}
        onPress={() => handleCategoryPress(item)}
      />
    ),
    [styles, handleCategoryPress],
  );

  const renderPage = useCallback(
    (page: Array<PictogramCategory | Pictogram>) => {
      const showPictograms = isSearchMode || isCategoryMode;

      const renderItem = (item?: PictogramCategory | Pictogram) => {
        if (!item) return <View style={{ flex: 1 }} />;
        return showPictograms
          ? renderPictogramCard(item as Pictogram)
          : renderCategoryCard(item as PictogramCategory);
      };

      const rows = showPictograms
        ? [
            [page[0], page[1]],
            [page[2], page[3]],
          ]
        : [
            [page[0], page[1]],
            [page[2], page[3]],
          ];

      return (
        <View style={styles.pageContainer}>
          {rows.map((row, i) => (
            <View key={i} style={styles.gridRow}>
              {renderItem(row[0])}
              {renderItem(row[1])}
            </View>
          ))}
        </View>
      );
    },
    [
      isSearchMode,
      isCategoryMode,
      renderPictogramCard,
      renderCategoryCard,
      styles,
    ],
  );

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />
      <ScreenTitle text={i18n.t('phrases')} />

      {/* Barra de pictogramas seleccionados */}
      <View style={styles.phraseBar}>
        {selectedPictograms.length === 0 && (
          <CustomText style={styles.phraseHintText}>
            {i18n.t('selectPictogramHint')}
          </CustomText>
        )}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.phraseScroll}
          contentContainerStyle={styles.phraseScrollContent}
        >
          {Array.from({ length: 6 }).map((_, index) => {
            const pictogram = selectedPictograms[index];
            const translatedKeyword = pictogram
              ? transformText(pictogram.keyword)
              : "";
            const capitalizedKeyword = translatedKeyword
              ? translatedKeyword.charAt(0).toUpperCase() +
                translatedKeyword.slice(1)
              : "";

            return (
              <View key={`phrase-slot-${index}`} style={styles.phraseItem}>
                <View
                  style={[
                    styles.phraseSlot,
                    !pictogram && styles.phraseSlotEmpty,
                  ]}
                >
                  {pictogram ? (
                    <CachedPictogramImage
                      arasaacId={pictogram.arasaac_id}
                      style={styles.phraseImage}
                    />
                  ) : (
                    <View style={styles.phraseSlotMarker} />
                  )}
                </View>
                <CustomText style={styles.phraseItemText} numberOfLines={1}>
                  {capitalizedKeyword}
                </CustomText>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Pagination dots */}
      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          {showLeadingOverflowDot && (
            <View style={styles.paginationOverflowDot} />
          )}
          {paginationIndexes.map((pageIndex) => (
            <View
              key={pageIndex}
              style={
                pageIndex === currentPage
                  ? styles.paginationDotActive
                  : styles.paginationDot
              }
            />
          ))}
          {showTrailingOverflowDot && (
            <View style={styles.paginationOverflowDot} />
          )}
        </View>
      )}

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons
            name="search"
            size={20}
            color={themedColors.secondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={i18n.t('filter')}
            placeholderTextColor={themedColors.secondary}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              if (text.trim().length > 0) {
                setActiveCategoryId(null);
                setActiveCategoryName("");
              }
            }}
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

      {/* Carrusel */}
      {/* Breadcrumb — visible only when drilling into a category */}
      {isCategoryMode && (
        <View style={styles.breadcrumb}>
          <TouchableOpacity
            style={styles.breadcrumbBack}
            onPress={handleBackToCategories}
          >
            <Ionicons
              name="chevron-back"
              size={16}
              color={themedColors.primary}
            />
            <CustomText style={styles.breadcrumbText}>
              {i18n.t('categories')}
            </CustomText>
          </TouchableOpacity>
          <CustomText style={styles.breadcrumbSeparator}>/</CustomText>
          <CustomText style={styles.breadcrumbCurrent}>
            {transformText(activeCategoryName)}
          </CustomText>
        </View>
      )}

      {/* Carrusel */}
      <View style={styles.carouselContainer}>
        {isLoading || (isCategoryMode && isCategoryLoading) ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <CustomText>{i18n.t('loadingCategories')}</CustomText>
          </View>
        ) : isSearchMode && isSearching ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <CustomText>{i18n.t('searchingPictograms')}</CustomText>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            style={styles.carouselList}
            data={activePaginatedData}
            renderItem={({ item }) => renderPage(item)}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            viewabilityConfigCallbackPairs={
              viewabilityConfigCallbackPairs.current
            }
          />
        )}
      </View>

      {/* Barra inferior */}
      <View style={styles.bottomBar}>
        <View style={styles.actionButtonsRow}>
          {selectedPictograms.length > 0 && (
            <TouchableOpacity
              style={[styles.deleteButton, styles.deleteButtonLeft]}
              onPress={removeLastPictogram}
              activeOpacity={0.7}
            >
              <Ionicons name="backspace-outline" size={26} color="#E53935" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => void speakPhrase()}
            activeOpacity={0.7}
          >
            <Ionicons name="play" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ShortcutScreen;
