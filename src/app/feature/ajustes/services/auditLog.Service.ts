import { supabase } from "@/src/lib/supabaseClient";

type AuditSeverity = "info" | "warning" | "error" | "critical";
type AuditMetadata = Record<string, unknown>;

const auditEvents = {
  LOGIN: "auth.login",
  LOGOUT: "auth.logout",
  REGISTER: "auth.register",
  PASSWORD_RESET: "auth.password_reset",
  OTP_SENT: "auth.otp_sent",
  OTP_VERIFIED: "auth.otp_verified",
  USER_PROFILE_CREATED: "auth.user_profile_created",

  SUPPORT_TICKET_CREATED: "support.ticket_created",
  SUPPORT_TICKET_UPDATED: "support.ticket_updated",
  SUPPORT_MESSAGE_CREATED: "support.message_created",

  PROFILE_CREATED: "profile.created",
  PROFILE_UPDATED: "profile.updated",
  PROFILE_AVATAR_UPDATED: "profile.avatar_updated",
  PROFILE_DELETED: "profile.deleted",
  PROFILE_LINKED: "profile.linked",
  PROFILE_UNLINKED: "profile.unlinked",
  PROFILE_VIEWED: "profile.viewed",

  EMERGENCY_PROFILE_CREATED: "emergency.profile_created",
  EMERGENCY_PROFILE_UPDATED: "emergency.profile_updated",
  EMERGENCY_PROFILE_CLEARED: "emergency.profile_cleared",
  EMERGENCY_ALERT_SENT: "emergency.alert_sent",
  EMERGENCY_CALL_MADE: "emergency.call_made",

  SETTINGS_UPDATED: "settings.updated",
  SETTINGS_DELETED: "settings.deleted",
  PERSONALIZATION_UPDATED: "personalization.updated",

  FAVORITE_PICTOGRAM_ADDED: "expresate.favorite_added",
  FAVORITE_PICTOGRAM_REMOVED: "expresate.favorite_removed",

  ROUTINE_CREATED: "routine.created",
  TASK_CREATED: "task.created",
  TASK_UPDATED: "task.updated",
  TASK_DELETED: "task.deleted",
  TASK_STEPS_CREATED: "task.steps_created",
  TASK_STATUS_UPDATED: "task.status_updated",
  TASK_TIMES_UPDATED: "task.times_updated",

  ERROR_OCCURRED: "error.occurred",
} as const;

export interface AuditLog {
  id: number;
  profile_id?: string;
  event_type: string;
  severity: AuditSeverity;
  description: string;
  metadata?: AuditMetadata;
  source?: string;
  created_at: string;
}

export interface CreateAuditLogData {
  profile_id?: string | null;
  event_type: string;
  severity?: AuditSeverity;
  description: string;
  metadata?: AuditMetadata;
  source?: string;
}

async function getAuthenticatedUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

async function getOwnerProfileIdByUserId(userId: string) {
  const { data: userProfile } = await supabase
    .from("user_profiles")
    .select("profile_id")
    .eq("user_id", userId)
    .eq("is_owner", true)
    .single();

  return userProfile?.profile_id ?? null;
}

async function resolveCurrentProfileId() {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return null;
  }

  return getOwnerProfileIdByUserId(userId);
}

async function logEvent(data: CreateAuditLogData) {
  try {
    const profileId =
      data.profile_id !== undefined
        ? data.profile_id
        : await resolveCurrentProfileId();

    const { data: auditLog, error } = await supabase
      .from("audit_logs")
      .insert({
        profile_id: profileId,
        event_type: data.event_type,
        severity: data.severity || "info",
        description: data.description,
        metadata: data.metadata || null,
        source: data.source || null,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: auditLog };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to log audit event",
    };
  }
}

async function logEventSafe(data: CreateAuditLogData) {
  try {
    await logEvent(data);
  } catch {}
}

async function getUserAuditLogs(limit: number = 50) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    const profileId = await getOwnerProfileIdByUserId(userId);

    if (!profileId) {
      return {
        success: false,
        error: "User profile not found",
      };
    }

    const { data: auditLogs, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return { success: true, data: auditLogs };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch audit logs",
    };
  }
}

export const auditLogService = {
  resolveCurrentProfileId,
  logEvent,
  logEventSafe,
  getUserAuditLogs,
  events: auditEvents,

  async logSupportTicketCreated(ticketId: string, subject: string) {
    return logEvent({
      event_type: auditEvents.SUPPORT_TICKET_CREATED,
      severity: "info",
      description: `Support ticket created: ${subject}`,
      metadata: {
        ticket_id: ticketId,
        subject,
      },
    });
  },

  async logEmergencyAlertSent(contactPhone: string, alertType: string) {
    return logEvent({
      event_type: auditEvents.EMERGENCY_ALERT_SENT,
      severity: "critical",
      description: `Emergency alert sent via ${alertType}`,
      metadata: {
        contact_phone: contactPhone,
        alert_type: alertType,
      },
    });
  },

  async logEmergencyCallMade() {
    return logEvent({
      event_type: auditEvents.EMERGENCY_CALL_MADE,
      severity: "critical",
      description: "Emergency call to 911 initiated",
      metadata: {
        emergency_number: "911",
      },
    });
  },

  async logProfileUpdate(updatedFields: string[]) {
    return logEvent({
      event_type: auditEvents.PROFILE_UPDATED,
      severity: "info",
      description: `Profile updated: ${updatedFields.join(", ")}`,
      metadata: {
        updated_fields: updatedFields,
      },
    });
  },

  async logError(
    errorMessage: string,
    source?: string,
    context?: AuditMetadata,
  ) {
    return logEvent({
      event_type: auditEvents.ERROR_OCCURRED,
      severity: "error",
      description: errorMessage,
      metadata: {
        ...context,
      },
      source,
    });
  },
};
