import ErrorModal from "@/src/app/components/alerts/ErrorModal";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  ScrollView,
  StyleSheet,
  Text,
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
import SaveButton from "../../components/SaveButton";
import ThemedTextInput from "../../components/ThemedTextInput";

type AddMedicationScreenRouteProp = RouteProp<
  RootStackParamsList,
  "AddMedication"
>;
type AddMedicationScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "AddMedication"
>;

const AddMedicationScreen = () => {
  const navigation = useNavigation<AddMedicationScreenNavigationProp>();
  const route = useRoute<AddMedicationScreenRouteProp>();
  const { getThemedColors, transformText } = usePersonalization();
  const themedColors = getThemedColors();

  const {
    medicationName,
    setMedicationName,
    selectedFrequency,
    isDropdownOpen,
    setIsDropdownOpen,
    handleSelectFrequency,
    handleSave,
    showErrorModal,
    closeErrorModal,
  } = useMedicationForm({
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
    frequencyList: {
      width: "100%",
      backgroundColor: themedColors.primary,
      borderRadius: 16,
      paddingVertical: 8,
      marginBottom: 20,
      maxHeight: 180,
    },
    frequencyItem: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderBottomWidth: 1,
      borderBottomColor: themedColors.secondary,
    },
    frequencyItemLast: {
      borderBottomWidth: 0,
    },
    frequencyText: {
      fontSize: 18,
      fontWeight: "bold",
      color: themedColors.secondary,
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

      <ScreenTitle text={transformText("Agrega tu medicación")} />

      <View style={styles.contentContainer}>
        <View style={styles.firstSection}>
          <Text style={styles.sectionTitle}>
            {transformText("¿Qué medicación tomas?")}
          </Text>

          <ThemedTextInput
            placeholder={transformText("Nombre de la medicación")}
            value={medicationName}
            onChangeText={setMedicationName}
          />
        </View>

        <View>
          <Text style={styles.sectionTitle}>
            {transformText("¿Con qué frecuencia?")}
          </Text>

          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Text style={styles.dropdownButtonText}>{selectedFrequency}</Text>
            <Ionicons
              name={isDropdownOpen ? "chevron-up" : "chevron-down"}
              size={24}
              color={themedColors.secondary}
            />
          </TouchableOpacity>

          {isDropdownOpen && (
            <ScrollView
              style={styles.frequencyList}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
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
                  <Text style={styles.frequencyText}>{frequency}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>

      <SaveButton onPress={handleSave} />

      <ErrorModal
        visible={showErrorModal}
        title="Error"
        message="Por favor ingrese el nombre de la medicación"
        onClose={closeErrorModal}
      />
    </View>
  );
};

export default AddMedicationScreen;
