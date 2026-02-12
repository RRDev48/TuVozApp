import CustomText from "@/src/app/components/CustomText";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { MenuItemProps } from "../../feature/models/menu.props";

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
      <CustomText style={styles.textCard}>{name}</CustomText>
    </View>
  );
};

export default MenuItem;
