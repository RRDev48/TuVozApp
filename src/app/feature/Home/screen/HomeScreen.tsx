import MenuItem from "@/src/app/components/menu/MenuItem";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback } from "react";
import { FlatList, Image, Text, View } from "react-native";
import getGreeting from "../(actions)/actions";
import { useAuthentication } from "../(hooks)/useAuthentication";
import { useHomeMenu } from "../(hooks)/useHomeMenu";
import { useHomeStyles } from "../(hooks)/useHomeStyles";
import { useUserData } from "../(hooks)/useUserData";
import homeMenu from "../constants/home.menu";

const HomeScreen = () => {
  const { userName } = useUserData();
  const { isAuthenticated } = useAuthentication();
  const filteredMenuItems = useHomeMenu(isAuthenticated);
  const styles = useHomeStyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();

  const handleMenuPress = useCallback(
    (route: string) => {
      navigation.navigate(route as any);
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: any) => (
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
