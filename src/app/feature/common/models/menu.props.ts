import {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

export interface MenuItemProps {
  name: string;
  route: string;
  image: ImageSourcePropType;
  styles: {
    itemContainer: StyleProp<ViewStyle>;
    buttonContainer: StyleProp<ViewStyle>;
    icon: StyleProp<ImageStyle>;
    textCard: StyleProp<TextStyle>;
  };
  onPress: () => void;
}

export default {};
