// React
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

// Componentes
import CustomText from "@/src/app/components/CustomText";
import MenuItem from "@/src/app/components/menu/MenuItem";
import BackButton from "@/src/app/feature/components/BackButton";
import ScreenTitle from "@/src/app/feature/components/ScreenTitle";

// Hooks
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { usePaginatedCategories } from "@/src/app/feature/expresate/(hooks)/usePaginatedCategories";
import { usePictogramCategories } from "@/src/app/feature/expresate/(hooks)/usePictogramCategories";

// Tipos
import RootStackParamsList from "@/src/app/navigation/navigation.types";

const { width } = Dimensions.get("window");
const PAGE_WIDTH = width - 40;

const ExpresateScreen = () => {
  const { transformText, getThemedColors, tamanioLetra, getFontSize } =
    usePersonalization();
  const themedColors = getThemedColors();
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();
  const { categories, isLoading } = usePictogramCategories();
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const itemsPerPage = tamanioLetra === "grande" ? 3 : 6;
  const { paginatedCategories, totalPages } = usePaginatedCategories({
    categories,
    itemsPerPage,
  });

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleMenuItemPress = useCallback((categorySlug: string) => {}, []);

  const normalizeCategoryName = useCallback((slug: string) => {
    return slug
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
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
          fontSize: getFontSize(18),
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
    [themedColors, getFontSize],
  );

  const renderCategoryItem = useCallback(
    (item: any) => (
      <MenuItem
        name={normalizeCategoryName(item.category_slug)}
        route={item.category_slug}
        image={require("@/src/app/assets/icon/Ajustes.png")}
        styles={containerStyles}
        onPress={() => handleMenuItemPress(item.category_slug)}
      />
    ),
    [containerStyles, handleMenuItemPress, normalizeCategoryName],
  );

  const renderPage = useCallback(
    (page: any[]) => {
      if (tamanioLetra === "grande") {
        // 1x3 para letra grande (1 columna, 3 filas)
        return (
          <View style={containerStyles.pageContainer}>
            <View style={containerStyles.gridRow}>
              {renderCategoryItem(page[0])}
            </View>
            <View style={containerStyles.gridRow}>
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
            </View>
          </View>
        );
      }
      // 2x3 para otros tamaños
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
      tamanioLetra,
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
