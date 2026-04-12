import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { useErrorHandling } from "@/src/app/feature/ajustes/hooks/useErrorHandling";
import ErrorModal from "@/src/app/feature/common/alerts/ErrorModal";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useMemo, useState } from "react";
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
import EmergencySuccessModal from "../../components/alerts/EmergencySuccessModal";
import { EmergencyField } from "../../components/EmergencyField";
import { useEmergencyProfile } from "../../hooks/useEmergencyProfile";
import {
    DEFAULT_EMERGENCY_FORM_DATA,
    EmergencyAlertType,
    EmergencyFormData,
} from "../../models/emergency.types";
import { emergencyService } from "../../services/emergency.Service";
import { parsePhoneNumber } from "../../services/phoneParser";

type EmergencyScreen2NavigationProp = StackNavigationProp<
  RootStackParamsList,
  "EmergenciasParte2"
>;

type EmergencyScreen2RouteProp = RouteProp<
  RootStackParamsList,
  "EmergenciasParte2"
>;

function isEmergencyAlertType(value: string): value is EmergencyAlertType {
  return value === "call" || value === "whatsapp_location";
}

function normalizeAlertType(value?: string): EmergencyAlertType {
  return value && isEmergencyAlertType(value)
    ? value
    : DEFAULT_EMERGENCY_FORM_DATA.alert_type;
}

const EmergencyScreen2 = () => {
  const navigation = useNavigation<EmergencyScreen2NavigationProp>();
  const route = useRoute<EmergencyScreen2RouteProp>();
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
        saveButton: {
          flex: 1,
          backgroundColor: colors.green,
          borderRadius: 16,
          paddingVertical: 16,
          alignItems: "center",
          justifyContent: "center",
        },
        saveButtonText: {
          color: colors.black,
          fontSize: 18,
          fontWeight: "bold",
        },
      }),
    [themedColors],
  );

  const { profile, profileId, loading } = useEmergencyProfile();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { showErrorModal, errorMessage, logAndShowError, closeErrorModal } =
    useErrorHandling();

  const [formData, setFormData] = useState<EmergencyFormData>(
    route.params.formData,
  );

  const emergencyProfilePayload = {
    blood_type: formData.blood_type,
    allergies: formData.allergies || null,
    medications: formData.medications || null,
    address: formData.address || null,
    alert_type: normalizeAlertType(formData.alert_type),
    emergency_contact_name: formData.emergency_contact_name,
    emergency_contact_phone: formData.emergency_contact_phone,
    notes: formData.notes || null,
  };

  const handleAddressEdit = () => {
    navigation.navigate("AddressSelection", {
      currentAddress: formData.address || "",
      onSelect: (address: string) => {
        setFormData((prev) => ({ ...prev, address }));
      },
    });
  };

  const handleNotesEdit = () => {
    navigation.navigate("NotesSelection", {
      currentNotes: formData.notes || "",
      onSelect: (notes: string) => {
        setFormData((prev) => ({ ...prev, notes }));
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

  const handleAlertTypeEdit = () => {
    navigation.navigate("AlertModeSelection", {
      currentAlertMode: normalizeAlertType(formData.alert_type),
      onSelect: (alertMode: EmergencyAlertType) => {
        setFormData((prev) => ({
          ...prev,
          alert_type: normalizeAlertType(alertMode),
        }));
      },
    });
  };

  const handleSaveEmergencyData = async () => {
    setIsSaving(true);
    try {
      if (
        !formData.blood_type ||
        !formData.emergency_contact_name ||
        !formData.emergency_contact_phone ||
        !formData.alert_type
      ) {
        logAndShowError(
          transformText(
            "Por favor completa los campos obligatorios: tipo de sangre, contacto de emergencia y modo de alerta.",
          ),
          new Error("Campos obligatorios faltantes"),
          {
            context: "emergency_profile_validation_failed",
            metadata: {
              missing_blood_type: !formData.blood_type,
              missing_contact: !formData.emergency_contact_name,
              missing_alert_type: !formData.alert_type,
            },
          },
        );
        setIsSaving(false);
        return;
      }

      if (profile && profileId) {
        await emergencyService.updateEmergencyProfile(
          profileId,
          emergencyProfilePayload,
        );
      } else {
        if (!profileId) {
          throw new Error("No se encontró el ID del perfil");
        }

        const fullName = await emergencyService.getProfileFullName(profileId);

        await emergencyService.createEmergencyProfile({
          profile_id: profileId,
          full_name: fullName,
          ...emergencyProfilePayload,
        });
      }

      setShowSuccessModal(true);
    } catch (error) {
      await logAndShowError(
        error instanceof Error
          ? error.message
          : transformText("No se pudo guardar el perfil de emergencia"),
        error instanceof Error ? error : new Error("Profile save error"),
        {
          context: "emergency_profile_save_failed",
          metadata: {
            profile_exists: !!profile,
            profile_id: profileId,
            form_data: formData,
          },
        },
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigation.navigate("Home");
  };

  const getAlertTypeLabel = (alertType?: string): string => {
    if (alertType === "call") return "Llamada";
    if (alertType === "whatsapp_location") return "WhatsApp con ubicación";
    return "No configurado";
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    setFormData({
      ...DEFAULT_EMERGENCY_FORM_DATA,
    });
    navigation.navigate("Home");
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

      <ScreenTitle text={transformText("Emergencias (2/2)")} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <EmergencyField
          icon={
            <Ionicons
              name="document-text"
              size={26}
              color={themedColors.background}
            />
          }
          label="Notas"
          value={formData.notes || ""}
          onPress={handleNotesEdit}
        />

        <EmergencyField
          icon={
            <Ionicons name="home" size={26} color={themedColors.background} />
          }
          label="Dirección"
          value={formData.address || ""}
          onPress={handleAddressEdit}
        />

        <EmergencyField
          icon={
            <Ionicons name="call" size={26} color={themedColors.background} />
          }
          label="Contacto de emergencia"
          value={
            formData.emergency_contact_name && formData.emergency_contact_phone
              ? `${formData.emergency_contact_name} - ${formData.emergency_contact_phone}`
              : formData.emergency_contact_name ||
                formData.emergency_contact_phone ||
                ""
          }
          onPress={handleEmergencyContactEdit}
        />

        <EmergencyField
          icon={
            <Ionicons
              name="notifications"
              size={26}
              color={themedColors.background}
            />
          }
          label="Modo de alerta"
          value={getAlertTypeLabel(formData.alert_type)}
          onPress={handleAlertTypeEdit}
        />
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>
            {transformText("Cancelar")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, isSaving && { opacity: 0.7 }]}
          onPress={handleSaveEmergencyData}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>
              {transformText("Guardar datos")}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <CancelConfirmationModal
        visible={showCancelModal}
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelModal}
      />

      <EmergencySuccessModal
        visible={showSuccessModal}
        onClose={handleSuccessModalClose}
      />

      <ErrorModal
        visible={showErrorModal}
        title={transformText("Error")}
        message={errorMessage}
        onClose={closeErrorModal}
      />
    </View>
  );
};

export default EmergencyScreen2;
