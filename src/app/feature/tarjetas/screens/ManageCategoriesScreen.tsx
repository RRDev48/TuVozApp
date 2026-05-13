import { useExpresate } from "@/src/app/contexts/ExpresateContext";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useMemo, useState, useCallback, useRef } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../../common/BackButton";
import ScreenTitle from "../../common/ScreenTitle";
import { PictogramCategory } from "../../expresate/models/pictogram.types";
import MenuItem from "../../common/menu/MenuItem";

const { width } = Dimensions.get("window");
const PAGE_WIDTH = width - 40;

const ManageCategoriesScreen = () => {
  const { t } = useLanguageRefresh();
  const navigation = useNavigation<any>();
  const { getThemedColors, transformText, temaOscuro } = usePersonalization();
  const themedColors = getThemedColors();
  const { categories } = useExpresate();

  const [currentPage, setCurrentPage] = useState(0);

  const ITEMS_PER_PAGE = 4;
  const paginatedCategories = useMemo(() => {
    const pages = [];
    for (let i = 0; i < categories.length; i += ITEMS_PER_PAGE) {
      pages.push(categories.slice(i, i + ITEMS_PER_PAGE));
    }
    return pages;
  }, [categories]);

  const styles = useMemo(() => createStyles(themedColors, temaOscuro), [themedColors, temaOscuro]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentPage(viewableItems[0].index || 0);
    }
  }, []);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;
  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

  const handleEdit = (category: PictogramCategory) => {
    navigation.navigate("EditCategory", { category });
  };

  const handleAddNew = () => {
    navigation.navigate("EditCategory");
  };

  const renderPage = (page: any[]) => {
    const renderGridItem = (item?: any) => {
      if (!item) return <View style={{ flex: 1 }} />;
      return (
        <MenuItem
          name={transformText(item.name.charAt(0).toUpperCase() + item.name.slice(1))}
          route={item.slug}
          image={item.image_url ? { uri: item.image_url } : require("../../../assets/image/adip_icon.png")}
          styles={styles}
          onPress={() => handleEdit(item)}
        />
      );
    };

    return (
      <View style={styles.pageContainer}>
        <View style={styles.gridRow}>
          {renderGridItem(page[0])}
          {renderGridItem(page[1])}
        </View>
        <View style={styles.gridRow}>
          {renderGridItem(page[2])}
          {renderGridItem(page[3])}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />
      <ScreenTitle text={transformText(t("manageCategoriesTitle") || "Gestionar Categorías")} />

      <View style={styles.carouselContainer}>
        <FlatList
          data={paginatedCategories}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => renderPage(item)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        />
      </View>

      <View style={styles.paginationContainer}>
        {paginatedCategories.length > 1 && paginatedCategories.map((_, index) => (
          <View
            key={index}
            style={
              index === currentPage
                ? styles.paginationDotActive
                : styles.paginationDot
            }
          />
        ))}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
        <Ionicons name="add" size={32} color={themedColors.background} />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (themedColors: any, temaOscuro: boolean) =>
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
    addButton: {
      position: 'absolute',
      bottom: 30,
      right: 30,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: themedColors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
  });

export default ManageCategoriesScreen;
