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
  View
} from "react-native";
import { SEVERITY_LEVELS, useAllergyForm } from "../../(hooks)/useAllergyForm";
import BackButton from "../../../components/BackButton";
import ScreenTitle from "../../../components/ScreenTitle";
import DropdownList from "../../components/DropdownList";
import SaveButton from "../../components/SaveButton";
import ThemedTextInput from "../../components/ThemedTextInput";

type AddAllergyScreenRouteProp = RouteProp<RootStackParamsList, "AddAllergy">;
type AddAllergyScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "AddAllergy"
>;

const AddAllergyScreen = () => {
  const navigation = useNavigation<AddAllergyScreenNavigationProp>();
  const route = useRoute<AddAllergyScreenRouteProp>();
  const { getThemedColors, transformText, temaOscuro } = usePersonalization();
  const themedColors = getThemedColors();

  const {
    allergyName,
    setAllergyName,
    selectedSeverity,
    isDropdownOpen,
    setIsDropdownOpen,
    handleSelectSeverity,
    handleSave,
  } = useAllergyForm({
    onAdd: route.params?.onAdd,
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
      paddingBottom: 120,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
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

      <ScreenTitle text={transformText("Agrega tu alergia")} />

      <View style={styles.contentContainer}>
        <CustomText style={styles.sectionTitle}>
          {transformText("¿Qué tipo de alergia presentas?")}
        </CustomText>

        <ThemedTextInput
          placeholder={transformText("Nombre de la alergia")}
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
            color={temaOscuro ? colors.blue : colors.white}
          />
        </TouchableOpacity>

        {isDropdownOpen && (
          <DropdownList
            items={SEVERITY_LEVELS}
            onSelectItem={handleSelectSeverity}
            maxHeight={160}
          />
        )}
      </View>

      <SaveButton onPress={handleSave} />
    </View>
  );
};

export default AddAllergyScreen;
