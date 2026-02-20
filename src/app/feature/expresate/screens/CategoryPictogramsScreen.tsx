// React
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";

// Componentes
import BackButton from "@/src/app/feature/common/BackButton";
import CustomText from "@/src/app/feature/common/CustomText";
import ScreenTitle from "@/src/app/feature/common/ScreenTitle";

// Hooks
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { usePaginatedPictograms } from "@/src/app/feature/expresate/hooks/usePaginatedPictograms";
import { usePictogramsByCategory } from "@/src/app/feature/expresate/hooks/usePictogramsByCategory";

// Tipos
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Pictogram } from "../models/pictogram.types";

const { width } = Dimensions.get("window");
const PAGE_WIDTH = width - 40;

type CategoryPictogramsScreenRouteProp = RouteProp<
  RootStackParamsList,
  "CategoryPictograms"
>;

const CategoryPictogramsScreen = () => {
  const { transformText, getThemedColors, tamanioLetra, getFontSize } =
    usePersonalization();
  const themedColors = getThemedColors();
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();
  const route = useRoute<CategoryPictogramsScreenRouteProp>();

  const { categoryId, categoryName } = route.params;

  const { pictograms, isLoading } = usePictogramsByCategory(categoryId);
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const itemsPerPage = tamanioLetra === "grande" ? 3 : 6;
  const { paginatedPictograms, totalPages } = usePaginatedPictograms({
    pictograms,
    itemsPerPage,
  });

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePictogramPress = useCallback((pictogram: Pictogram) => {
    console.log("Pictogram selected:", pictogram.keyword, pictogram.arasaac_id);

    // Feedback háptico
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Reproducir el keyword con Text-to-Speech
    const language = pictogram.language === "es" ? "es-ES" : pictogram.language;
    Speech.speak(pictogram.keyword, {
      language: language,
      pitch: 1.0,
      rate: 0.9,
    });
  }, []);

  const getArasaacImageUrl = useCallback((arasaacId: string) => {
    return `https://api.arasaac.org/v1/pictograms/${arasaacId}`;
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
          overflow: "hidden",
        },
        textCard: {
          fontSize: getFontSize(18),
          fontWeight: "bold",
          textAlign: "center",
          color: themedColors.text,
          marginTop: 5,
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
    [themedColors, getFontSize],
  );

  const renderPictogramItem = useCallback(
    (item: Pictogram) => (
      <TouchableOpacity
        style={containerStyles.itemContainer}
        onPress={() => handlePictogramPress(item)}
        activeOpacity={0.7}
      >
        <View style={containerStyles.buttonContainer}>
          <Image
            source={{ uri: getArasaacImageUrl(item.arasaac_id) }}
            style={containerStyles.image}
            defaultSource={require("@/src/app/assets/icon/Ajustes.png")}
          />
        </View>
        <CustomText style={containerStyles.textCard}>
          {transformText(item.keyword)}
        </CustomText>
      </TouchableOpacity>
    ),
    [containerStyles, handlePictogramPress, getArasaacImageUrl, transformText],
  );

  const renderPage = useCallback(
    (page: Pictogram[]) => {
      if (tamanioLetra === "grande") {
        // 1x3 para letra grande (1 columna, 3 filas)
        return (
          <View style={containerStyles.pageContainer}>
            <View style={containerStyles.gridRow}>
              {renderPictogramItem(page[0])}
            </View>
            <View style={containerStyles.gridRow}>
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
            </View>
          </View>
        );
      }
      // 2x3 para otros tamaños
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
          <View style={containerStyles.gridRow}>
            {page[4] ? (
              renderPictogramItem(page[4])
            ) : (
              <View style={{ flex: 1 }} />
            )}
            {page[5] ? (
              renderPictogramItem(page[5])
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
      tamanioLetra,
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

  if (isLoading) {
    return (
      <View style={containerStyles.container}>
        <BackButton onPress={handleGoBack} />
        <ScreenTitle text={transformText(categoryName)} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomText>{transformText("Cargando pictogramas...")}</CustomText>
        </View>
      </View>
    );
  }

  if (pictograms.length === 0) {
    return (
      <View style={containerStyles.container}>
        <BackButton onPress={handleGoBack} />
        <ScreenTitle text={transformText(categoryName)} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomText>
            {transformText("No hay pictogramas disponibles en esta categoría")}
          </CustomText>
        </View>
      </View>
    );
  }

  return (
    <View style={containerStyles.container}>
      <BackButton onPress={handleGoBack} />
      <ScreenTitle text={transformText(categoryName)} />

      <View style={containerStyles.carouselContainer}>{renderCarousel()}</View>

      {totalPages > 1 && renderPagination()}
    </View>
  );
};

export default CategoryPictogramsScreen;
