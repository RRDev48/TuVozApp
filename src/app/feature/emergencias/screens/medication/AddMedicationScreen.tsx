import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  ScrollView,
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
    frequencyList: {
      width: "100%",
      backgroundColor: temaOscuro ? colors.white : themedColors.primary,
      borderRadius: 16,
      paddingVertical: 8,
      marginBottom: 20,
      maxHeight: 180,
    },
    frequencyItem: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderBottomWidth: 1,
      borderBottomColor: temaOscuro ? colors.blue : colors.white,
    },
    frequencyItemLast: {
      borderBottomWidth: 0,
    },
    frequencyText: {
      fontSize: 18,
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

      <ScreenTitle text={transformText("Agrega tu medicación")} />

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
                <CustomText style={styles.frequencyText}>
                  {frequency}
                </CustomText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <SaveButton onPress={handleSave} />
    </View>
  );
};

export default AddMedicationScreen;
