import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useEmergencyProfile } from "../../(hooks)/useEmergencyProfile";
import BackButton from "../../../components/BackButton";
import ScreenTitle from "../../../components/ScreenTitle";
import CancelConfirmationModal from "../../components/alerts/CancelConfirmationModal";
import EmergencySuccessModal from "../../components/alerts/EmergencySuccessModal";
import { EmergencyField } from "../../components/EmergencyField";

type EmergencyScreen2NavigationProp = StackNavigationProp<
  RootStackParamsList,
  "EmergenciasParte2"
>;

const EmergencyScreen2 = () => {
  const navigation = useNavigation<EmergencyScreen2NavigationProp>();
  const { getThemedColors, transformText } = usePersonalization();
  const themedColors = getThemedColors();
  const { profile, loading, updateField, clearProfile } = useEmergencyProfile();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const handleNotesEdit = () => {
    navigation.navigate("NotesSelection", {
      currentNotes: profile?.notes || "",
      onSelect: async (notes: string) => {
        try {
          await updateField("notes", notes);
          console.log("Notas actualizadas:", notes);
        } catch (error) {
          console.error("Error al actualizar notas:", error);
          Alert.alert(
            transformText("Error"),
            transformText(
              error instanceof Error
                ? error.message
                : "No se pudo actualizar las notas",
            ),
          );
        }
      },
    });
  };

  const handleEmergencyContactEdit = () => {
    // Extraer código de país y número del phone completo
    const fullPhone = profile?.emergency_contact_phone || "";
    const countryCodeMatch = fullPhone.match(/^(\+\d+)/);
    const countryCode = countryCodeMatch ? countryCodeMatch[1] : "+52";
    const phoneNumber = fullPhone.replace(countryCode, "");

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

  const handleSaveEmergencyData = () => {
    setShowSuccessModal(true);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Navegar directamente al Home
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

  const handleConfirmCancel = async () => {
    try {
      await clearProfile();
      setShowCancelModal(false);
      navigation.navigate("Emergencias");
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

  const styles = StyleSheet.create({
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
  });

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
          value={profile?.notes || ""}
          onPress={handleNotesEdit}
        />

        <EmergencyField
          icon={
            <Ionicons name="home" size={26} color={themedColors.background} />
          }
          label="Dirección"
          value={profile?.address || ""}
          onPress={handleAddressEdit}
        />

        <EmergencyField
          icon={
            <Ionicons name="call" size={26} color={themedColors.background} />
          }
          label="Contacto de emergencia"
          value={
            profile?.emergency_contact_name && profile?.emergency_contact_phone
              ? `${profile.emergency_contact_name} - ${profile.emergency_contact_phone}`
              : profile?.emergency_contact_name ||
                profile?.emergency_contact_phone ||
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
          value={getAlertTypeLabel(profile?.alert_type)}
          onPress={handleAlertTypeEdit}
        />
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <CustomText style={styles.cancelButtonText}>
            {transformText("Cancelar")}
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveEmergencyData}
        >
          <CustomText style={styles.saveButtonText}>
            {transformText("Guardar datos")}
          </CustomText>
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
    </View>
  );
};

export default EmergencyScreen2;
