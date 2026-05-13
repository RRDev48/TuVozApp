import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import BackButton from "@/src/app/feature/common/BackButton";
import CachedPictogramImage from "@/src/app/feature/common/CachedPictogramImage";
import CustomText from "@/src/app/feature/common/CustomText";
import ScreenTitle from "@/src/app/feature/common/ScreenTitle";
import { useFavoritePictograms } from "@/src/app/feature/expresate/hooks/useFavoritePictograms";
import { usePaginatedPictograms } from "@/src/app/feature/expresate/hooks/usePaginatedPictograms";
import { usePictogramsByCategory } from "@/src/app/feature/expresate/hooks/usePictogramsByCategory";
import { usePictogramUsage } from "@/src/app/feature/expresate/hooks/usePictogramUsage";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
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
  StyleSheet,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import { Pictogram } from "../models/pictogram.types";
import { speakPictogramText } from "../services/speech.Service";
import SkeletonCard from "@/src/app/components/common/SkeletonCard";

const { width } = Dimensions.get("window");
const PAGE_WIDTH = width - 40;

type CategoryPictogramsScreenRouteProp = RouteProp<
  RootStackParamsList,
  "CategoryPictograms"
>;

const CategoryPictogramsScreen = () => {
  const { t } = useLanguageRefresh();
  const { transformText, getThemedColors, temaOscuro } = usePersonalization();
  const themedColors = getThemedColors();
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();
  const route = useRoute<CategoryPictogramsScreenRouteProp>();

  const { categoryId, categoryName, categorySlug } = route.params;

  const { pictograms, isLoading, error } = usePictogramsByCategory(categoryId);
  const {
    favoriteIds,
    toggleFavorite,
    isReady: favoritesReady,
  } = useFavoritePictograms();
  const { trackUsage } = usePictogramUsage();
  const [currentPage, setCurrentPage] = useState(0);
  const [stableOrder, setStableOrder] = useState<Pictogram[]>([]);
  const sortedOnceRef = useRef(false);
  const flatListRef = useRef<FlatList>(null);

  const itemsPerPage = 4;

  useEffect(() => {
    if (sortedOnceRef.current || pictograms.length === 0) {
      return;
    }
    // Si los favoritos están listos, ordenamos. Si no, mostramos el orden natural.
    // Esto evita que la pantalla se quede en blanco esperando a los favoritos.
    sortedOnceRef.current = true;

    if (favoritesReady) {
      setStableOrder([
        ...pictograms.filter((p) => favoriteIds.has(p.id)),
        ...pictograms.filter((p) => !favoriteIds.has(p.id)),
      ]);
    } else {
      setStableOrder(pictograms);
    }
  }, [pictograms, favoriteIds, favoritesReady]);

  const { paginatedPictograms, totalPages } = usePaginatedPictograms({
    pictograms: stableOrder,
    itemsPerPage,
  });

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePictogramPress = useCallback((pictogram: Pictogram) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    void trackUsage(pictogram);
    void speakPictogramText(pictogram.keyword, pictogram.language);
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
        cardWrapper: {
          position: "relative",
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
        image: {
          width: 70,
          height: 70,
          resizeMode: "contain",
        },
        loadingImage: {
          width: 70,
          height: 70,
          backgroundColor: themedColors.secondary + "30",
          borderRadius: 10,
        },
      }),
    [themedColors, temaOscuro],
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
    (page: Pictogram[]) => {
      return (
        <View style={containerStyles.pageContainer}>
          <View style={containerStyles.gridRow}>
            {renderPictogramItem(page[0])}
            {page[1] ? (
              renderPictogramItem(page[1])
            ) : (
              <View style={{ flex: 1 }} />
            )}
          </View>
          <View style={containerStyles.gridRow}>
            {page[2] ? (
              renderPictogramItem(page[2])
            ) : (
              <View style={{ flex: 1 }} />
            )}
            {page[3] ? (
              renderPictogramItem(page[3])
            ) : (
              <View style={{ flex: 1 }} />
            )}
          </View>
        </View>
      );
    },
    [
      renderPictogramItem,
      containerStyles.pageContainer,
      containerStyles.gridRow,
    ],
  );

  const renderCarousel = useCallback(
    () => (
      <FlatList
        ref={flatListRef}
        data={paginatedPictograms}
        renderItem={({ item }) => renderPage(item)}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
    ),
    [paginatedPictograms, renderPage],
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
        <ScreenTitle text={transformText(normalizeCategoryName(categoryName, categorySlug))} />
        {renderSkeletonGrid()}
      </View>
    );
  }

  if (pictograms.length === 0) {
    return (
      <View style={containerStyles.container}>
        <BackButton onPress={handleGoBack} />
        <ScreenTitle text={transformText(normalizeCategoryName(categoryName, categorySlug))} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomText>
            {transformText(error || t("noPictogramsInCategory"))}
          </CustomText>
        </View>
      </View>
    );
  }

  return (
    <View style={containerStyles.container}>
      <BackButton onPress={handleGoBack} />
      <ScreenTitle text={transformText(normalizeCategoryName(categoryName, categorySlug))} />

      <View style={containerStyles.carouselContainer}>{renderCarousel()}</View>

      {totalPages > 1 && renderPagination()}
    </View>
  );
};

export default CategoryPictogramsScreen;
