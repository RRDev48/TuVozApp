import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

interface DropdownListProps {
  items: string[];
  onSelectItem: (item: string) => void;
  maxHeight?: number;
}

const DropdownList = ({
  items,
  onSelectItem,
  maxHeight = 200,
}: DropdownListProps) => {
  const { getThemedColors, temaOscuro } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = StyleSheet.create({
    list: {
      width: "100%",
      backgroundColor: temaOscuro ? colors.white : themedColors.primary,
      borderRadius: 16,
      paddingVertical: 8,
      marginBottom: 20,
      maxHeight: maxHeight,
    },
    item: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderBottomWidth: 1,
      borderBottomColor: temaOscuro ? colors.blue : colors.white,
    },
    itemLast: {
      borderBottomWidth: 0,
    },
    itemText: {
      fontSize: 18,
      fontWeight: "bold",
      color: temaOscuro ? colors.blue : colors.white,
    },
  });

  return (
    <ScrollView
      style={styles.list}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={true}
    >
      {items.map((item, index) => (
        <TouchableOpacity
          key={item}
          style={[styles.item, index === items.length - 1 && styles.itemLast]}
          onPress={() => onSelectItem(item)}
        >
          <CustomText style={styles.itemText}>{item}</CustomText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default DropdownList;
