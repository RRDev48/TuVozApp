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

type AddMedicationScreenRouteProp = RouteProp<
  RootStackParamsList,
  "AddMedication"
>;

type AddMedicationScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "AddMedication"
>;

const FREQUENCY_OPTIONS = [
  "Diaria",
  "Cada 12 horas",
  "Cada 8 horas",
  "Semanal",
  "Mensual",
];

const AddMedicationScreen = () => {
  const navigation = useNavigation<AddMedicationScreenNavigationProp>();
  const route = useRoute<AddMedicationScreenRouteProp>();
  const { getThemedColors, transformText } = usePersonalization();
  const themedColors = getThemedColors();

  const [medicationName, setMedicationName] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState("Diaria");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelectFrequency = (frequency: string) => {
    setSelectedFrequency(frequency);
    setIsDropdownOpen(false);
  };

  const handleSave = () => {
    if (medicationName.trim() === "") {
      Alert.alert(
        transformText("Error"),
        transformText("Por favor ingrese el nombre de la medicación"),
      );
      return;
    }

    if (route.params?.onAdd) {
      route.params.onAdd(`${medicationName} (${selectedFrequency})`);
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
    frequencyList: {
      width: "100%",
      backgroundColor: colors.white,
      borderRadius: 16,
      paddingVertical: 8,
      marginBottom: 20,
      maxHeight: 250,
    },
    frequencyItem: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.lightGray,
    },
    frequencyItemLast: {
      borderBottomWidth: 0,
    },
    frequencyText: {
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
          {transformText("Agrega tu medicación")}
        </CustomText>
      </View>

      <ScrollView style={styles.contentContainer}>
        <CustomText style={styles.sectionTitle}>
          {transformText("¿Qué medicación tomas?")}
        </CustomText>

        <TextInput
          style={styles.input}
          placeholder={transformText("Nombre de la medicación")}
          placeholderTextColor={colors.gray}
          value={medicationName}
          onChangeText={setMedicationName}
        />

        <CustomText style={styles.sectionTitle}>
          {transformText("¿Con qué frecuencia?")}
        </CustomText>

        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <CustomText style={styles.dropdownButtonText}>
            {selectedFrequency}
          </CustomText>
          <Ionicons
            name={isDropdownOpen ? "chevron-up" : "chevron-down"}
            size={24}
            color={colors.darkGray}
          />
        </TouchableOpacity>

        {isDropdownOpen && (
          <ScrollView style={styles.frequencyList}>
            {FREQUENCY_OPTIONS.map((frequency, index) => (
              <TouchableOpacity
                key={frequency}
                style={[
                  styles.frequencyItem,
                  index === FREQUENCY_OPTIONS.length - 1 &&
                    styles.frequencyItemLast,
                ]}
                onPress={() => handleSelectFrequency(frequency)}
              >
                <CustomText style={styles.frequencyText}>
                  {frequency}
                </CustomText>
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

export default AddMedicationScreen;
