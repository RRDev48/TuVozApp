import { useCallback, useState } from "react";
import { auditLogService } from "../services/auditLog.Service";

interface UseErrorHandlingOptions {
  source?: string;
  enableAuditLogging?: boolean;
}

type ErrorContext = Record<string, unknown>;

export const useErrorHandling = (options: UseErrorHandlingOptions = {}) => {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLogging, setIsLogging] = useState(false);

  const logAndShowError = useCallback(
    async (
      errorMessage: string,
      error?: Error,
      context?: ErrorContext,
      severity: "info" | "warning" | "error" | "critical" = "error",
    ) => {
      setIsLogging(true);

      try {
        setErrorMessage(errorMessage);
        setShowErrorModal(true);

        if (options.enableAuditLogging) {
          await auditLogService.logEventSafe({
            event_type: auditLogService.events.ERROR_OCCURRED,
            severity,
            description: errorMessage,
            metadata: {
              ...context,
              ...(error
                ? {
                    error_name: error.name,
                    error_message: error.message,
                    stack_trace: error.stack,
                  }
                : {}),
            },
            source: options.source,
          });
        }
      } catch (logError) {
      } finally {
        setIsLogging(false);
      }
    },
    [options.source, options.enableAuditLogging],
  );

  const logAndShowValidationError = useCallback(
    (message: string) => {
      logAndShowError(message, undefined, { type: "validation" }, "warning");
    },
    [logAndShowError],
  );

  const logAndShowNetworkError = useCallback(
    (error: Error, context?: ErrorContext) => {
      logAndShowError(
        "Error de conexión. Por favor verifica tu conexión a internet.",
        error,
        { ...context, type: "network" },
        "error",
      );
    },
    [logAndShowError],
  );

  const logAndShowServerError = useCallback(
    (error: Error, context?: ErrorContext) => {
      logAndShowError(
        "Error del servidor. Por favor intenta nuevamente.",
        error,
        { ...context, type: "server" },
        "error",
      );
    },
    [logAndShowError],
  );

  const logAndShowCriticalError = useCallback(
    (error: Error, context?: ErrorContext) => {
      logAndShowError(
        "Ha ocurrido un error crítico. Por favor contacta al soporte.",
        error,
        { ...context, type: "critical" },
        "critical",
      );
    },
    [logAndShowError],
  );

  const closeErrorModal = useCallback(() => {
    setShowErrorModal(false);
    setErrorMessage("");
  }, []);

  return {
    showErrorModal,
    errorMessage,
    isLogging,
    logAndShowError,
    logAndShowValidationError,
    logAndShowNetworkError,
    logAndShowServerError,
    logAndShowCriticalError,
    closeErrorModal,
    setShowErrorModal,
    setErrorMessage,
  };
};
