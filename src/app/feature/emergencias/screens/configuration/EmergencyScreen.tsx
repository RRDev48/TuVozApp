import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../../../common/BackButton";
import ScreenTitle from "../../../common/ScreenTitle";
import CancelConfirmationModal from "../../components/alerts/CancelConfirmationModal";
import { EmergencyField } from "../../components/EmergencyField";
import { useEmergencyProfile } from "../../hooks/useEmergencyProfile";
import { parsePhoneNumber } from "../../services/phoneParser";

type EmergencyScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "Emergencias"
>;

type EmergencyScreenRouteProp = RouteProp<RootStackParamsList, "Emergencias">;

const EmergencyScreen = () => {
  const navigation = useNavigation<EmergencyScreenNavigationProp>();
  const route = useRoute<EmergencyScreenRouteProp>();
  const { transformText, getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: themedColors.background,
        },
        scrollContent: {
          padding: 20,
          paddingBottom: 120,
        },
        loadingContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        buttonsContainer: {
          position: "absolute",
          bottom: 40,
          left: 20,
          right: 20,
          flexDirection: "row",
          gap: 12,
        },
        cancelButton: {
          flex: 1,
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: colors.red,
          borderRadius: 16,
          paddingVertical: 16,
          alignItems: "center",
          justifyContent: "center",
        },
        cancelButtonText: {
          color: colors.red,
          fontSize: 18,
          fontWeight: "bold",
        },
        nextButton: {
          flex: 1,
          backgroundColor: colors.green,
          borderRadius: 16,
          paddingVertical: 16,
          alignItems: "center",
          justifyContent: "center",
        },
        nextButtonText: {
          color: colors.black,
          fontSize: 18,
          fontWeight: "bold",
        },
      }),
    [themedColors],
  );

  const { profile, profileFullName, loading } = useEmergencyProfile();
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Estado local para los datos del formulario
  const [formData, setFormData] = useState({
    blood_type: "",
    allergies: "",
    medications: "",
    address: "",
    alert_type: "call",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    notes: "",
  });

  // Obtener el parámetro fromSettings
  const fromSettings = route.params?.fromSettings;

  // Inicializar el estado local con los datos del perfil si existe
  useEffect(() => {
    if (profile) {
      setFormData({
        blood_type: profile.blood_type || "",
        allergies: profile.allergies || "",
        medications: profile.medications || "",
        address: profile.address || "",
        alert_type: profile.alert_type || "call",
        emergency_contact_name: profile.emergency_contact_name || "",
        emergency_contact_phone: profile.emergency_contact_phone || "",
        notes: profile.notes || "",
      });
    }
  }, [profile]);

  // Verificar si el perfil está completo y redirigir solo si NO viene de Settings
  useEffect(() => {
    if (!loading && profile && !fromSettings) {
      // Verificar si los campos principales están completos
      const isProfileComplete =
        profile.blood_type &&
        profile.emergency_contact_name &&
        profile.emergency_contact_phone &&
        profile.alert_type;

      if (isProfileComplete) {
        // Si el perfil está completo, redirigir a EmergencyProfileScreen
        navigation.replace("EmergencyProfile");
      }
    }
  }, [loading, profile, navigation, fromSettings]);

  const handleBloodTypeEdit = () => {
    navigation.navigate("BloodTypeSelection", {
      currentBloodType: formData.blood_type || "O-",
      onSelect: (bloodType: string) => {
        setFormData((prev) => ({ ...prev, blood_type: bloodType }));
      },
    });
  };

  const handleAllergiesEdit = () => {
    navigation.navigate("AllergiesSelection", {
      currentAllergies: formData.allergies || "",
      onSelect: (allergies: string) => {
        setFormData((prev) => ({ ...prev, allergies }));
      },
    });
  };

  const handleMedicationsEdit = () => {
    navigation.navigate("MedicationsSelection", {
      currentMedications: formData.medications || "",
      onSelect: (medications: string) => {
        setFormData((prev) => ({ ...prev, medications }));
      },
    });
  };

  const handleAddressEdit = () => {
    navigation.navigate("AddressSelection", {
      currentAddress: formData.address || "",
      onSelect: (address: string) => {
        setFormData((prev) => ({ ...prev, address }));
      },
    });
  };

  const handleAlertTypeEdit = () => {
    navigation.navigate("AlertModeSelection", {
      currentAlertMode: formData.alert_type || "call",
      onSelect: (alertMode: string) => {
        setFormData((prev) => ({ ...prev, alert_type: alertMode }));
      },
    });
  };

  const handleEmergencyContactEdit = () => {
    const fullPhone = formData.emergency_contact_phone || "";
    const { countryCode, phoneNumber } = parsePhoneNumber(fullPhone);

    navigation.navigate("EmergencyContactSelection", {
      currentContactName: formData.emergency_contact_name || "",
      currentCountryCode: countryCode,
      currentPhoneNumber: phoneNumber,
      onSelect: (name: string, phone: string) => {
        setFormData((prev) => ({
          ...prev,
          emergency_contact_name: name,
          emergency_contact_phone: phone,
        }));
      },
    });
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    // Limpiar el estado local
    setFormData({
      blood_type: "",
      allergies: "",
      medications: "",
      address: "",
      alert_type: "call",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      notes: "",
    });
    navigation.goBack();
  };

  const handleCancelModal = () => {
    setShowCancelModal(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />

      <ScreenTitle text={transformText("Emergencias")} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <EmergencyField
          icon={
            <Ionicons name="person" size={26} color={themedColors.background} />
          }
          label="Nombre completo"
          value={profileFullName}
          showArrow={false}
        />

        <EmergencyField
          icon={
            <Ionicons name="water" size={26} color={themedColors.background} />
          }
          label="Tipo de sangre"
          value={formData.blood_type || ""}
          onPress={handleBloodTypeEdit}
        />

        <EmergencyField
          icon={
            <Ionicons
              name="warning"
              size={26}
              color={themedColors.background}
            />
          }
          label="Alergias"
          value={formData.allergies || ""}
          onPress={handleAllergiesEdit}
        />

        <EmergencyField
          icon={
            <Ionicons
              name="medical"
              size={26}
              color={themedColors.background}
            />
          }
          label="Medicaciones"
          value={formData.medications || ""}
          onPress={handleMedicationsEdit}
        />
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>
            {transformText("Cancelar")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate("EmergenciasParte2", { formData })}
        >
          <Text style={styles.nextButtonText}>
            {transformText("Siguiente")}
          </Text>
        </TouchableOpacity>
      </View>

      <CancelConfirmationModal
        visible={showCancelModal}
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelModal}
      />
    </View>
  );
};

export default EmergencyScreen;
