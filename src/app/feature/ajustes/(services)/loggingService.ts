import { auditLogService } from "./auditLogService";
import { errorLogService } from "./errorLogService";

/**
 * Servicio unificado para logging y auditoría
 * Combina error_logs y audit_logs en una interfaz simple
 */
export const loggingService = {
  /**
   * Log de errores con auditoría automática
   */
  async logError(
    errorMessage: string,
    error?: Error,
    source?: string,
    context?: Record<string, any>,
    severity: "info" | "warning" | "error" | "critical" = "error",
  ) {
    const logPromises = [];

    // 1. Log en error_logs
    if (error) {
      logPromises.push(
        errorLogService.logErrorWithStack(
          errorMessage,
          error,
          source,
          context,
          severity,
        ),
      );
    } else {
      logPromises.push(
        errorLogService.logError({
          error_message: errorMessage,
          severity,
          source,
          context,
        }),
      );
    }

    // 2. Log en audit_logs para errores críticos o errores
    if (severity === "critical" || severity === "error") {
      logPromises.push(auditLogService.logError(errorMessage, source, context));
    }

    // Ejecutar en paralelo
    const results = await Promise.allSettled(logPromises);

    // Retornar si al menos uno fue exitoso
    const hasSuccess = results.some((result) => result.status === "fulfilled");
    return { success: hasSuccess };
  },

  /**
   * Log de eventos de auditoría
   */
  async logAuditEvent(
    eventType: string,
    description?: string,
    metadata?: Record<string, any>,
  ) {
    return auditLogService.logEvent({
      event_type: eventType,
      event_description: description,
      metadata,
    });
  },

  /**
   * Funciones específicas para eventos comunes
   */
  support: {
    async logTicketCreated(ticketId: string, subject: string) {
      return auditLogService.logSupportTicketCreated(ticketId, subject);
    },
  },

  emergency: {
    async logAlertSent(contactPhone: string, alertType: string) {
      return auditLogService.logEmergencyAlertSent(contactPhone, alertType);
    },

    async logCallMade() {
      return auditLogService.logEmergencyCallMade();
    },
  },

  auth: {
    async logLogin() {
      return auditLogService.logEvent({
        event_type: auditLogService.events.LOGIN,
        event_description: "User logged in successfully",
      });
    },

    async logLogout() {
      return auditLogService.logEvent({
        event_type: auditLogService.events.LOGOUT,
        event_description: "User logged out",
      });
    },

    async logRegister(userEmail?: string) {
      return auditLogService.logEvent({
        event_type: auditLogService.events.REGISTER,
        event_description: "New user registered",
        metadata: userEmail ? { email: userEmail } : undefined,
      });
    },
  },

  profile: {
    async logUpdate(updatedFields: string[]) {
      return auditLogService.logProfileUpdate(updatedFields);
    },

    async logView() {
      return auditLogService.logEvent({
        event_type: auditLogService.events.PROFILE_VIEWED,
        event_description: "User viewed their profile",
      });
    },
  },

  /**
   * Funciones de conveniencia para tipos de error comunes
   */
  errors: {
    async logValidationError(
      message: string,
      source: string,
      context?: Record<string, any>,
    ) {
      return loggingService.logError(
        message,
        undefined,
        source,
        { ...context, type: "validation" },
        "warning",
      );
    },

    async logNetworkError(
      error: Error,
      source: string,
      context?: Record<string, any>,
    ) {
      return loggingService.logError(
        "Network error occurred",
        error,
        source,
        { ...context, type: "network" },
        "error",
      );
    },

    async logServerError(
      error: Error,
      source: string,
      context?: Record<string, any>,
    ) {
      return loggingService.logError(
        "Server error occurred",
        error,
        source,
        { ...context, type: "server" },
        "error",
      );
    },

    async logCriticalError(
      error: Error,
      source: string,
      context?: Record<string, any>,
    ) {
      return loggingService.logError(
        "Critical error occurred",
        error,
        source,
        { ...context, type: "critical" },
        "critical",
      );
    },
  },
};
