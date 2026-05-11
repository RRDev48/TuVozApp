import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
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
import SkeletonText from "@/src/app/components/common/SkeletonText";
import SkeletonButton from "@/src/app/components/common/SkeletonButton";

type EmergencyProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "EmergencyProfile"
>;

const EmergencyProfileScreen = () => {
  const { t } = useLanguageRefresh();
  const navigation = useNavigation<EmergencyProfileScreenNavigationProp>();
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: themedColors.background,
        },
        content: {
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 140,
        },
        loadingContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        section: {
          backgroundColor: themedColors.primary,
          borderRadius: 16,
          padding: 14,
          marginBottom: 10,
        },
        sectionTitle: {
          fontSize: 14,
          fontWeight: "700",
          color: themedColors.secondary,
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          opacity: 0.8,
        },
        infoRow: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 7,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: themedColors.secondary + "33",
        },
        infoRowLast: {
          borderBottomWidth: 0,
          paddingBottom: 0,
        },
        infoRowStacked: {
          flexDirection: "column",
          alignItems: "flex-start",
          paddingVertical: 7,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: themedColors.secondary + "33",
        },
        infoRowStackedLast: {
          borderBottomWidth: 0,
          paddingBottom: 0,
        },
        infoLabelRow: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 4,
        },
        infoLabel: {
          fontSize: 14,
          fontWeight: "600",
          color: themedColors.secondary,
          marginLeft: 8,
          opacity: 0.8,
        },
        infoValue: {
          fontSize: 16,
          color: themedColors.secondary,
          marginLeft: 8,
          flex: 1,
          textAlign: "right",
        },
        infoValueStacked: {
          fontSize: 15,
          color: themedColors.secondary,
          marginLeft: 28,
          marginTop: 2,
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
          backgroundColor: colors.green,
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
        emptyStateContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 30,
          backgroundColor: themedColors.background,
        },
        emptyStateIcon: {
          marginBottom: 20,
          opacity: 0.8,
        },
        emptyStateTitle: {
          fontSize: 22,
          fontWeight: "bold",
          color: themedColors.text,
          textAlign: "center",
          marginBottom: 12,
        },
        emptyStateMessage: {
          fontSize: 16,
          color: themedColors.text,
          textAlign: "center",
          opacity: 0.7,
          lineHeight: 24,
          marginBottom: 30,
        },
        goToSettingsButton: {
          backgroundColor: themedColors.secondary,
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        },
        goToSettingsButtonText: {
          color: themedColors.primary,
          fontSize: 16,
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

  const handleSendAlert = () => {
    if (profile) {
      sendAlert(profile, profileFullName || undefined);
    }
  };

  const renderSkeletonProfile = () => (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />
      <ScreenTitle text={t("emergencyProfile")} />
      <View style={styles.content}>
        {/* Section 1 Skeleton */}
        <View style={styles.section}>
          <SkeletonText width={100} height={14} marginBottom={12} />
          <View style={styles.infoRowLast}>
            <SkeletonText width={200} height={18} />
          </View>
        </View>

        {/* Section 2 Skeleton */}
        <View style={styles.section}>
          <SkeletonText width={120} height={14} marginBottom={12} />
          <View style={styles.infoRow}>
            <SkeletonText width={150} height={16} />
          </View>
          <View style={styles.infoRow}>
            <SkeletonText width={180} height={16} />
          </View>
          <View style={styles.infoRowLast}>
            <SkeletonText width={160} height={16} />
          </View>
        </View>

        {/* Section 3 Skeleton */}
        <View style={styles.section}>
          <SkeletonText width={140} height={14} marginBottom={12} />
          <View style={styles.infoRow}>
            <SkeletonText width={170} height={16} />
          </View>
          <View style={styles.infoRowLast}>
            <SkeletonText width={190} height={16} />
          </View>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <View style={{ marginBottom: 12 }}>
          <SkeletonButton height={56} borderRadius={16} />
        </View>
        <SkeletonButton height={56} borderRadius={16} />
      </View>
    </View>
  );

  if (loading) {
    return renderSkeletonProfile();
  }

  const isProfileComplete = !!(
    profile?.blood_type &&
    profile?.emergency_contact_name &&
    profile?.emergency_contact_phone &&
    profile?.alert_type
  );

  if (!isProfileComplete) {
    return (
      <View style={styles.emptyStateContainer}>
        <BackButton onPress={() => navigation.goBack()} />
        <Ionicons
          name="alert-circle-outline"
          size={80}
          color={themedColors.secondary}
          style={styles.emptyStateIcon}
        />
        <Text style={styles.emptyStateTitle}>{t("noEmergencyDataTitle") || "Sin datos de emergencia"}</Text>
        <Text style={styles.emptyStateMessage}>
          {t("noEmergencyDataMessage") ||
            "No tienes datos de emergencia cargados. Por favor, configúralos en la sección de Ajustes para estar protegido."}
        </Text>
        <TouchableOpacity
          style={styles.goToSettingsButton}
          onPress={() => navigation.navigate("Ajustes")}
        >
          <Ionicons name="settings-outline" size={20} color={themedColors.primary} />
          <Text style={styles.goToSettingsButtonText}>{t("goToSettings") || "Ir a Ajustes"}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />

      <ScreenTitle text={t("emergencyProfile")} />

      <View style={styles.content}>
        {/* Nombre */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('name')}</Text>
          <View style={[styles.infoRow, styles.infoRowLast]}>
            <Ionicons name="person" size={20} color={themedColors.secondary} />
            <Text style={styles.infoValue}>{profileFullName}</Text>
          </View>
        </View>

        {/* Información Médica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('medicalInfo')}
          </Text>

          <View style={styles.infoRow}>
            <Ionicons name="water" size={20} color={themedColors.secondary} />
            <Text style={styles.infoLabel}>
              {t('bloodType')}:
            </Text>
            <Text style={styles.infoValue}>
              {profile?.blood_type || t('notConfigured')}
            </Text>
          </View>

          <View style={styles.infoRowStacked}>
            <View style={styles.infoLabelRow}>
              <Ionicons
                name="warning"
                size={20}
                color={themedColors.secondary}
              />
              <Text style={styles.infoLabel}>{t('allergies')}:</Text>
            </View>
            <Text style={styles.infoValueStacked}>
              {profile?.allergies || t('none')}
            </Text>
          </View>

          <View style={[styles.infoRowStacked, styles.infoRowStackedLast]}>
            <View style={styles.infoLabelRow}>
              <Ionicons
                name="medical"
                size={20}
                color={themedColors.secondary}
              />
              <Text style={styles.infoLabel}>
                {t('medications')}:
              </Text>
            </View>
            <Text style={styles.infoValueStacked}>
              {profile?.medications || t('none')}
            </Text>
          </View>
        </View>

        {/* Notas y Dirección */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('notesAndAddress')}
          </Text>

          <View style={styles.infoRowStacked}>
            <View style={styles.infoLabelRow}>
              <Ionicons
                name="document-text"
                size={20}
                color={themedColors.secondary}
              />
              <Text style={styles.infoLabel}>{t('notes')}:</Text>
            </View>
            <Text style={styles.infoValueStacked}>
              {profile?.notes || t('noNotes')}
            </Text>
          </View>

          <View style={[styles.infoRowStacked, styles.infoRowStackedLast]}>
            <View style={styles.infoLabelRow}>
              <Ionicons name="home" size={20} color={themedColors.secondary} />
              <Text style={styles.infoLabel}>
                {t('address')}:
              </Text>
            </View>
            <Text style={styles.infoValueStacked}>
              {profile?.address || t('notConfigured')}
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
            {t('emergency911')}
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
                {t('sendAlert')}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <ErrorModal
        visible={showErrorModal}
        title={t('error')}
        message={errorMessage}
        onClose={closeErrorModal}
      />

      <ConfirmationModal
        visible={showConfirmModal}
        title={t('emergencyCallConfirm')}
        confirmText={t('call')}
        cancelText={t('cancel')}
        onConfirm={confirmEmergencyCall}
        onCancel={() => setShowConfirmModal(false)}
      />
    </View>
  );
};

export default EmergencyProfileScreen;
