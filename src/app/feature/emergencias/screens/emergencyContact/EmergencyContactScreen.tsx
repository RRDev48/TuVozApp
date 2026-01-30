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
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import BackButton from "../../../components/BackButton";
import ScreenTitle from "../../../components/ScreenTitle";
import SaveButton from "../../components/SaveButton";
import ThemedTextInput from "../../components/ThemedTextInput";

type EmergencyContactScreenRouteProp = RouteProp<
  RootStackParamsList,
  "EmergencyContactSelection"
>;
type EmergencyContactScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "EmergencyContactSelection"
>;

const COUNTRY_CODES = [
  { code: "+1", country: "Estados Unidos", flag: "🇺🇸" },
  { code: "+1", country: "Canadá", flag: "🇨🇦" },
  { code: "+52", country: "México", flag: "🇲🇽" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+55", country: "Brasil", flag: "🇧🇷" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+58", country: "Venezuela", flag: "🇻🇪" },
  { code: "+51", country: "Perú", flag: "🇵🇪" },
  { code: "+593", country: "Ecuador", flag: "🇪🇨" },
  { code: "+34", country: "España", flag: "🇪🇸" },
  { code: "+44", country: "Reino Unido", flag: "🇬🇧" },
  { code: "+33", country: "Francia", flag: "🇫🇷" },
  { code: "+49", country: "Alemania", flag: "🇩🇪" },
  { code: "+39", country: "Italia", flag: "🇮🇹" },
];

const EmergencyContactScreen = () => {
  const navigation = useNavigation<EmergencyContactScreenNavigationProp>();
  const route = useRoute<EmergencyContactScreenRouteProp>();
  const { getThemedColors, transformText, temaOscuro } = usePersonalization();
  const themedColors = getThemedColors();

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

  const handleSelectCountryCode = (code: string) => {
    setSelectedCountryCode(code);
    setIsDropdownOpen(false);
  };

  const handleSave = () => {
    if (contactName.trim() === "") {
      Alert.alert(
        transformText("Error"),
        transformText("Por favor ingrese el nombre del contacto"),
      );
      return;
    }

    if (phoneNumber.trim() === "") {
      Alert.alert(
        transformText("Error"),
        transformText("Por favor ingrese el número de teléfono"),
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
    return country || COUNTRY_CODES[2]; // Default to México
  };

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
      marginBottom: 15,
    },
    phoneContainer: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 30,
    },
    countryCodeButton: {
      backgroundColor: temaOscuro ? colors.white : themedColors.primary,
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
      color: temaOscuro ? colors.blue : colors.white,
      marginRight: 4,
    },
    phoneInput: {
      flex: 1,
      backgroundColor: temaOscuro ? colors.white : themedColors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 20,
      fontSize: 16,
      fontWeight: "bold",
      color: temaOscuro ? colors.blue : colors.white,
    },
    countryCodeList: {
      backgroundColor: temaOscuro ? colors.white : themedColors.primary,
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
      borderBottomColor: temaOscuro ? colors.blue : colors.white,
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
      color: temaOscuro ? colors.blue : colors.white,
      marginBottom: 2,
    },
    countryCode: {
      fontSize: 14,
      fontWeight: "bold",
      color: temaOscuro ? colors.blue : colors.white,
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
  });

  return (
    <View style={styles.container}>
      {isDropdownOpen && (
        <TouchableWithoutFeedback onPress={() => setIsDropdownOpen(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <BackButton onPress={() => navigation.goBack()} />

      <ScreenTitle text={transformText("Contacto de emergencia")} />

      <ScrollView style={styles.contentContainer}>
        <CustomText style={styles.sectionTitle}>
          {transformText("Nombre del contacto")}
        </CustomText>

        <ThemedTextInput
          placeholder={transformText("Nombre completo")}
          value={contactName}
          onChangeText={setContactName}
        />

        <CustomText style={styles.sectionTitle}>
          {transformText("Número de teléfono")}
        </CustomText>

        <View style={styles.phoneContainer}>
          <TouchableOpacity
            style={styles.countryCodeButton}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <CustomText style={styles.flagText}>
              {getSelectedCountry().flag}
            </CustomText>
            <CustomText style={styles.countryCodeText}>
              {selectedCountryCode}
            </CustomText>
            <Ionicons
              name={isDropdownOpen ? "chevron-up" : "chevron-down"}
              size={20}
              color={temaOscuro ? colors.blue : colors.white}
            />
          </TouchableOpacity>

          <ThemedTextInput
            placeholder={transformText("Número")}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.phoneInput}
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
                  <CustomText style={styles.countryFlag}>
                    {country.flag}
                  </CustomText>
                  <View style={styles.countryInfo}>
                    <CustomText style={styles.countryName}>
                      {country.country}
                    </CustomText>
                    <CustomText style={styles.countryCode}>
                      {country.code}
                    </CustomText>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      <SaveButton onPress={handleSave} />
    </View>
  );
};

export default EmergencyContactScreen;
