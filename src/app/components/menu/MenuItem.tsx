import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { MenuItemProps } from "../../models/menu.props";

const MenuItem = ({ name, image, styles, onPress }: MenuItemProps) => {
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Image source={image} style={styles.icon} resizeMode="contain" />
      </TouchableOpacity>
      <Text style={styles.textCard}>{name}</Text>
    </View>
  );
};

export default MenuItem;
