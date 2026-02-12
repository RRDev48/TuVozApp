import * as Location from "expo-location";
import { useState } from "react";
import { Linking } from "react-native";
import { EmergencyProfile } from "../(services)/emergencyService";

export const useEmergencyActions = () => {
  const [sendingAlert, setSendingAlert] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const getLocation = async () => {
    try {
      // Solicitar permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMessage(
          "Se necesitan permisos de ubicación para enviar la alerta",
        );
        setShowErrorModal(true);
        return null;
      }

      // Obtener ubicación actual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return location;
    } catch (error) {
      console.error("Error obteniendo ubicación:", error);
      setErrorMessage("No se pudo obtener la ubicación");
      setShowErrorModal(true);
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
      setErrorMessage("No hay contacto de emergencia configurado");
      setShowErrorModal(true);
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
            setErrorMessage(
              "No se pudo abrir WhatsApp. Por favor verifica que esté instalado.",
            );
            setShowErrorModal(true);
          }
        }
      }
    } catch (error) {
      console.error("Error enviando alerta:", error);
      setErrorMessage("No se pudo enviar la alerta");
      setShowErrorModal(true);
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
    setShowErrorModal,
    errorMessage,
    showConfirmModal,
    setShowConfirmModal,
  };
};
