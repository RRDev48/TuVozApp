import { supabase } from "@/src/lib/supabaseClient";

export interface ErrorLog {
  id: number;
  profile_id?: string;
  error_message: string;
  stack_trace?: string;
  severity: "info" | "warning" | "error" | "critical";
  source?: string;
  context?: Record<string, any>;
  created_at: string;
}

export interface CreateErrorLogData {
  error_message: string;
  stack_trace?: string;
  severity?: "info" | "warning" | "error" | "critical";
  source?: string;
  context?: Record<string, any>;
}

export const errorLogService = {
  async logError(data: CreateErrorLogData) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let profileId: string | null = null;
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", user.id)
          .single();

        profileId = profile?.id || null;
      }

      const { data: errorLog, error } = await supabase
        .from("error_logs")
        .insert({
          profile_id: profileId,
          error_message: data.error_message,
          stack_trace: data.stack_trace || null,
          severity: data.severity || "error",
          source: data.source || null,
          context: data.context || null,
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: errorLog };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to log error",
      };
    }
  },

  async getUserErrorLogs(limit: number = 50) {
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

      const { data: errorLogs, error } = await supabase
        .from("error_logs")
        .select("*")
        .eq("profile_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return { success: true, data: errorLogs };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch error logs",
      };
    }
  },

  async logErrorWithStack(
    errorMessage: string,
    error: Error,
    source?: string,
    context?: Record<string, any>,
    severity: "info" | "warning" | "error" | "critical" = "error",
  ) {
    return this.logError({
      error_message: errorMessage,
      stack_trace: error.stack,
      severity,
      source,
      context: {
        ...context,
        errorName: error.name,
        errorMessage: error.message,
      },
    });
  },
};
