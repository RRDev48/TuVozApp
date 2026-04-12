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
import {
    DEFAULT_EMERGENCY_FORM_DATA,
    EmergencyFormData,
} from "../../models/emergency.types";

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

  const [formData, setFormData] = useState<EmergencyFormData>(
    DEFAULT_EMERGENCY_FORM_DATA,
  );

  const fromSettings = route.params?.fromSettings;

  useEffect(() => {
    if (profile) {
      setFormData({
        blood_type: profile.blood_type || "",
        allergies: profile.allergies || "",
        medications: profile.medications || "",
        address: profile.address || "",
        alert_type:
          profile.alert_type || DEFAULT_EMERGENCY_FORM_DATA.alert_type,
        emergency_contact_name: profile.emergency_contact_name || "",
        emergency_contact_phone: profile.emergency_contact_phone || "",
        notes: profile.notes || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (!loading && profile && !fromSettings) {
      const isProfileComplete =
        profile.blood_type &&
        profile.emergency_contact_name &&
        profile.emergency_contact_phone &&
        profile.alert_type;

      if (isProfileComplete) {
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

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    setFormData(DEFAULT_EMERGENCY_FORM_DATA);
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
