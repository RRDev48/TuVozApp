import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import BackButton from "@/src/app/feature/common/BackButton";
import ScreenTitle from "@/src/app/feature/common/ScreenTitle";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import MenuItem from "../../common/menu/MenuItem";

const EDIT_ICON = require("@/src/app/assets/icon/EditarTarjetas.png");
const NEW_ICON = require("@/src/app/assets/icon/NuevasTarjetas.png");

const CardsScreen = () => {
  const { t } = useLanguageRefresh();
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();
  const { getThemedColors, temaOscuro } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = useMemo(
    () => createStyles(themedColors, temaOscuro),
    [themedColors, temaOscuro]
  );

  const menuItems = [
    {
      id: "manage",
      name: t("manageCategoriesTitle") || "Gestionar Categorías",
      route: "ManageCategories",
      icon: EDIT_ICON,
      onPress: () => navigation.navigate("ManageCategories" as any),
    },
    {
      id: "add",
      name: t("addPictogramsTitle") || "Añadir Pictogramas",
      route: "AddPictograms",
      icon: NEW_ICON,
      onPress: () => navigation.navigate("AddPictograms" as any),
    },
  ];

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />

      <ScreenTitle text={t("cards")} />

      <View style={styles.content}>
        <FlatList
          data={menuItems}
          renderItem={({ item }) => (
            <MenuItem
              name={item.name}
              route={item.route}
              image={item.icon}
              styles={styles}
              onPress={item.onPress}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={1}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
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
      flex: 1,
      paddingHorizontal: 20,
      justifyContent: "center",
      paddingBottom: 60, // Añadido más espacio abajo
    },
    itemContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 20, // Aumentado el espacio entre botones
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
      textAlign: "center",
      color: themedColors.text,
      marginTop: 8,
    },
    icon: {
      width: 70,
      height: 70,
    },
    flatListContent: {
      flexGrow: 1,
      justifyContent: "center",
      paddingVertical: 20,
    },
    columnWrapper: {
      justifyContent: "space-between",
      marginBottom: 10,
    },
  });

export default CardsScreen;

