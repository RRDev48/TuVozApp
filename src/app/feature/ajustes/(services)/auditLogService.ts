import { supabase } from "@/src/lib/supabaseClient";

export interface AuditLog {
  id: number;
  profile_id?: string;
  event_type: string;
  event_description?: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface CreateAuditLogData {
  event_type: string;
  event_description?: string;
  metadata?: Record<string, any>;
}

export const auditLogService = {
  /**
   * Registra un evento de auditoría
   */
  async logEvent(data: CreateAuditLogData) {
    try {
      // Obtener el usuario actual
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Obtener el profile_id si el usuario está autenticado
      let profileId: string | null = null;
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", user.id)
          .single();

        profileId = profile?.id || null;
      }

      // Obtener información del navegador (si está disponible)
      const userAgent =
        typeof navigator !== "undefined" ? navigator.userAgent : null;

      const { data: auditLog, error } = await supabase
        .from("audit_logs")
        .insert({
          profile_id: profileId,
          event_type: data.event_type,
          event_description: data.event_description || null,
          metadata: data.metadata || null,
          user_agent: userAgent,
          // ip_address se puede obtener del servidor o dejarlo null por ahora
          ip_address: null,
        })
        .select()
        .single();

      if (error) {
        console.error("Failed to log audit event:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data: auditLog };
    } catch (error: any) {
      console.error("Exception in auditLogService:", error);
      return {
        success: false,
        error: error.message || "Failed to log audit event",
      };
    }
  },

  /**
   * Obtiene los logs de auditoría de un usuario
   */
  async getUserAuditLogs(limit: number = 50) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return {
          success: false,
          error: "User not authenticated",
        };
      }

      // Obtener el profile_id
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!profile) {
        return {
          success: false,
          error: "User profile not found",
        };
      }

      const { data: auditLogs, error } = await supabase
        .from("audit_logs")
        .select("*")
        .eq("profile_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return { success: true, data: auditLogs };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch audit logs",
      };
    }
  },

  /**
   * Eventos de auditoría predefinidos para consistencia
   */
  events: {
    // Autenticación
    LOGIN: "auth.login",
    LOGOUT: "auth.logout",
    REGISTER: "auth.register",
    PASSWORD_RESET: "auth.password_reset",

    // Soporte
    SUPPORT_TICKET_CREATED: "support.ticket_created",
    SUPPORT_TICKET_UPDATED: "support.ticket_updated",

    // Perfil
    PROFILE_UPDATED: "profile.updated",
    PROFILE_VIEWED: "profile.viewed",

    // Emergencias
    EMERGENCY_PROFILE_CREATED: "emergency.profile_created",
    EMERGENCY_PROFILE_UPDATED: "emergency.profile_updated",
    EMERGENCY_ALERT_SENT: "emergency.alert_sent",
    EMERGENCY_CALL_MADE: "emergency.call_made",

    // Configuración
    SETTINGS_UPDATED: "settings.updated",
    PERSONALIZATION_UPDATED: "personalization.updated",

    // Errors
    ERROR_OCCURRED: "error.occurred",
  },

  /**
   * Funciones helper para eventos comunes
   */
  async logSupportTicketCreated(ticketId: string, subject: string) {
    return this.logEvent({
      event_type: this.events.SUPPORT_TICKET_CREATED,
      event_description: `Support ticket created: ${subject}`,
      metadata: {
        ticket_id: ticketId,
        subject,
      },
    });
  },

  async logEmergencyAlertSent(contactPhone: string, alertType: string) {
    return this.logEvent({
      event_type: this.events.EMERGENCY_ALERT_SENT,
      event_description: `Emergency alert sent via ${alertType}`,
      metadata: {
        contact_phone: contactPhone,
        alert_type: alertType,
      },
    });
  },

  async logEmergencyCallMade() {
    return this.logEvent({
      event_type: this.events.EMERGENCY_CALL_MADE,
      event_description: "Emergency call to 911 initiated",
      metadata: {
        emergency_number: "911",
      },
    });
  },

  async logProfileUpdate(updatedFields: string[]) {
    return this.logEvent({
      event_type: this.events.PROFILE_UPDATED,
      event_description: `Profile updated: ${updatedFields.join(", ")}`,
      metadata: {
        updated_fields: updatedFields,
      },
    });
  },

  async logError(
    errorMessage: string,
    source?: string,
    context?: Record<string, any>,
  ) {
    return this.logEvent({
      event_type: this.events.ERROR_OCCURRED,
      event_description: errorMessage,
      metadata: {
        source,
        ...context,
      },
    });
  },
};
