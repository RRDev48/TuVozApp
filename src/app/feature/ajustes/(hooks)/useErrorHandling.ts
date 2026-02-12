import { useState, useCallback } from "react";
import { errorLogService } from "../(services)/errorLogService";
import { auditLogService } from "../(services)/auditLogService";

interface UseErrorHandlingOptions {
  source?: string;
  enableAuditLogging?: boolean;
}

export const useErrorHandling = (options: UseErrorHandlingOptions = {}) => {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLogging, setIsLogging] = useState(false);

  const logAndShowError = useCallback(async (
    errorMessage: string,
    error?: Error,
    context?: Record<string, any>,
    severity: "info" | "warning" | "error" | "critical" = "error"
  ) => {
    setIsLogging(true);
    
    try {
      // Mostrar el modal de error
      setErrorMessage(errorMessage);
      setShowErrorModal(true);

      // Log del error en paralelo
      const logPromises = [];

      // 1. Log en error_logs
      if (error) {
        logPromises.push(
          errorLogService.logErrorWithStack(
            errorMessage,
            error,
            options.source,
            context,
            severity
          )
        );
      } else {
        logPromises.push(
          errorLogService.logError({
            error_message: errorMessage,
            severity,
            source: options.source,
            context,
          })
        );
      }

      // 2. Log en audit_logs si está habilitado
      if (options.enableAuditLogging) {
        logPromises.push(
          auditLogService.logError(errorMessage, options.source, context)
        );
      }

      // Ejecutar logs en paralelo sin bloquear la UI
      await Promise.allSettled(logPromises);
    } catch (logError) {
      console.error("Failed to log error:", logError);
      // No fallar si el logging falla, pero sí mostrar el modal
    } finally {
      setIsLogging(false);
    }
  }, [options.source, options.enableAuditLogging]);

  const logAndShowValidationError = useCallback((message: string) => {
    logAndShowError(message, undefined, { type: "validation" }, "warning");
  }, [logAndShowError]);

  const logAndShowNetworkError = useCallback((error: Error, context?: Record<string, any>) => {
    logAndShowError(
      "Error de conexión. Por favor verifica tu conexión a internet.",
      error,
      { ...context, type: "network" },
      "error"
    );
  }, [logAndShowError]);

  const logAndShowServerError = useCallback((error: Error, context?: Record<string, any>) => {
    logAndShowError(
      "Error del servidor. Por favor intenta nuevamente.",
      error,
      { ...context, type: "server" },
      "error"
    );
  }, [logAndShowError]);

  const logAndShowCriticalError = useCallback((error: Error, context?: Record<string, any>) => {
    logAndShowError(
      "Ha ocurrido un error crítico. Por favor contacta al soporte.",
      error,
      { ...context, type: "critical" },
      "critical"
    );
  }, [logAndShowError]);

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