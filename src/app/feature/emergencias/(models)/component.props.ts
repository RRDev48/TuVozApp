import { Ionicons } from "@expo/vector-icons";
import { TextInputProps } from "react-native";

// Interfaces para componentes generales de emergencias
export interface AddButtonProps {
  onPress: () => void;
  text: string;
}

export interface DropdownListProps {
  items: string[];
  onSelectItem: (item: string) => void;
  maxHeight?: number;
}

export interface EmergencyFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onPress?: () => void;
  showArrow?: boolean;
}

export interface ListItemProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

export interface SaveButtonProps {
  onPress: () => void;
  text?: string;
  bottom?: number;
}

export interface ThemedTextInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
  numberOfLines?: number;
  minHeight?: number;
}
