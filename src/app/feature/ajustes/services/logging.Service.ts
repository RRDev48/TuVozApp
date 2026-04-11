import { auditLogService } from "./auditLog.Service";

type LogContext = Record<string, unknown>;

export const loggingService = {
  async logError(
    errorMessage: string,
    error?: Error,
    source?: string,
    context?: LogContext,
    severity: "info" | "warning" | "error" | "critical" = "error",
  ) {
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
      source,
    });

    return { success: true };
  },

  async logAuditEvent(
    eventType: string,
    description?: string,
    metadata?: LogContext,
  ) {
    return auditLogService.logEvent({
      event_type: eventType,
      severity: "info",
      description: description || "",
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
        severity: "info",
        description: "User logged in successfully",
      });
    },

    async logLogout() {
      return auditLogService.logEvent({
        event_type: auditLogService.events.LOGOUT,
        severity: "info",
        description: "User logged out",
      });
    },

    async logRegister(userEmail?: string) {
      return auditLogService.logEvent({
        event_type: auditLogService.events.REGISTER,
        severity: "info",
        description: "New user registered",
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
        severity: "info",
        description: "User viewed their profile",
      });
    },
  },

  errors: {
    async logValidationError(
      message: string,
      source: string,
      context?: LogContext,
    ) {
      return loggingService.logError(
        message,
        undefined,
        source,
        { ...context, type: "validation" },
        "warning",
      );
    },

    async logNetworkError(error: Error, source: string, context?: LogContext) {
      return loggingService.logError(
        "Network error occurred",
        error,
        source,
        { ...context, type: "network" },
        "error",
      );
    },

    async logServerError(error: Error, source: string, context?: LogContext) {
      return loggingService.logError(
        "Server error occurred",
        error,
        source,
        { ...context, type: "server" },
        "error",
      );
    },

    async logCriticalError(error: Error, source: string, context?: LogContext) {
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
