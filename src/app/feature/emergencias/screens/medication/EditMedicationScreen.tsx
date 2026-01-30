import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  FREQUENCY_OPTIONS,
  useMedicationForm,
} from "../../(hooks)/useMedicationForm";
import BackButton from "../../../components/BackButton";
import ScreenTitle from "../../../components/ScreenTitle";
import DropdownList from "../../components/DropdownList";
import SaveButton from "../../components/SaveButton";
import ThemedTextInput from "../../components/ThemedTextInput";

type EditMedicationScreenRouteProp = RouteProp<
  RootStackParamsList,
  "EditMedication"
>;
type EditMedicationScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "EditMedication"
>;

const EditMedicationScreen = () => {
  const navigation = useNavigation<EditMedicationScreenNavigationProp>();
  const route = useRoute<EditMedicationScreenRouteProp>();
  const { getThemedColors, transformText, temaOscuro } = usePersonalization();
  const themedColors = getThemedColors();

  const {
    medicationName,
    setMedicationName,
    selectedFrequency,
    isDropdownOpen,
    setIsDropdownOpen,
    handleSelectFrequency,
    handleSave,
    handleDelete,
  } = useMedicationForm({
    initialMedication: route.params?.medication || "",
    onUpdate: route.params?.onUpdate,
    onDelete: route.params?.onDelete,
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themedColors.background,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 200,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: themedColors.text,
      marginBottom: 15,
    },
    dropdownButton: {
      backgroundColor: temaOscuro ? colors.white : themedColors.primary,
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
      fontWeight: "bold",
      color: temaOscuro ? colors.blue : colors.white,
    },
    deleteButton: {
      position: "absolute",
      bottom: 28,
      left: 20,
      right: 20,
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: colors.red,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    deleteButtonText: {
      color: colors.red,
      fontSize: 18,
      fontWeight: "bold",
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  });

  return (
    <View style={styles.container}>
      {isDropdownOpen && (
        <TouchableWithoutFeedback onPress={() => setIsDropdownOpen(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <BackButton onPress={() => navigation.goBack()} />

      <ScreenTitle text={transformText("Editar medicación")} />

      <View style={styles.contentContainer}>
        <CustomText style={styles.sectionTitle}>
          {transformText("¿Qué medicación tomas?")}
        </CustomText>

        <ThemedTextInput
          placeholder={transformText("Nombre de la medicación")}
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
            color={temaOscuro ? colors.blue : colors.white}
          />
        </TouchableOpacity>

        {isDropdownOpen && (
          <DropdownList
            items={FREQUENCY_OPTIONS}
            onSelectItem={handleSelectFrequency}
            maxHeight={210}
          />
        )}
      </View>

      <SaveButton onPress={handleSave} bottom={110} />

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <CustomText style={styles.deleteButtonText}>
          {transformText("Eliminar")}
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default EditMedicationScreen;
