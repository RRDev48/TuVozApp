import { useCallback, useState } from "react";
import { auditLogService } from "../services/auditLog.Service";
import { errorLogService } from "../services/errorLog.Service";

interface UseErrorHandlingOptions {
  source?: string;
  enableAuditLogging?: boolean;
}

export const useErrorHandling = (options: UseErrorHandlingOptions = {}) => {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLogging, setIsLogging] = useState(false);

  const logAndShowError = useCallback(
    async (
      errorMessage: string,
      error?: Error,
      context?: Record<string, any>,
      severity: "info" | "warning" | "error" | "critical" = "error",
    ) => {
      setIsLogging(true);

      try {
        setErrorMessage(errorMessage);
        setShowErrorModal(true);

        const logPromises = [];

        if (error) {
          logPromises.push(
            errorLogService.logErrorWithStack(
              errorMessage,
              error,
              options.source,
              context,
              severity,
            ),
          );
        } else {
          logPromises.push(
            errorLogService.logError({
              error_message: errorMessage,
              severity,
              source: options.source,
              context,
            }),
          );
        }

        if (options.enableAuditLogging) {
          logPromises.push(
            auditLogService.logError(errorMessage, options.source, context),
          );
        }

        await Promise.allSettled(logPromises);
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
    (error: Error, context?: Record<string, any>) => {
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
    (error: Error, context?: Record<string, any>) => {
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
    (error: Error, context?: Record<string, any>) => {
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
