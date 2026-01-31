import MenuItem from "@/src/app/components/menu/MenuItem";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import getGreeting from "../(actions)/actions";
import { useUserData } from "../(hooks)/useUserData";
import { userService } from "../(services)/userService";
import homeMenu from "../constants/home.menu";

const HomeScreen = () => {
  const { userName } = useUserData();
  const { getThemedColors, transformText } = usePersonalization();
  const themedColors = getThemedColors();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { user } = await userService.getCurrentUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  // Filter menu items based on authentication
  const filteredMenuItems = useMemo(() => {
    if (isAuthenticated) {
      return homeMenu.homeMenuItems;
    }
    // Hide Emergencias and Rutinas if not authenticated
    return homeMenu.homeMenuItems.filter(
      (item) => item.name !== "Emergencias" && item.name !== "Rutinas",
    );
  }, [isAuthenticated]);

  const handleMenuPress = useCallback(
    (route: string) => {
      navigation.navigate(route as any);
    },
    [navigation],
  );

  const homeScreenStyles = useMemo(
    () =>
      StyleSheet.create({
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
      }),
    [themedColors],
  );

  const homeMenuItemStyles = useMemo(
    () =>
      StyleSheet.create({
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
      }),
    [themedColors],
  );

  const renderItem = useCallback(
    ({ item }: any) => (
      <MenuItem
        name={item.name}
        route={item.component}
        image={item.icon}
        styles={homeMenuItemStyles}
        onPress={() => handleMenuPress(item.component)}
      />
    ),
    [homeMenuItemStyles, handleMenuPress],
  );

  const keyExtractor = useCallback((item: any) => item.component, []);

  return (
    <View style={homeScreenStyles.screenContainer}>
      <View style={homeScreenStyles.headerContainer}>
        <Image
          source={homeMenu.homeScreenMenu[0].icon}
          style={homeScreenStyles.userIcon}
        />
        <Text style={homeScreenStyles.greetingText}>
          {getGreeting(userName)}
        </Text>
      </View>

      <FlatList
        data={filteredMenuItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
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
