import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEmergencyProfile } from "../../(hooks)/useEmergencyProfile";
import { useEmergencyScreenStyles } from "../../(hooks)/useEmergencyScreensStyles";
import { parsePhoneNumber } from "../../(services)/phoneParser";
import BackButton from "../../../components/BackButton";
import ScreenTitle from "../../../components/ScreenTitle";
import CancelConfirmationModal from "../../components/alerts/CancelConfirmationModal";
import { EmergencyField } from "../../components/EmergencyField";

type EmergencyScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "Emergencias"
>;

type EmergencyScreenRouteProp = RouteProp<RootStackParamsList, "Emergencias">;

const EmergencyScreen = () => {
  const navigation = useNavigation<EmergencyScreenNavigationProp>();
  const route = useRoute<EmergencyScreenRouteProp>();
  const { transformText, getThemedColors } = usePersonalization();
  const styles = useEmergencyScreenStyles();
  const themedColors = getThemedColors();
  const { profile, userFullName, loading, updateField, clearProfile } =
    useEmergencyProfile();
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Obtener el parámetro fromSettings
  const fromSettings = route.params?.fromSettings;

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
      currentBloodType: profile?.blood_type || "O-",
      onSelect: async (bloodType: string) => {
        try {
          await updateField("blood_type", bloodType);
          console.log("Tipo de sangre actualizado:", bloodType);
        } catch (error) {
          console.error("Error al actualizar tipo de sangre:", error);
          Alert.alert(
            transformText("Error"),
            transformText(
              error instanceof Error
                ? error.message
                : "No se pudo actualizar el tipo de sangre",
            ),
          );
        }
      },
    });
  };

  const handleAllergiesEdit = () => {
    navigation.navigate("AllergiesSelection", {
      currentAllergies: profile?.allergies || "",
      onSelect: async (allergies: string) => {
        try {
          await updateField("allergies", allergies);
          console.log("Alergias actualizadas:", allergies);
        } catch (error) {
          console.error("Error al actualizar alergias:", error);
          Alert.alert(
            transformText("Error"),
            transformText(
              error instanceof Error
                ? error.message
                : "No se pudo actualizar las alergias",
            ),
          );
        }
      },
    });
  };

  const handleMedicationsEdit = () => {
    navigation.navigate("MedicationsSelection", {
      currentMedications: profile?.medications || "",
      onSelect: async (medications: string) => {
        try {
          await updateField("medications", medications);
          console.log("Medicaciones actualizadas:", medications);
        } catch (error) {
          console.error("Error al actualizar medicaciones:", error);
          Alert.alert(
            transformText("Error"),
            transformText(
              error instanceof Error
                ? error.message
                : "No se pudo actualizar las medicaciones",
            ),
          );
        }
      },
    });
  };

  const handleAddressEdit = () => {
    navigation.navigate("AddressSelection", {
      currentAddress: profile?.address || "",
      onSelect: async (address: string) => {
        try {
          await updateField("address", address);
          console.log("Dirección actualizada:", address);
        } catch (error) {
          console.error("Error al actualizar dirección:", error);
          Alert.alert(
            transformText("Error"),
            transformText(
              error instanceof Error
                ? error.message
                : "No se pudo actualizar la dirección",
            ),
          );
        }
      },
    });
  };

  const handleAlertTypeEdit = () => {
    navigation.navigate("AlertModeSelection", {
      currentAlertMode: profile?.alert_type || "call",
      onSelect: async (alertMode: string) => {
        try {
          await updateField("alert_type", alertMode);
          console.log("Modo de alerta actualizado:", alertMode);
        } catch (error) {
          console.error("Error al actualizar modo de alerta:", error);
          Alert.alert(
            transformText("Error"),
            transformText(
              error instanceof Error
                ? error.message
                : "No se pudo actualizar el modo de alerta",
            ),
          );
        }
      },
    });
  };

  const handleEmergencyContactEdit = () => {
    const fullPhone = profile?.emergency_contact_phone || "";
    const { countryCode, phoneNumber } = parsePhoneNumber(fullPhone);

    navigation.navigate("EmergencyContactSelection", {
      currentContactName: profile?.emergency_contact_name || "",
      currentCountryCode: countryCode,
      currentPhoneNumber: phoneNumber,
      onSelect: async (name: string, phone: string) => {
        try {
          await updateField("emergency_contact_name", name);
          await updateField("emergency_contact_phone", phone);
          console.log("Contacto de emergencia actualizado:", name, phone);
        } catch (error) {
          console.error("Error al actualizar contacto de emergencia:", error);
          Alert.alert(
            transformText("Error"),
            transformText(
              error instanceof Error
                ? error.message
                : "No se pudo actualizar el contacto de emergencia",
            ),
          );
        }
      },
    });
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await clearProfile();
      setShowCancelModal(false);
      navigation.goBack();
    } catch (error) {
      setShowCancelModal(false);
      Alert.alert(
        transformText("Error"),
        transformText("No se pudo cancelar la configuración"),
      );
    }
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
          value={userFullName}
          showArrow={false}
        />

        <EmergencyField
          icon={
            <Ionicons name="water" size={26} color={themedColors.background} />
          }
          label="Tipo de sangre"
          value={profile?.blood_type || ""}
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
          value={profile?.allergies || ""}
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
          value={profile?.medications || ""}
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
          onPress={() => navigation.navigate("EmergenciasParte2")}
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
