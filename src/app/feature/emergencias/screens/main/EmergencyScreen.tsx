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
import { EmergencyField } from "../../components/EmergencyField";

type EmergencyScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "Emergencias"
>;

const EmergencyScreen = () => {
  const navigation = useNavigation<EmergencyScreenNavigationProp>();
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

  const handleSaveEmergencyData = () => {
    Alert.alert(
      transformText("Datos guardados"),
      transformText(
        "La información de emergencia ha sido actualizada correctamente",
      ),
      [{ text: transformText("OK") }],
    );
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
      backgroundColor: colors.green,
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
      fontSize: 16,
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
        onPress={handleSaveEmergencyData}
      >
        <Ionicons
          name="save"
          size={24}
          color={colors.white}
          style={styles.emergencyIcon}
        />
        <CustomText style={styles.emergencyText}>
          {transformText("Guardar datos emergencia")}
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default EmergencyScreen;
