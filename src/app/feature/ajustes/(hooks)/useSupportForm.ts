import { useCallback, useState } from "react";
import { supportService } from "../(services)/supportService";

export const useSupportForm = (navigation: any) => {
  const [subject, setSubject] = useState("");
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = useCallback(async () => {
    if (!subject.trim() || !query.trim()) {
      setErrorMessage("Por favor completa todos los campos");
      setShowErrorModal(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await supportService.createTicket({
        subject: subject.trim(),
        message: query.trim(),
        priority: "normal",
      });

      if (response.success) {
        // Resetear campos
        setSubject("");
        setQuery("");
        // Mostrar mensaje de éxito primero
        setShowSuccessModal(true);
        // Navegar después de que se cierre el modal o después del autoCloseDelay
        // El modal está configurado con autoCloseDelay, así que navegará automáticamente
      } else {
        setErrorMessage(
          response.error || "No se pudo enviar tu consulta. Intenta de nuevo.",
        );
        setShowErrorModal(true);
      }
    } catch (error) {
      setErrorMessage("Ocurrió un error inesperado. Intenta de nuevo.");
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [subject, query, navigation]);

  const handleSuccessModalClose = useCallback(() => {
    setShowSuccessModal(false);
    // Navegar hacia atrás después de cerrar el modal
    navigation.goBack();
  }, [navigation]);

  return {
    subject,
    setSubject,
    query,
    setQuery,
    isSubmitting,
    handleSubmit,
    showSuccessModal,
    setShowSuccessModal,
    handleSuccessModalClose,
    showErrorModal,
    setShowErrorModal,
    errorMessage,
  };
};
