import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useMemo } from "react";
import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MenuItem from "../../common/menu/MenuItem";
import getGreeting from "../actions/actions";
import homeMenu from "../constants/home.menu";
import { useAuthentication } from "../hooks/useAuthentication";
import { useHomeMenu } from "../hooks/useHomeMenu";
import { useUserData } from "../hooks/useUserData";
import { HomeMenuItem, HomeRouteName } from "../models/userData.types";

const HomeScreen = () => {
  const { userName } = useUserData();
  const { isAuthenticated } = useAuthentication();
  const filteredMenuItems = useHomeMenu(isAuthenticated);
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = useMemo(() => {
    return StyleSheet.create({
      screenContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: themedColors.background,
      },
      headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        gap: 15,
      },
      userIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: themedColors.primary,
      },
      greetingText: {
        fontSize: 24,
        color: themedColors.text,
        fontWeight: "bold",
        flex: 1,
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
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        color: themedColors.text,
        marginTop: 5,
      },
      icon: {
        width: 70,
        height: 70,
      },
    });
  }, [themedColors]);

  const handleMenuPress = useCallback(
    (route: HomeRouteName) => {
      switch (route) {
        case "Expresate":
          navigation.navigate({ name: "Expresate", params: undefined });
          break;
        case "Rutinas":
          navigation.navigate({ name: "Rutinas", params: undefined });
          break;
        case "Tarjetas":
          navigation.navigate({ name: "Tarjetas", params: undefined });
          break;
        case "Frases":
          navigation.navigate({ name: "Frases", params: undefined });
          break;
        case "Emergencias":
          navigation.navigate({ name: "Emergencias", params: {} });
          break;
        case "Ajustes":
          navigation.navigate({ name: "Ajustes", params: undefined });
          break;
      }
    },
    [navigation],
  );

  const renderItem = useCallback<ListRenderItem<HomeMenuItem>>(
    ({ item }) => (
      <MenuItem
        name={item.name}
        route={item.component}
        image={item.icon}
        styles={styles}
        onPress={() => handleMenuPress(item.component)}
      />
    ),
    [styles, handleMenuPress],
  );

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        <Image
          source={homeMenu.homeScreenMenu[0].icon}
          style={styles.userIcon}
        />
        <Text style={styles.greetingText}>{getGreeting(userName)}</Text>
      </View>

      <FlatList
        data={filteredMenuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.component}
        numColumns={2}
        contentContainerStyle={{ padding: 10, flexGrow: 0 }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 20,
        }}
        scrollEnabled={false}
      />
    </View>
  );
};

export default HomeScreen;
