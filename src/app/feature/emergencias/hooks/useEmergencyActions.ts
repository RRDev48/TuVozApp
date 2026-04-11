import { useErrorHandling } from "@/src/app/feature/ajustes/hooks/useErrorHandling";
import * as Location from "expo-location";
import { useState } from "react";
import { Linking } from "react-native";
import { EmergencyProfile } from "../services/emergency.Service";

function toError(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error;
  }

  return new Error(fallback);
}

export const useEmergencyActions = () => {
  const [sendingAlert, setSendingAlert] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { showErrorModal, errorMessage, logAndShowError, closeErrorModal } =
    useErrorHandling();

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        logAndShowError(
          "Se necesitan permisos de ubicación para enviar la alerta",
          new Error("Se necesitan permisos de ubicación para enviar la alerta"),
          {
            context: "location_permission_denied",
            metadata: { permission_status: status },
          },
        );
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return location;
    } catch (error) {
      const normalizedError = toError(error, "Error obteniendo ubicación");
      await logAndShowError(normalizedError.message, normalizedError, {
        context: "location_fetch_failed",
        metadata: { error_type: "location_retrieval" },
      });
      return null;
    }
  };

  const handleEmergencyCall = () => {
    setShowConfirmModal(true);
  };

  const confirmEmergencyCall = () => {
    setShowConfirmModal(false);
    Linking.openURL("tel:911");
  };

  const sendAlert = async (profile: EmergencyProfile, userName?: string) => {
    const alertType = profile?.alert_type || "call";
    const phone = profile?.emergency_contact_phone || "";

    if (!phone) {
      await logAndShowError(
        "No hay contacto de emergencia configurado",
        new Error("No hay contacto de emergencia configurado"),
        {
          context: "emergency_contact_missing",
          metadata: { profile_id: profile?.id, alert_type: alertType },
        },
      );
      return;
    }

    setSendingAlert(true);

    try {
      if (alertType === "call") {
        await Linking.openURL(`tel:${phone}`);
      } else if (alertType === "whatsapp_location") {
        const location = await getLocation();

        if (!location) {
          setSendingAlert(false);
          return;
        }

        const { latitude, longitude } = location.coords;
        const userDisplayName = userName || "Usuario";

        const message = `🚨 ¡ALERTA DE EMERGENCIA! 🚨\n\n${userDisplayName} necesita ayuda urgente.\n\n📍 Mi ubicación actual:\nhttps://maps.google.com/?q=${latitude},${longitude}\n\n${profile?.notes ? `Información adicional: ${profile.notes}` : ""}`;

        const whatsappPhone = phone.replace(/\+/g, "");

        const url = `whatsapp://send?phone=${whatsappPhone}&text=${encodeURIComponent(message)}`;

        try {
          await Linking.openURL(url);
        } catch (urlError) {
          const waUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
          try {
            await Linking.openURL(waUrl);
          } catch (waError) {
            await logAndShowError(
              "No se pudo abrir WhatsApp. Por favor verifica que esté instalado.",
              new Error(
                "No se pudo abrir WhatsApp. Por favor verifica que esté instalado.",
              ),
              {
                context: "whatsapp_open_failed",
                metadata: { phone, error_type: "whatsapp_unavailable" },
              },
            );
          }
        }
      }
    } catch (error) {
      const normalizedError = toError(error, "Error enviando alerta");
      await logAndShowError(normalizedError.message, normalizedError, {
        context: "emergency_alert_failed",
        metadata: { alert_type: alertType, phone, user_name: userName },
      });
    } finally {
      setSendingAlert(false);
    }
  };

  return {
    sendingAlert,
    handleEmergencyCall,
    confirmEmergencyCall,
    sendAlert,
    getLocation,
    showErrorModal,
    closeErrorModal,
    errorMessage,
    showConfirmModal,
    setShowConfirmModal,
  };
};
