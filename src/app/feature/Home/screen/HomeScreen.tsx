import CustomText from "@/src/app/components/CustomText";
import MenuItem from "@/src/app/components/menu/MenuItem";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import getGreeting from "../(actions)/actions";
import { useUserData } from "../(hooks)/useUserData";
import homeMenu from "../constants/home.menu";

const HomeScreen = () => {
  const { userName } = useUserData();
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();

  const handleMenuPress = (route: string) => {
    navigation.navigate(route as any);
  };

  const homeScreenStyles = StyleSheet.create({
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
  });

  const homeMenuItemStyles = StyleSheet.create({
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

  return (
    <View style={homeScreenStyles.screenContainer}>
      <View style={homeScreenStyles.headerContainer}>
        <Image
          source={homeMenu.homeScreenMenu[0].icon}
          style={homeScreenStyles.userIcon}
        />
        <CustomText style={homeScreenStyles.greetingText}>
          {getGreeting(userName)}
        </CustomText>
      </View>

      <FlatList
        data={homeMenu.homeMenuItems}
        renderItem={({ item }) => (
          <MenuItem
            name={item.name}
            route={item.component}
            image={item.icon}
            styles={homeMenuItemStyles}
            onPress={() => handleMenuPress(item.component)}
          />
        )}
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
