import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import BackButton from "@/src/app/feature/common/BackButton";
import CustomText from "@/src/app/feature/common/CustomText";
import ScreenTitle from "@/src/app/feature/common/ScreenTitle";
import { usePaginatedCategories } from "@/src/app/feature/expresate/hooks/usePaginatedCategories";
import { usePictogramCategories } from "@/src/app/feature/expresate/hooks/usePictogramCategories";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  ViewToken,
} from "react-native";
import MenuItem from "../../common/menu/MenuItem";

const { width } = Dimensions.get("window");
const PAGE_WIDTH = width - 40;

const ExpresateScreen = () => {
  const { transformText, getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();
  const { categories, isLoading } = usePictogramCategories();
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const itemsPerPage = 6;
  const { paginatedCategories, totalPages } = usePaginatedCategories({
    categories,
    itemsPerPage,
  });

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleMenuItemPress = useCallback(
    (categoryId: string, categorySlug: string, categoryName: string) => {
      navigation.navigate("CategoryPictograms", {
        categoryId,
        categoryName,
      });
    },
    [navigation],
  );

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
          backgroundColor: themedColors.secondary,
        },
        paginationDotActive: {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: themedColors.primary,
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
        },
        textCard: {
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "center",
          color: themedColors.text,
          marginTop: 5,
        },
        icon: {
          width: 70,
          height: 70,
        },
      }),
    [themedColors],
  );

  const renderCategoryItem = useCallback(
    (item: any) => (
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

  const renderPage = useCallback(
    (page: any[]) => {
      return (
        <View style={containerStyles.pageContainer}>
          <View style={containerStyles.gridRow}>
            {renderCategoryItem(page[0])}
            {page[1] ? (
              renderCategoryItem(page[1])
            ) : (
              <View style={{ flex: 1 }} />
            )}
          </View>
          <View style={containerStyles.gridRow}>
            {page[2] ? (
              renderCategoryItem(page[2])
            ) : (
              <View style={{ flex: 1 }} />
            )}
            {page[3] ? (
              renderCategoryItem(page[3])
            ) : (
              <View style={{ flex: 1 }} />
            )}
          </View>
          <View style={containerStyles.gridRow}>
            {page[4] ? (
              renderCategoryItem(page[4])
            ) : (
              <View style={{ flex: 1 }} />
            )}
            {page[5] ? (
              renderCategoryItem(page[5])
            ) : (
              <View style={{ flex: 1 }} />
            )}
          </View>
        </View>
      );
    },
    [
      renderCategoryItem,
      containerStyles.pageContainer,
      containerStyles.gridRow,
    ],
  );

  const renderCarousel = useCallback(
    () => (
      <FlatList
        ref={flatListRef}
        data={paginatedCategories}
        renderItem={({ item }) => renderPage(item)}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
    ),
    [paginatedCategories, renderPage],
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

  return (
    <View style={containerStyles.container}>
      <BackButton onPress={handleGoBack} />
      <ScreenTitle text={transformText("Expresate con tarjetas")} />

      <View style={containerStyles.carouselContainer}>{renderCarousel()}</View>

      {totalPages > 1 && renderPagination()}
    </View>
  );
};

export default ExpresateScreen;
