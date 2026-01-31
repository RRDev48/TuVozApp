import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ListItemProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

const ListItem = ({ iconName, title, subtitle, onPress }: ListItemProps) => {
  const { temaOscuro, getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = StyleSheet.create({
    item: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: themedColors.primary,
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 16,
      marginBottom: 15,
    },
    icon: {
      width: 60,
      height: 60,
      borderRadius: 12,
      backgroundColor: themedColors.transparent,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
    },
    info: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: themedColors.secondary,
      marginBottom: subtitle ? 4 : 0,
    },
    subtitle: {
      fontSize: 14,
      fontWeight: "normal",
      color: themedColors.secondary,
    },
  });

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.icon}>
        <Ionicons name={iconName} size={30} color={themedColors.secondary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <Ionicons
        name="chevron-forward"
        size={24}
        color={themedColors.secondary}
      />
    </TouchableOpacity>
  );
};

export default ListItem;
