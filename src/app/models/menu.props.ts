import {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

// Props que describen un ítem del menú principal,
// incluyendo texto, ruta de navegación e icono con estilos.
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
