import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

type BloodTypeSelectionScreenRouteProp = RouteProp<
  RootStackParamsList,
  "BloodTypeSelection"
>;

type BloodTypeSelectionScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "BloodTypeSelection"
>;

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const BloodTypeSelectionScreen = () => {
  const navigation = useNavigation<BloodTypeSelectionScreenNavigationProp>();
  const route = useRoute<BloodTypeSelectionScreenRouteProp>();
  const { getThemedColors, transformText } = usePersonalization();
  const themedColors = getThemedColors();

  const [selectedBloodType, setSelectedBloodType] = useState<string>(
    route.params?.currentBloodType || "O-",
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelectBloodType = (type: string) => {
    setSelectedBloodType(type);
    setIsDropdownOpen(false);
  };

  const handleSave = () => {
    if (route.params?.onSelect) {
      route.params.onSelect(selectedBloodType);
    }
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themedColors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 10,
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    backText: {
      fontSize: 16,
      fontWeight: "600",
      color: themedColors.text,
      marginLeft: 4,
    },
    titleContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 30,
      fontWeight: "bold",
      textAlign: "center",
      color: themedColors.primary,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 120,
      alignItems: "center",
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: themedColors.text,
      textAlign: "center",
      marginBottom: 30,
    },
    dropdownButton: {
      width: "100%",
      backgroundColor: colors.white,
      borderRadius: 16,
      paddingVertical: 18,
      paddingHorizontal: 24,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    dropdownButtonText: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.darkGray,
    },
    bloodTypeList: {
      width: "100%",
      backgroundColor: colors.white,
      borderRadius: 16,
      paddingVertical: 8,
      marginBottom: 20,
      maxHeight: 300,
    },
    bloodTypeItem: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.lightGray,
    },
    bloodTypeItemLast: {
      borderBottomWidth: 0,
    },
    bloodTypeText: {
      fontSize: 18,
      fontWeight: "500",
      color: colors.darkGray,
    },
    saveButton: {
      position: "absolute",
      bottom: 40,
      left: 20,
      right: 20,
      backgroundColor: colors.green,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    saveButtonText: {
      color: colors.black,
      fontSize: 18,
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={themedColors.text} />
          <CustomText style={styles.backText}>
            {transformText("Atrás")}
          </CustomText>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <CustomText style={styles.headerTitle}>
          {transformText("Tipo de sangre")}
        </CustomText>
      </View>

      <View style={styles.contentContainer}>
        <CustomText style={styles.title}>
          {transformText("¿Cuál es tu tipo\nde sangre?")}
        </CustomText>

        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <CustomText style={styles.dropdownButtonText}>
            {selectedBloodType}
          </CustomText>
          <Ionicons
            name={isDropdownOpen ? "chevron-up" : "chevron-down"}
            size={24}
            color={colors.darkGray}
          />
        </TouchableOpacity>

        {isDropdownOpen && (
          <ScrollView style={styles.bloodTypeList}>
            {BLOOD_TYPES.map((type, index) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.bloodTypeItem,
                  index === BLOOD_TYPES.length - 1 && styles.bloodTypeItemLast,
                ]}
                onPress={() => handleSelectBloodType(type)}
              >
                <CustomText style={styles.bloodTypeText}>{type}</CustomText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <CustomText style={styles.saveButtonText}>
          {transformText("Guardar cambios")}
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default BloodTypeSelectionScreen;
