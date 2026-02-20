import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import ConfirmationModal from "@/src/app/feature/common/alerts/ConfirmationModal";
import ErrorModal from "@/src/app/feature/common/alerts/ErrorModal";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../../../common/BackButton";
import ScreenTitle from "../../../common/ScreenTitle";
import { useEmergencyActions } from "../../hooks/useEmergencyActions";
import { useEmergencyProfile } from "../../hooks/useEmergencyProfile";

type EmergencyProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "EmergencyProfile"
>;

const EmergencyProfileScreen = () => {
  const navigation = useNavigation<EmergencyProfileScreenNavigationProp>();
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
          paddingBottom: 150,
        },
        loadingContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        section: {
          backgroundColor: themedColors.primary,
          borderRadius: 16,
          padding: 20,
          marginBottom: 5,
        },
        sectionTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.secondary,
          marginBottom: 12,
          textAlign: "center",
        },
        infoRow: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 8,
        },
        infoLabel: {
          fontSize: 16,
          fontWeight: "medium",
          color: themedColors.secondary,
          marginLeft: 8,
        },
        infoValue: {
          fontSize: 16,
          color: themedColors.secondary,
          marginLeft: 8,
          flex: 1,
          textAlign: "right",
        },
        buttonsContainer: {
          position: "absolute",
          bottom: 25,
          left: 20,
          right: 20,
          gap: 12,
        },
        emergencyButton: {
          backgroundColor: colors.red,
          borderRadius: 16,
          paddingVertical: 16,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 8,
        },
        emergencyButtonText: {
          color: colors.white,
          fontSize: 18,
          fontWeight: "bold",
        },
        alertButton: {
          backgroundColor: colors.blue,
          borderRadius: 16,
          paddingVertical: 16,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 8,
        },
        alertButtonText: {
          color: colors.white,
          fontSize: 18,
          fontWeight: "bold",
        },
      }),
    [themedColors],
  );

  const { profile, profileFullName, loading } = useEmergencyProfile();
  const {
    sendingAlert,
    handleEmergencyCall,
    confirmEmergencyCall,
    sendAlert,
    showErrorModal,
    closeErrorModal,
    errorMessage,
    showConfirmModal,
    setShowConfirmModal,
  } = useEmergencyActions();

  // Enviar alerta de emergencia al contacto configurado
  const handleSendAlert = () => {
    if (profile) {
      sendAlert(profile, profileFullName || undefined);
    }
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

      <ScreenTitle text={transformText("Perfil de Emergencia")} />

      <View style={styles.scrollContent}>
        {/* Nombre */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{transformText("Nombre")}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="person" size={20} color={themedColors.secondary} />
            <Text style={styles.infoValue}>{profileFullName}</Text>
          </View>
        </View>

        {/* Información Médica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {transformText("Información Médica")}
          </Text>

          <View style={styles.infoRow}>
            <Ionicons name="water" size={20} color={themedColors.secondary} />
            <Text style={styles.infoLabel}>
              {transformText("Tipo de sangre:")}
            </Text>
            <Text style={styles.infoValue}>
              {profile?.blood_type || "No configurado"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="warning" size={20} color={themedColors.secondary} />
            <Text style={styles.infoLabel}>{transformText("Alergias:")}</Text>
            <Text style={styles.infoValue}>
              {profile?.allergies || "Ninguna"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="medical" size={20} color={themedColors.secondary} />
            <Text style={styles.infoLabel}>
              {transformText("Medicaciones:")}
            </Text>
            <Text style={styles.infoValue}>
              {profile?.medications || "Ninguna"}
            </Text>
          </View>
        </View>

        {/* Notas y Dirección */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {transformText("Notas y Dirección")}
          </Text>

          <View style={styles.infoRow}>
            <Ionicons
              name="document-text"
              size={20}
              color={themedColors.secondary}
            />
            <Text style={styles.infoLabel}>{transformText("Notas:")}</Text>
            <Text style={styles.infoValue}>
              {profile?.notes || "Sin notas"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="home" size={20} color={themedColors.secondary} />
            <Text style={styles.infoLabel}>{transformText("Dirección:")}</Text>
            <Text style={styles.infoValue}>
              {profile?.address || "No configurada"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={handleEmergencyCall}
        >
          <Ionicons name="call" size={24} color={colors.white} />
          <Text style={styles.emergencyButtonText}>
            {transformText("Emergencia (911)")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.alertButton}
          onPress={handleSendAlert}
          disabled={sendingAlert}
        >
          {sendingAlert ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Ionicons name="notifications" size={24} color={colors.white} />
              <Text style={styles.alertButtonText}>
                {transformText("Enviar Alerta")}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <ErrorModal
        visible={showErrorModal}
        title="Error"
        message={errorMessage}
        onClose={closeErrorModal}
      />

      <ConfirmationModal
        visible={showConfirmModal}
        title={transformText("Llamada de emergencia ¿Deseas llamar al 911?")}
        confirmText={transformText("Llamar")}
        cancelText={transformText("Cancelar")}
        onConfirm={confirmEmergencyCall}
        onCancel={() => setShowConfirmModal(false)}
      />
    </View>
  );
};

export default EmergencyProfileScreen;
