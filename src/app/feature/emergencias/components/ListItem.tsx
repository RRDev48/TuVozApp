import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

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
      backgroundColor: temaOscuro ? colors.darkGray : themedColors.primary,
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 16,
      marginBottom: 15,
    },
    icon: {
      width: 60,
      height: 60,
      borderRadius: 12,
      backgroundColor: temaOscuro ? colors.blue : "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
    },
    info: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.white,
      marginBottom: subtitle ? 4 : 0,
    },
    subtitle: {
      fontSize: 14,
      fontWeight: "400",
      color: colors.white,
    },
  });

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.icon}>
        <Ionicons name={iconName} size={30} color={colors.white} />
      </View>
      <View style={styles.info}>
        <CustomText style={styles.title}>{title}</CustomText>
        {subtitle && (
          <CustomText style={styles.subtitle}>{subtitle}</CustomText>
        )}
      </View>
      <Ionicons name="chevron-forward" size={24} color={colors.white} />
    </TouchableOpacity>
  );
};

export default ListItem;
