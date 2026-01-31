import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
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
  const { getThemedColors, transformText } = usePersonalization();
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
