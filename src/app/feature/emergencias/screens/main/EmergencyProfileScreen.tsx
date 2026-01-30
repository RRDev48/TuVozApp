import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Location from "expo-location";
import { useState } from "react";
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
  const [sendingAlert, setSendingAlert] = useState(false);

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

  const getLocation = async () => {
    try {
      // Solicitar permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          transformText("Error"),
          transformText(
            "Se necesitan permisos de ubicación para enviar la alerta",
          ),
        );
        return null;
      }

      // Obtener ubicación actual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return location;
    } catch (error) {
      console.error("Error obteniendo ubicación:", error);
      Alert.alert(
        transformText("Error"),
        transformText("No se pudo obtener la ubicación"),
      );
      return null;
    }
  };

  const handleSendAlert = async () => {
    const alertType = profile?.alert_type || "call";
    const phone = profile?.emergency_contact_phone || "";

    if (!phone) {
      Alert.alert(
        transformText("Error"),
        transformText("No hay contacto de emergencia configurado"),
      );
      return;
    }

    setSendingAlert(true);

    try {
      if (alertType === "call") {
        // Llamada al contacto de emergencia
        await Linking.openURL(`tel:${phone}`);
      } else if (alertType === "whatsapp_location") {
        // Obtener ubicación
        const location = await getLocation();

        if (!location) {
          setSendingAlert(false);
          return;
        }

        const { latitude, longitude } = location.coords;
        const contactName = profile?.emergency_contact_name || "Contacto";
        const userName = userFullName || "Usuario";

        // Crear mensaje con ubicación
        const message = `🚨 ¡ALERTA DE EMERGENCIA! 🚨\n\n${userName} necesita ayuda urgente.\n\n📍 Mi ubicación actual:\nhttps://maps.google.com/?q=${latitude},${longitude}\n\n${profile?.notes ? `Información adicional: ${profile.notes}` : ""}`;

        // Remover el símbolo + del número para WhatsApp
        const whatsappPhone = phone.replace(/\+/g, "");

        const url = `whatsapp://send?phone=${whatsappPhone}&text=${encodeURIComponent(message)}`;

        try {
          await Linking.openURL(url);
        } catch (urlError) {
          // Si falla con whatsapp://, intentar con https://wa.me/
          const waUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
          try {
            await Linking.openURL(waUrl);
          } catch (waError) {
            Alert.alert(
              transformText("Error"),
              transformText(
                "No se pudo abrir WhatsApp. Por favor verifica que esté instalado.",
              ),
            );
          }
        }
      }
    } catch (error) {
      console.error("Error enviando alerta:", error);
      Alert.alert(
        transformText("Error"),
        transformText("No se pudo enviar la alerta"),
      );
    } finally {
      setSendingAlert(false);
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
              <CustomText style={styles.alertButtonText}>
                {transformText("Enviar Alerta")}
              </CustomText>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EmergencyProfileScreen;
