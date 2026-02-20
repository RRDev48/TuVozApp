import { useErrorHandling } from "@/src/app/feature/ajustes/hooks/useErrorHandling";
import * as Location from "expo-location";
import { useState } from "react";
import { Linking } from "react-native";
import { EmergencyProfile } from "../services/emergency.Service";

export const useEmergencyActions = () => {
  const [sendingAlert, setSendingAlert] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { showErrorModal, errorMessage, logAndShowError, closeErrorModal } =
    useErrorHandling();

  const getLocation = async () => {
    try {
      // Solicitar permisos de ubicación
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

      // Obtener ubicación actual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return location;
    } catch (error) {
      console.error("Error obteniendo ubicación:", error);
      logAndShowError(
        (error as Error).message || "Error obteniendo ubicación",
        error as Error,
        {
          context: "location_fetch_failed",
          metadata: { error_type: "location_retrieval" },
        },
      );
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
      logAndShowError(
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
        const userDisplayName = userName || "Usuario";

        // Crear mensaje con ubicación
        const message = `🚨 ¡ALERTA DE EMERGENCIA! 🚨\n\n${userDisplayName} necesita ayuda urgente.\n\n📍 Mi ubicación actual:\nhttps://maps.google.com/?q=${latitude},${longitude}\n\n${profile?.notes ? `Información adicional: ${profile.notes}` : ""}`;

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
            logAndShowError(
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
      console.error("Error enviando alerta:", error);
      logAndShowError(
        (error as Error).message || "Error enviando alerta",
        error as Error,
        {
          context: "emergency_alert_failed",
          metadata: { alert_type: alertType, phone, user_name: userName },
        },
      );
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
