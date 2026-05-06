import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import ErrorModal from "@/src/app/feature/common/alerts/ErrorModal";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
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
import { useKeyboardVisibility } from "../../hooks/useKeyboardVisibility";
import {
  FREQUENCY_OPTIONS,
  useMedicationForm,
} from "../../hooks/useMedicationForm";
import i18n from "@/src/app/i18n";

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
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();
  const isKeyboardVisible = useKeyboardVisibility();

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

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: themedColors.background,
        },
        contentContainer: {
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 20,
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
        overlay: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
      }),
    [themedColors],
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {isDropdownOpen && (
        <TouchableWithoutFeedback onPress={() => setIsDropdownOpen(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <BackButton onPress={() => navigation.goBack()} />

      <ScreenTitle text={i18n.t('addMedication')} />

      <View style={styles.contentContainer}>
        <View style={styles.firstSection}>
          <Text style={styles.sectionTitle}>
            {i18n.t('whatMedicationTake')}
          </Text>

          <ThemedTextInput
            placeholder={i18n.t('medicationName')}
            value={medicationName}
            onChangeText={setMedicationName}
          />
        </View>

        <View>
          <Text style={styles.sectionTitle}>
            {i18n.t('howOften')}
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
            <DropdownList
              items={FREQUENCY_OPTIONS}
              onSelectItem={handleSelectFrequency}
              maxHeight={180}
            />
          )}
        </View>
      </View>

      <SaveButton onPress={handleSave} bottom={isKeyboardVisible ? 300 : 40} />

      <ErrorModal
        visible={showErrorModal}
        title={i18n.t('error')}
        message={i18n.t('pleaseEnterMedicationName')}
        onClose={closeErrorModal}
      />
    </KeyboardAvoidingView>
  );
};

export default AddMedicationScreen;
