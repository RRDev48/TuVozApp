import MenuItem from "@/src/app/components/menu/MenuItem";
import { homeMenuItemStyles } from "@/src/app/design-system/styles/menuItem-Styles";
import { homeScreenStyles } from "@/src/app/design-system/styles/screen-Styles";
import React from "react";
import { FlatList, Image, Text, View } from "react-native";
import getGreeting from "../(actions)/actions";
import { useUserData } from "../(hooks)/useUserData";
import homeMenu from "../constants/home.menu";

const HomeScreen = () => {
  const { userName } = useUserData();

  return (
    <View style={homeScreenStyles.screenContainer}>
      <View style={homeScreenStyles.headerContainer}>
        <View style={homeScreenStyles.iconContainer}>
          <Image
            source={homeMenu.homeScreenMenu[0].icon}
            style={homeScreenStyles.userIcon}
          />
        </View>
        <View style={homeScreenStyles.textContainer}>
          <Text style={homeScreenStyles.greetingText}>
            {getGreeting(userName)}
          </Text>
        </View>
      </View>

      <FlatList
        data={homeMenu.homeMenuItems}
        renderItem={({ item }) => (
          <MenuItem
            name={item.name}
            route={item.component}
            image={item.icon}
            styles={homeMenuItemStyles}
            onPress={() => {}}
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
