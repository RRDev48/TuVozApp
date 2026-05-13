import ZenithXAnimado from "@/src/app/assets/icon/ZenithXAnimado.svg";
import SkeletonCard from "@/src/app/components/common/SkeletonCard";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import BackButton from "@/src/app/feature/common/BackButton";
import CachedPictogramImage from "@/src/app/feature/common/CachedPictogramImage";
import CustomText from "@/src/app/feature/common/CustomText";
import ScreenTitle from "@/src/app/feature/common/ScreenTitle";
import { useFavoritePictograms } from "@/src/app/feature/expresate/hooks/useFavoritePictograms";
import { usePaginatedCategories } from "@/src/app/feature/expresate/hooks/usePaginatedCategories";
import { usePaginatedPictograms } from "@/src/app/feature/expresate/hooks/usePaginatedPictograms";
import { usePictogramCategories } from "@/src/app/feature/expresate/hooks/usePictogramCategories";
import { usePictogramPreloader } from "@/src/app/feature/expresate/hooks/usePictogramPreloader";
import { usePictogramUsage } from "@/src/app/feature/expresate/hooks/usePictogramUsage";
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
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import MenuItem from "../../common/menu/MenuItem";
import { Pictogram, PictogramCategory } from "../models/pictogram.types";
import { pictogramCacheService } from "../services/pictogramCache.Service";
import { speakWithQueue } from "../services/speechQueue.Service";

const { width } = Dimensions.get("window");
const PAGE_WIDTH = width - 40;

const ExpresateScreen = () => {
  const { t } = useLanguageRefresh();
  const { transformText, getThemedColors, temaOscuro } = usePersonalization();
  const themedColors = getThemedColors();
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();
  const { categories, isLoading, error } = usePictogramCategories();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { favoriteIds, favoritePictograms, toggleFavorite } = useFavoritePictograms();
  const { preloadInBackground } = usePictogramPreloader();
  const { trackUsage, recentPictograms, topPictograms } = usePictogramUsage();
  const [activeTab, setActiveTab] = useState<'categories' | 'favorites' | 'top' | 'recent'>('categories');

  useEffect(() => {
    if (categories.length > 0) {
      const allIds: string[] = [];
      categories.slice(0, 6).forEach((cat) => {
        const baseIds = ["3436", "3437", "162", "2530", "1043", "2088", "1053", "1580", "2522", "1379"];
        allIds.push(...baseIds.slice(0, 4));
      });
      preloadInBackground(allIds);
    }
  }, [categories, preloadInBackground]);

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

  const activeData = useMemo(() => {
    if (isSearchMode) return searchResults;
    switch (activeTab) {
      case 'favorites': return favoritePictograms;
      case 'top': return topPictograms;
      case 'recent': return recentPictograms;
      default: return [];
    }
  }, [activeTab, isSearchMode, searchResults, favoritePictograms, topPictograms, recentPictograms]);

  const { paginatedPictograms: paginatedItems, totalPages: totalPictoPages } =
    usePaginatedPictograms({
      pictograms: activeData,
      itemsPerPage: pictogramItemsPerPage,
    });

  const totalPages = isSearchMode || activeTab !== 'categories'
    ? totalPictoPages
    : totalCategoryPages;

  useEffect(() => {
    setCurrentPage(0);
    flatListRef.current?.scrollToIndex({ index: 0, animated: false });
  }, [isSearchMode]);

  useEffect(() => {
    setCurrentPage(0);
    flatListRef.current?.scrollToIndex({ index: 0, animated: false });
  }, [isSearchMode, activeTab]);

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

  useEffect(() => {
    pictogramCacheService.initialize();
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
        categorySlug,
      });
    },
    [navigation],
  );

  const handlePictogramPress = useCallback((pictogram: Pictogram) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    void trackUsage(pictogram);
    void speakWithQueue(pictogram.keyword, pictogram.language);
  }, [trackUsage]);

  const normalizeCategoryName = useCallback((name: string, slug?: string) => {
    if (slug) {
      const translationKey = `category_${slug}`;
      const translated = t(translationKey);
      if (translated !== translationKey) {
        return translated;
      }
    }
    return name;
  }, [t]);

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
        tabsScroll: {
          maxHeight: 50,
          marginBottom: 10,
        },
        tabsContainer: {
          flexDirection: 'row',
          paddingHorizontal: 20,
          gap: 10,
          alignItems: 'center',
        },
        tab: {
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: 'transparent',
        },
        activeTab: {
          backgroundColor: themedColors.primary,
        },
        inactiveTab: {
          backgroundColor: '#9E9E9E25',
        },
        tabText: {
          fontSize: 14,
          fontWeight: '600',
        },
        activeTabText: {
          color: themedColors.secondary,
        },
      }),
    [themedColors, temaOscuro],
  );

  const renderCategoryItem = useCallback(
    (item: PictogramCategory) => (
      <MenuItem
        name={normalizeCategoryName(item.name, item.slug)}
        route={item.slug}
        image={item.image_url ? { uri: item.image_url } : require("@/src/app/assets/image/adip_icon.png")}
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
      const isFavorite = favoriteIds.has(item.id.toString());

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
                placeholder={require("@/src/app/assets/image/adip_icon.png")}
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

        const isPictogram = (item as any).keyword !== undefined;

        return isPictogram
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
        key={`carousel-${activeTab}-${isSearchMode}`}
        ref={flatListRef}
        data={activeTab === 'categories' && !isSearchMode ? paginatedCategories : paginatedItems}
        renderItem={({ item }) => renderPage(item)}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
    ),
    [isSearchMode, paginatedCategories, paginatedItems, activeTab, renderPage],
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
              error || t('somethingWentWrong'),
            )}
          </CustomText>
        </View>
      </View>
    ),
    [error, errorScreenStyles, handleGoBack, transformText],
  );

  const renderSkeletonGrid = () => (
    <View style={containerStyles.carouselContainer}>
      <View style={containerStyles.pageContainer}>
        <View style={containerStyles.gridRow}>
          <SkeletonCard />
          <SkeletonCard />
        </View>
        <View style={containerStyles.gridRow}>
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={containerStyles.container}>
        <BackButton onPress={handleGoBack} />
        <ScreenTitle text={transformText(t("expressWithCards"))} />
        {renderSkeletonGrid()}
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
      <ScreenTitle text={transformText(t("expressWithCards"))} />

      {!isSearchMode && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={containerStyles.tabsScroll}
          contentContainerStyle={containerStyles.tabsContainer}
        >
          <TouchableOpacity
            onPress={() => setActiveTab('categories')}
            style={[
              containerStyles.tab,
              activeTab === 'categories' ? containerStyles.activeTab : containerStyles.inactiveTab
            ]}
          >
            <CustomText style={[
              containerStyles.tabText,
              activeTab === 'categories' ? containerStyles.activeTabText : { color: themedColors.primary }
            ]}>
              {t('categoriesTab')}
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('favorites')}
            style={[
              containerStyles.tab,
              activeTab === 'favorites' ? containerStyles.activeTab : containerStyles.inactiveTab
            ]}
          >
            <CustomText style={[
              containerStyles.tabText,
              activeTab === 'favorites' ? containerStyles.activeTabText : { color: themedColors.primary }
            ]}>
              {t('favoritesTab')}
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('top')}
            style={[
              containerStyles.tab,
              activeTab === 'top' ? containerStyles.activeTab : containerStyles.inactiveTab
            ]}
          >
            <CustomText style={[
              containerStyles.tabText,
              activeTab === 'top' ? containerStyles.activeTabText : { color: themedColors.primary }
            ]}>
              {t('topUsedTab')}
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('recent')}
            style={[
              containerStyles.tab,
              activeTab === 'recent' ? containerStyles.activeTab : containerStyles.inactiveTab
            ]}
          >
            <CustomText style={[
              containerStyles.tabText,
              activeTab === 'recent' ? containerStyles.activeTabText : { color: themedColors.primary }
            ]}>
              {t('recentsTab')}
            </CustomText>
          </TouchableOpacity>
        </ScrollView>
      )}

      {isSearchMode && isSearching ? (
        renderSkeletonGrid()
      ) : isSearchMode && (searchError || searchResults.length === 0) ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomText>
            {transformText(searchError || t("noPictogramsFound"))}
          </CustomText>
        </View>
      ) : (
        <>
          <View style={containerStyles.carouselContainer}>
            {activeData.length === 0 && activeTab !== 'categories' ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Ionicons
                  name={activeTab === 'favorites' ? 'heart-outline' : 'time-outline'}
                  size={60}
                  color={themedColors.secondary + '40'}
                />
                <CustomText style={{ textAlign: 'center', marginTop: 10, color: themedColors.secondary }}>
                  {activeTab === 'favorites' ? t('noFavoritesMessage') : t('noUsageMessage')}
                </CustomText>
              </View>
            ) : (
              renderCarousel()
            )}
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
            placeholder={transformText(t('searchPictogram'))}
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
