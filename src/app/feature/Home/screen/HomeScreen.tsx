import SkeletonAvatar from "@/src/app/components/common/SkeletonAvatar";
import SkeletonCard from "@/src/app/components/common/SkeletonCard";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useEffect, useMemo } from "react";
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
import { useAuthentication } from "../hooks/useAuthentication";
import { useHomeMenu } from "../hooks/useHomeMenu";
import { useUserData } from "../hooks/useUserData";
import { HomeMenuItem, HomeRouteName } from "../models/userData.types";
import { useEmergencyProfile } from "../../emergencias/hooks/useEmergencyProfile";

const ADIP_ICON = require("@/src/app/assets/image/adip_icon.png");

const HomeScreen = () => {
  const { t } = useLanguageRefresh();
  const { userName, avatarUrl, loading: isLoadingUser } = useUserData();
  const { isAuthenticated } = useAuthentication();
  const filteredMenuItems = useHomeMenu(isAuthenticated);
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();
  const { getThemedColors, temaOscuro } = usePersonalization();
  const themedColors = getThemedColors();
  const { profile, loading: isLoadingProfile } = useEmergencyProfile();

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]);

  const styles = useMemo(() => createStyles(themedColors, temaOscuro), [themedColors, temaOscuro]);

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
          navigation.navigate("EmergencyProfile");
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
        name={item.name || ""}
        route={item.component}
        image={item.icon}
        styles={styles}
        onPress={() => handleMenuPress(item.component)}
      />
    ),
    [styles, handleMenuPress],
  );

  const renderSkeletonGrid = () => (
    <View style={styles.skeletonGrid}>
      <View style={styles.columnWrapper}>
        <SkeletonCard />
        <SkeletonCard />
      </View>
      <View style={styles.columnWrapper}>
        <SkeletonCard />
        <SkeletonCard />
      </View>
      <View style={styles.columnWrapper}>
        <SkeletonCard />
        <SkeletonCard />
      </View>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        {isLoadingUser ? (
          <SkeletonAvatar size={60} />
        ) : (
          <Image
            source={avatarUrl ? { uri: avatarUrl } : ADIP_ICON}
            style={styles.userIcon}
            resizeMode="cover"
          />
        )}
        <Text style={styles.greetingText}>{getGreeting(userName, t)}</Text>
      </View>

      {filteredMenuItems.length === 0 ? (
        renderSkeletonGrid()
      ) : (
        <FlatList
          data={filteredMenuItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.component}
          numColumns={2}
          contentContainerStyle={styles.flatListContent}
          columnWrapperStyle={styles.columnWrapper}
          scrollEnabled={false}
          removeClippedSubviews={true}
          initialNumToRender={6}
        />
      )}
    </View>
  );
};

const createStyles = (themedColors: any, temaOscuro: boolean) => StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 28,
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
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: temaOscuro ? 0.4 : 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  greetingText: {
    fontSize: 24,
    color: themedColors.text,
    fontWeight: "bold",
    flex: 1,
  },
  skeletonGrid: {
    padding: 10,
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
  flatListContent: {
    padding: 10,
    flexGrow: 0
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 20,
  }
});

export default HomeScreen;
