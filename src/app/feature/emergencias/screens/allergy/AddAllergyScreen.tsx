import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type AddAllergyScreenRouteProp = RouteProp<RootStackParamsList, "AddAllergy">;

type AddAllergyScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "AddAllergy"
>;

const SEVERITY_LEVELS = ["Leve", "Moderada", "Grave"];

const AddAllergyScreen = () => {
  const navigation = useNavigation<AddAllergyScreenNavigationProp>();
  const route = useRoute<AddAllergyScreenRouteProp>();
  const { getThemedColors, transformText } = usePersonalization();
  const themedColors = getThemedColors();

  const [allergyName, setAllergyName] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("Leve");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelectSeverity = (severity: string) => {
    setSelectedSeverity(severity);
    setIsDropdownOpen(false);
  };

  const handleSave = () => {
    if (allergyName.trim() === "") {
      Alert.alert(
        transformText("Error"),
        transformText("Por favor ingrese el nombre de la alergia"),
      );
      return;
    }

    if (route.params?.onAdd) {
      route.params.onAdd(`${allergyName} (${selectedSeverity})`);
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
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: themedColors.text,
      marginBottom: 15,
    },
    input: {
      backgroundColor: colors.darkGray,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 20,
      fontSize: 16,
      color: themedColors.text,
      marginBottom: 30,
    },
    dropdownButton: {
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
    severityList: {
      width: "100%",
      backgroundColor: colors.white,
      borderRadius: 16,
      paddingVertical: 8,
      marginBottom: 20,
      maxHeight: 200,
    },
    severityItem: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.lightGray,
    },
    severityItemLast: {
      borderBottomWidth: 0,
    },
    severityText: {
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
          {transformText("Agrega tu alergia")}
        </CustomText>
      </View>

      <ScrollView style={styles.contentContainer}>
        <CustomText style={styles.sectionTitle}>
          {transformText("¿Qué tipo de alergia presentas?")}
        </CustomText>

        <TextInput
          style={styles.input}
          placeholder={transformText("Nombre de la alergia")}
          placeholderTextColor={colors.gray}
          value={allergyName}
          onChangeText={setAllergyName}
        />

        <CustomText style={styles.sectionTitle}>
          {transformText("¿Cuál es el grado?")}
        </CustomText>

        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <CustomText style={styles.dropdownButtonText}>
            {selectedSeverity}
          </CustomText>
          <Ionicons
            name={isDropdownOpen ? "chevron-up" : "chevron-down"}
            size={24}
            color={colors.darkGray}
          />
        </TouchableOpacity>

        {isDropdownOpen && (
          <ScrollView style={styles.severityList}>
            {SEVERITY_LEVELS.map((severity, index) => (
              <TouchableOpacity
                key={severity}
                style={[
                  styles.severityItem,
                  index === SEVERITY_LEVELS.length - 1 &&
                    styles.severityItemLast,
                ]}
                onPress={() => handleSelectSeverity(severity)}
              >
                <CustomText style={styles.severityText}>{severity}</CustomText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <CustomText style={styles.saveButtonText}>
          {transformText("Guardar cambios")}
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default AddAllergyScreen;
