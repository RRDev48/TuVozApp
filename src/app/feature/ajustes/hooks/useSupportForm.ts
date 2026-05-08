import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCallback, useState } from "react";
import { auditLogService } from "../services/auditLog.Service";
import { supportService } from "../services/support.Service";
import { useErrorHandling } from "./useErrorHandling";

type SupportNavigation = StackNavigationProp<
  RootStackParamsList,
  "NewSupportEntryScreen"
> | StackNavigationProp<RootStackParamsList>;

function toError(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error;
  }

  return new Error(fallback);
}

export const useSupportForm = (navigation: SupportNavigation) => {
  const [subject, setSubject] = useState("");
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const {
    showErrorModal,
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

      if ("data" in response && response.success) {
        try {
          await auditLogService.logSupportTicketCreated(
            response.data.id || "unknown",
            subject.trim(),
          );
        } catch (auditError) {}

        setSubject("");
        setQuery("");
        setShowSuccessModal(true);
      } else {
        const errorContext = {
          subject: subject.trim(),
          queryLength: query.trim().length,
          response_error: "error" in response ? response.error : "Unknown error",
        };

        logAndShowServerError(
          new Error("error" in response ? response.error : "Failed to create support ticket"),
          errorContext,
        );
      }
    } catch (error: unknown) {
      const errorContext = {
        subject: subject.trim(),
        queryLength: query.trim().length,
        error_type: "exception",
      };

      logAndShowServerError(
        toError(error, "Error al crear el ticket de soporte"),
        errorContext,
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [subject, query, navigation]);

  const handleSuccessModalClose = useCallback(() => {
    setShowSuccessModal(false);
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
