import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useEmergencyContactScreenStyles } from "../../(hooks)/useEmergencyScreensStyles";
import { COUNTRY_CODES } from "../../(services)/phoneParser";
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

const EmergencyContactScreen = () => {
  const navigation = useNavigation<EmergencyContactScreenNavigationProp>();
  const route = useRoute<EmergencyContactScreenRouteProp>();
  const { transformText, getThemedColors } = usePersonalization();
  const styles = useEmergencyContactScreenStyles();
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

      <SaveButton onPress={handleSave} />
    </View>
  );
};

export default EmergencyContactScreen;
