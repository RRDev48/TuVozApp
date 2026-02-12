import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { DropdownListProps } from "../(models)/component.props";

const DropdownList = ({
  items,
  onSelectItem,
  maxHeight = 200,
}: DropdownListProps) => {
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = StyleSheet.create({
    list: {
      width: "100%",
      backgroundColor: themedColors.primary,
      borderRadius: 16,
      paddingVertical: 8,
      marginBottom: 20,
      maxHeight: maxHeight,
    },
    item: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderBottomWidth: 1,
      borderBottomColor: themedColors.secondary,
    },
    itemLast: {
      borderBottomWidth: 0,
    },
    itemText: {
      fontSize: 18,
      fontWeight: "bold",
      color: themedColors.secondary,
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
          <Text style={styles.itemText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default DropdownList;
