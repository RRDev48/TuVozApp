import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
    ActivityIndicator,
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { useEmergencyProfile } from "../../(hooks)/useEmergencyProfile";
import BackButton from "../../../components/BackButton";
import ScreenTitle from "../../../components/ScreenTitle";

type EmergencyProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "EmergencyProfile"
>;

const EmergencyProfileScreen = () => {
  const navigation = useNavigation<EmergencyProfileScreenNavigationProp>();
  const { getThemedColors, transformText, temaOscuro } = usePersonalization();
  const themedColors = getThemedColors();
  const { profile, userFullName, loading } = useEmergencyProfile();

  const handleEmergencyCall = () => {
    Alert.alert(
      transformText("Llamada de emergencia"),
      transformText("¿Deseas llamar al 911?"),
      [
        {
          text: transformText("Cancelar"),
          style: "cancel",
        },
        {
          text: transformText("Llamar"),
          onPress: () => {
            Linking.openURL("tel:911");
          },
        },
      ],
    );
  };

  const handleSendAlert = () => {
    const alertType = profile?.alert_type || "call";

    if (alertType === "call") {
      // Llamada al contacto de emergencia
      const phone = profile?.emergency_contact_phone || "";
      if (phone) {
        Linking.openURL(`tel:${phone}`);
      } else {
        Alert.alert(
          transformText("Error"),
          transformText("No hay contacto de emergencia configurado"),
        );
      }
    } else if (alertType === "whatsapp_location") {
      // WhatsApp con ubicación
      const phone = profile?.emergency_contact_phone?.replace(/\+/g, "") || "";
      if (phone) {
        // Aquí se podría agregar la lógica para obtener la ubicación y enviarla
        const message = `¡Emergencia! Necesito ayuda. ${profile?.notes || ""}`;
        Linking.openURL(
          `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`,
        );
      } else {
        Alert.alert(
          transformText("Error"),
          transformText("No hay contacto de emergencia configurado"),
        );
      }
    }
  };

  const styles = StyleSheet.create({
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
      backgroundColor: temaOscuro ? colors.white : colors.blue,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: temaOscuro ? colors.blue : colors.white,
      marginBottom: 12,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    infoLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: temaOscuro ? colors.blue : colors.white,
      marginLeft: 8,
    },
    infoValue: {
      fontSize: 14,
      color: temaOscuro ? colors.blue : colors.white,
      marginLeft: 8,
      flex: 1,
      textAlign: "right",
    },
    buttonsContainer: {
      position: "absolute",
      bottom: 40,
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

      <ScreenTitle text={transformText("Perfil de Emergencia")} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Nombre */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>
            {transformText("Nombre")}
          </CustomText>
          <View style={styles.infoRow}>
            <Ionicons
              name="person"
              size={20}
              color={temaOscuro ? colors.blue : colors.white}
            />
            <CustomText style={styles.infoValue}>{userFullName}</CustomText>
          </View>
        </View>

        {/* Información Médica */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>
            {transformText("Información Médica")}
          </CustomText>

          <View style={styles.infoRow}>
            <Ionicons
              name="water"
              size={20}
              color={temaOscuro ? colors.blue : colors.white}
            />
            <CustomText style={styles.infoLabel}>
              {transformText("Tipo de sangre:")}
            </CustomText>
            <CustomText style={styles.infoValue}>
              {profile?.blood_type || "No configurado"}
            </CustomText>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="warning"
              size={20}
              color={temaOscuro ? colors.blue : colors.white}
            />
            <CustomText style={styles.infoLabel}>
              {transformText("Alergias:")}
            </CustomText>
            <CustomText style={styles.infoValue}>
              {profile?.allergies || "Ninguna"}
            </CustomText>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="medical"
              size={20}
              color={temaOscuro ? colors.blue : colors.white}
            />
            <CustomText style={styles.infoLabel}>
              {transformText("Medicaciones:")}
            </CustomText>
            <CustomText style={styles.infoValue}>
              {profile?.medications || "Ninguna"}
            </CustomText>
          </View>
        </View>

        {/* Notas y Dirección */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>
            {transformText("Notas y Dirección")}
          </CustomText>

          <View style={styles.infoRow}>
            <Ionicons
              name="document-text"
              size={20}
              color={temaOscuro ? colors.blue : colors.white}
            />
            <CustomText style={styles.infoLabel}>
              {transformText("Notas:")}
            </CustomText>
            <CustomText style={styles.infoValue}>
              {profile?.notes || "Sin notas"}
            </CustomText>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="home"
              size={20}
              color={temaOscuro ? colors.blue : colors.white}
            />
            <CustomText style={styles.infoLabel}>
              {transformText("Dirección:")}
            </CustomText>
            <CustomText style={styles.infoValue}>
              {profile?.address || "No configurada"}
            </CustomText>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={handleEmergencyCall}
        >
          <Ionicons name="call" size={24} color={colors.white} />
          <CustomText style={styles.emergencyButtonText}>
            {transformText("Emergencia (911)")}
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.alertButton} onPress={handleSendAlert}>
          <Ionicons name="notifications" size={24} color={colors.white} />
          <CustomText style={styles.alertButtonText}>
            {transformText("Enviar Alerta")}
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EmergencyProfileScreen;
