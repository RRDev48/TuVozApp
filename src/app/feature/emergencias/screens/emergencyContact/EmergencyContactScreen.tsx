import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { useErrorHandling } from "@/src/app/feature/ajustes/hooks/useErrorHandling";
import ErrorModal from "@/src/app/feature/common/alerts/ErrorModal";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useMemo, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import BackButton from "../../../common/BackButton";
import ScreenTitle from "../../../common/ScreenTitle";
import SaveButton from "../../components/SaveButton";
import ThemedTextInput from "../../components/ThemedTextInput";
import { useKeyboardVisibility } from "../../hooks/useKeyboardVisibility";
import { COUNTRY_CODES } from "../../services/phoneParser";

type EmergencyContactScreenRouteProp = RouteProp<
  RootStackParamsList,
  "EmergencyContactSelection"
>;
type EmergencyContactScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "EmergencyContactSelection"
>;

const EmergencyContactScreen = () => {
  const navigation = useNavigation<EmergencyContactScreenNavigationProp>();
  const route = useRoute<EmergencyContactScreenRouteProp>();
  const { transformText, getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();
  const isKeyboardVisible = useKeyboardVisibility();

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
        phoneContainer: {
          flexDirection: "row",
          gap: 10,
          marginBottom: 30,
        },
        countryCodeButton: {
          backgroundColor: themedColors.primary,
          borderRadius: 12,
          paddingVertical: 16,
          paddingHorizontal: 15,
          flexDirection: "row",
          alignItems: "center",
          minWidth: 120,
        },
        flagText: {
          fontSize: 24,
          marginRight: 8,
        },
        countryCodeText: {
          fontSize: 16,
          fontWeight: "bold",
          color: themedColors.secondary,
          marginRight: 4,
        },
        phoneInput: {
          flex: 1,
          backgroundColor: themedColors.primary,
          borderRadius: 12,
          paddingVertical: 16,
          paddingHorizontal: 20,
          fontSize: 16,
          fontWeight: "bold",
          color: themedColors.secondary,
        },
        countryCodeList: {
          backgroundColor: themedColors.primary,
          borderRadius: 16,
          paddingVertical: 8,
          marginBottom: 20,
          maxHeight: 300,
        },
        countryCodeItem: {
          paddingVertical: 12,
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: themedColors.secondary,
        },
        countryCodeItemLast: {
          borderBottomWidth: 0,
        },
        countryFlag: {
          fontSize: 24,
          marginRight: 12,
        },
        countryInfo: {
          flex: 1,
        },
        countryName: {
          fontSize: 16,
          fontWeight: "bold",
          color: themedColors.secondary,
          marginBottom: 2,
        },
        countryCode: {
          fontSize: 14,
          fontWeight: "bold",
          color: themedColors.secondary,
        },
        overlay: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "transparent",
        },
        dropdownWrapper: {
          marginBottom: 20,
        },
      }),
    [themedColors],
  );

  const [contactName, setContactName] = useState(
    route.params?.currentContactName || "",
  );
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    route.params?.currentCountryCode || "+54",
  );
  const [phoneNumber, setPhoneNumber] = useState(
    route.params?.currentPhoneNumber || "",
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { showErrorModal, errorMessage, logAndShowError, closeErrorModal } =
    useErrorHandling();

  const handleSelectCountryCode = (code: string) => {
    setSelectedCountryCode(code);
    setIsDropdownOpen(false);
  };

  const handleSave = () => {
    if (contactName.trim() === "") {
      logAndShowError(
        "Por favor ingrese el nombre del contacto",
        new Error("Por favor ingrese el nombre del contacto"),
        {
          context: "emergency_contact_name_empty",
          metadata: { contact_name_length: contactName.length },
        },
      );
      return;
    }

    if (phoneNumber.trim() === "") {
      logAndShowError(
        "Por favor ingrese el número de teléfono",
        new Error("Por favor ingrese el número de teléfono"),
        {
          context: "emergency_contact_phone_empty",
          metadata: {
            phone_number_length: phoneNumber.length,
            country_code: selectedCountryCode,
          },
        },
      );
      return;
    }

    if (route.params?.onSelect) {
      route.params.onSelect(
        contactName,
        `${selectedCountryCode}${phoneNumber}`,
      );
    }
    navigation.goBack();
  };

  const getSelectedCountry = () => {
    const country = COUNTRY_CODES.find((c) => c.code === selectedCountryCode);
    return country || COUNTRY_CODES[2];
  };

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

      <ScreenTitle text={transformText("Contacto de emergencia")} />

      <ScrollView style={styles.contentContainer}>
        <View style={styles.firstSection}>
          <Text style={styles.sectionTitle}>
            {transformText("Nombre del contacto")}
          </Text>

          <ThemedTextInput
            placeholder={transformText("Nombre completo")}
            value={contactName}
            onChangeText={setContactName}
          />
        </View>

        <View>
          <Text style={styles.sectionTitle}>
            {transformText("Número de teléfono")}
          </Text>

          <View style={styles.phoneContainer}>
            <TouchableOpacity
              style={styles.countryCodeButton}
              onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Text style={styles.flagText}>{getSelectedCountry().flag}</Text>
              <Text style={styles.countryCodeText}>{selectedCountryCode}</Text>
              <Ionicons
                name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                size={20}
                color={themedColors.secondary}
              />
            </TouchableOpacity>

            <ThemedTextInput
              placeholder={transformText("Número")}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              style={styles.phoneInput}
              keyboardType="phone-pad"
            />
          </View>
          {isDropdownOpen && (
            <View style={styles.dropdownWrapper}>
              <ScrollView style={styles.countryCodeList}>
                {COUNTRY_CODES.map((country, index) => (
                  <TouchableOpacity
                    key={`${country.code}-${country.country}-${index}`}
                    style={[
                      styles.countryCodeItem,
                      index === COUNTRY_CODES.length - 1 &&
                        styles.countryCodeItemLast,
                    ]}
                    onPress={() => handleSelectCountryCode(country.code)}
                  >
                    <Text style={styles.countryFlag}>{country.flag}</Text>
                    <View style={styles.countryInfo}>
                      <Text style={styles.countryName}>{country.country}</Text>
                      <Text style={styles.countryCode}>{country.code}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      <SaveButton onPress={handleSave} bottom={isKeyboardVisible ? 300 : 40} />

      <ErrorModal
        visible={showErrorModal}
        title="Error"
        message={errorMessage}
        onClose={closeErrorModal}
      />
    </KeyboardAvoidingView>
  );
};

export default EmergencyContactScreen;
