import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import ErrorModal from "@/src/app/feature/common/alerts/ErrorModal";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import BackButton from "../../../common/BackButton";
import ScreenTitle from "../../../common/ScreenTitle";
import DropdownList from "../../components/DropdownList";
import SaveButton from "../../components/SaveButton";
import ThemedTextInput from "../../components/ThemedTextInput";
import { SEVERITY_LEVELS, useAllergyForm } from "../../hooks/useAllergyForm";

type EditAllergyScreenRouteProp = RouteProp<RootStackParamsList, "EditAllergy">;
type EditAllergyScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "EditAllergy"
>;

const EditAllergyScreen = () => {
  const navigation = useNavigation<EditAllergyScreenNavigationProp>();
  const route = useRoute<EditAllergyScreenRouteProp>();
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
    handleDelete,
    showErrorModal,
    closeErrorModal,
  } = useAllergyForm({
    initialAllergy: route.params?.allergy || "",
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
      paddingBottom: 180,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: themedColors.text,
      marginBottom: 20,
      textAlign: "center",
    },
    firstSection: {
      marginBottom: 30,
    },
    dropdownButton: {
      backgroundColor: themedColors.primary,
      borderRadius: 16,
      paddingVertical: 18,
      paddingHorizontal: 24,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dropdownButtonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: themedColors.secondary,
    },
    deleteButton: {
      position: "absolute",
      bottom: 28,
      left: 20,
      right: 20,
      backgroundColor: themedColors.transparent,
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

      <ScreenTitle text={transformText("Editar alergia")} />

      <View style={styles.contentContainer}>
        <View style={styles.firstSection}>
          <Text style={styles.sectionTitle}>
            {transformText("¿Qué tipo de alergia presentas?")}
          </Text>

          <ThemedTextInput
            placeholder={transformText("Nombre de la alergia")}
            value={allergyName}
            onChangeText={setAllergyName}
          />
        </View>

        <View>
          <Text style={styles.sectionTitle}>
            {transformText("¿Cuál es el grado?")}
          </Text>

          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Text style={styles.dropdownButtonText}>{selectedSeverity}</Text>
            <Ionicons
              name={isDropdownOpen ? "chevron-up" : "chevron-down"}
              size={24}
              color={themedColors.secondary}
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
      </View>

      <SaveButton onPress={handleSave} bottom={110} />

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>{transformText("Eliminar")}</Text>
      </TouchableOpacity>

      <ErrorModal
        visible={showErrorModal}
        title="Error"
        message="Por favor ingrese el nombre de la alergia"
        onClose={closeErrorModal}
      />
    </View>
  );
};

export default EditAllergyScreen;
