import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
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
import { useEmergencyProfile } from "../(hooks)/useEmergencyProfile";
import { EmergencyField } from "../components/EmergencyField";

const EmergencyScreen = () => {
  const navigation = useNavigation();
  const { getThemedColors, transformText, getFontSize } = usePersonalization();
  const themedColors = getThemedColors();
  const { profile, userFullName, loading, updateField } = useEmergencyProfile();
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleEdit = (fieldName: string, currentValue: string) => {
    Alert.prompt(
      transformText(getFieldLabel(fieldName)),
      transformText("Ingrese el nuevo valor"),
      [
        {
          text: transformText("Cancelar"),
          style: "cancel",
        },
        {
          text: transformText("Guardar"),
          onPress: async (value?: string) => {
            if (value !== undefined) {
              try {
                await updateField(
                  fieldName as keyof Omit<
                    typeof profile,
                    "id" | "user_id" | "full_name" | "created_at" | "updated_at"
                  >,
                  value,
                );
              } catch (error) {
                Alert.alert(
                  transformText("Error"),
                  transformText("No se pudo actualizar el campo"),
                );
              }
            }
          },
        },
      ],
      "plain-text",
      currentValue || "",
    );
  };

  const handleAlertTypeEdit = () => {
    Alert.alert(
      transformText("Modo de alerta"),
      transformText("Seleccione el tipo de alerta"),
      [
        {
          text: transformText("Cancelar"),
          style: "cancel",
        },
        {
          text: transformText("Llamada"),
          onPress: async () => {
            try {
              await updateField("alert_type", "call");
            } catch (error) {
              Alert.alert(
                transformText("Error"),
                transformText("No se pudo actualizar"),
              );
            }
          },
        },
        {
          text: transformText("WhatsApp con ubicación"),
          onPress: async () => {
            try {
              await updateField("alert_type", "whatsapp_location");
            } catch (error) {
              Alert.alert(
                transformText("Error"),
                transformText("No se pudo actualizar"),
              );
            }
          },
        },
      ],
    );
  };

  const handleEmergencyCall = () => {
    if (!profile?.emergency_contact_phone) {
      Alert.alert(
        transformText("Error"),
        transformText("No hay número de contacto de emergencia configurado"),
      );
      return;
    }

    if (profile.alert_type === "call") {
      // Realizar llamada
      Linking.openURL(`tel:${profile.emergency_contact_phone}`);
    } else {
      // Abrir WhatsApp con ubicación
      const message = encodeURIComponent(
        `¡EMERGENCIA! ${userFullName} necesita ayuda urgente.`,
      );
      Linking.openURL(
        `whatsapp://send?phone=${profile.emergency_contact_phone}&text=${message}`,
      );
    }
  };

  const getFieldLabel = (field: string): string => {
    const labels: { [key: string]: string } = {
      blood_type: "Tipo de sangre",
      allergies: "Alergias",
      medications: "Medicaciones",
      notes: "Notas",
      address: "Dirección",
      emergency_contact_name: "Nombre de contacto",
      emergency_contact_phone: "Número de contacto",
      alert_type: "Modo de alerta",
    };
    return labels[field] || field;
  };

  const getAlertTypeLabel = (alertType?: string): string => {
    if (alertType === "call") return "Llamada";
    if (alertType === "whatsapp_location") return "WhatsApp con ubicación";
    return "No configurado";
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themedColors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 10,
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    backText: {
      fontSize: 16,
      fontWeight: "600",
      color: themedColors.text,
      marginLeft: 4,
    },
    titleContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 30,
      fontWeight: "bold",
      textAlign: "center",
      color: themedColors.primary,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 100,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emergencyButton: {
      position: "absolute",
      bottom: 20,
      left: 20,
      right: 20,
      backgroundColor: colors.darkGray,
      borderRadius: 16,
      paddingVertical: 16,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    emergencyIcon: {
      marginRight: 10,
    },
    emergencyText: {
      color: colors.white,
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
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={themedColors.text} />
          <CustomText style={styles.backText}>
            {transformText("Atrás")}
          </CustomText>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <CustomText style={styles.headerTitle}>
          {transformText("Emergencias")}
        </CustomText>
      </View>

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
          onPress={() => handleEdit("blood_type", profile?.blood_type || "")}
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
          onPress={() => handleEdit("allergies", profile?.allergies || "")}
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
          onPress={() => handleEdit("medications", profile?.medications || "")}
        />

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
          onPress={() => handleEdit("notes", profile?.notes || "")}
        />

        <EmergencyField
          icon={
            <Ionicons name="home" size={26} color={themedColors.background} />
          }
          label="Dirección"
          value={profile?.address || ""}
          onPress={() => handleEdit("address", profile?.address || "")}
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
          showArrow={false}
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

      <TouchableOpacity
        style={styles.emergencyButton}
        onPress={handleEmergencyCall}
      >
        <Ionicons
          name="call"
          size={24}
          color={colors.white}
          style={styles.emergencyIcon}
        />
        <CustomText style={styles.emergencyText}>
          {transformText("Llamada de emergencia")}
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default EmergencyScreen;
