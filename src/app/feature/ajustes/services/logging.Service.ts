import { auditLogService } from "./auditLog.Service";
import { errorLogService } from "./errorLog.Service";

export const loggingService = {
  async logError(
    errorMessage: string,
    error?: Error,
    source?: string,
    context?: Record<string, any>,
    severity: "info" | "warning" | "error" | "critical" = "error",
  ) {
    const logPromises = [];

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

    if (severity === "critical" || severity === "error") {
      logPromises.push(auditLogService.logError(errorMessage, source, context));
    }

    const results = await Promise.allSettled(logPromises);

    const hasSuccess = results.some((result) => result.status === "fulfilled");
    return { success: hasSuccess };
  },

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
