import { useCallback, useState } from "react";
import { auditLogService } from "../(services)/auditLogService";
import { supportService } from "../(services)/supportService";
import { useErrorHandling } from "./useErrorHandling";

export const useSupportForm = (navigation: any) => {
  const [subject, setSubject] = useState("");
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Usar el hook de error handling con auditoría habilitada
  const {
    showErrorModal,
    setShowErrorModal,
    errorMessage,
    logAndShowValidationError,
    logAndShowServerError,
    closeErrorModal,
  } = useErrorHandling({
    source: "support_form",
    enableAuditLogging: true,
  });

  const handleSubmit = useCallback(async () => {
    if (!subject.trim() || !query.trim()) {
      logAndShowValidationError("Por favor completa todos los campos");
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
        // Log de auditoría para ticket creado
        try {
          await auditLogService.logSupportTicketCreated(
            response.data?.id || "unknown",
            subject.trim(),
          );
        } catch (auditError) {
          console.warn("Failed to log audit event:", auditError);
        }

        // Resetear campos
        setSubject("");
        setQuery("");
        // Mostrar mensaje de éxito
        setShowSuccessModal(true);
      } else {
        // Log del error con contexto
        const errorContext = {
          subject: subject.trim(),
          queryLength: query.trim().length,
          response_error: response.error,
        };

        logAndShowServerError(
          new Error(response.error || "Failed to create support ticket"),
          errorContext,
        );
      }
    } catch (error: any) {
      // Log del error de excepción
      const errorContext = {
        subject: subject.trim(),
        queryLength: query.trim().length,
        error_type: "exception",
      };

      logAndShowServerError(error, errorContext);
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
    setShowErrorModal: closeErrorModal,
    errorMessage,
  };
};
