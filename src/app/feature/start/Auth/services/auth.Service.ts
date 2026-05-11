import { auditLogService } from "@/src/app/feature/ajustes/services/auditLog.Service";
import type {
  UserInsert,
  UserRole,
} from "@/src/app/feature/common/models/database.types";
import { supabase } from "@/src/lib/supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthProfileInput = {
  full_name: string;
  role: UserRole;
  email: string;
  isOwner?: boolean;
  ownerUserId?: string;
};

type SignUpMetadata = {
  full_name: string;
  role: UserRole;
};

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null) {
    const supabaseError = error as { message?: string; hint?: string };
    return supabaseError.message || supabaseError.hint || fallback;
  }

  return fallback;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getPasswordResetRedirectTo() {
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}/reset-password`;
  }

  return undefined;
}

function isRpcResponseWithSuccess(
  value: unknown,
): value is { success: boolean; error?: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    typeof (value as { success?: unknown }).success === "boolean"
  );
}

async function logAuthEvent(
  eventType: string,
  description: string,
  source: string,
  metadata?: Record<string, unknown>,
) {
  await auditLogService.logEventSafe({
    event_type: eventType,
    description,
    metadata,
    source,
  });
}

export const authService = {
  async sendPasswordResetEmail(email: string) {
    try {
      const normalizedEmail = normalizeEmail(email);
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        normalizedEmail,
        {
          redirectTo: getPasswordResetRedirectTo(),
        },
      );

      if (error) {
        throw error;
      }

      await logAuthEvent(
        auditLogService.events.PASSWORD_RESET,
        "Password reset email requested",
        "auth.service.sendPasswordResetEmail",
        { email: normalizedEmail },
      );
      return { success: true, data };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(
          error,
          "Error al enviar el correo de recuperación",
        ),
      };
    }
  },

  async signIn(email: string, password: string) {
    try {
      const normalizedEmail = normalizeEmail(email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        throw error;
      }

      await logAuthEvent(
        auditLogService.events.LOGIN,
        "User logged in successfully",
        "auth.service.signIn",
        { email: normalizedEmail },
      );

      return { success: true, data };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al iniciar sesión"),
      };
    }
  },

  async sendOTP(email: string, createUser: boolean = true) {
    try {
      const normalizedEmail = normalizeEmail(email);
      const { data, error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: createUser,
          emailRedirectTo: undefined,
        },
      });

      if (error) {
        throw error;
      }

      await logAuthEvent(
        auditLogService.events.OTP_SENT,
        "OTP sent successfully",
        "auth.service.sendOTP",
        { email: normalizedEmail, create_user: createUser },
      );
      return { success: true, data };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(
          error,
          "Error al enviar el código de verificación",
        ),
      };
    }
  },

  async verifyOTP(
    email: string,
    token: string,
    type: "email" | "signup" | "magiclink" = "email",
  ) {
    try {
      const normalizedEmail = normalizeEmail(email);
      const { data, error } = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token,
        type,
      });

      console.log("Supabase VerifyOTP Response:", { data, error });

      if (error) {
        console.error("Supabase VerifyOTP Error Detail:", error);
        throw error;
      }

      await logAuthEvent(
        auditLogService.events.OTP_VERIFIED,
        "OTP verified successfully",
        "auth.service.verifyOTP",
        { email: normalizedEmail, type },
      );

      return { success: true, data, error: null };
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error: getErrorMessage(error, "Código de verificación incorrecto"),
      };
    }
  },

  async createUserWithProfile(userId: string, userData: AuthProfileInput) {
    try {
      const { data, error } = await supabase.rpc("create_user_with_profile", {
        p_id: userId,
        p_email: normalizeEmail(userData.email),
        p_full_name: userData.full_name,
        p_role: userData.role,
      });

      if (error) {
        throw error;
      }

      if (isRpcResponseWithSuccess(data) && !data.success) {
        throw new Error(data.error || "Error en la función de base de datos");
      }

      await logAuthEvent(
        auditLogService.events.USER_PROFILE_CREATED,
        "User and profile created successfully",
        "auth.service.createUserWithProfile",
        {
          user_id: userId,
          email: normalizeEmail(userData.email),
          role: userData.role,
        },
      );

      return { success: true, data };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al crear usuario y perfil"),
      };
    }
  },

  async createUserRecord(userId: string, userData: Omit<UserInsert, "id">) {
    try {
      const userRecord: UserInsert = {
        id: userId,
        ...userData,
      };

      const { data, error } = await supabase
        .from("users")
        .insert(userRecord)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al crear registro de usuario"),
      };
    }
  },

  async getUserRecord(userId: string) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return { success: true, data: null };
        }
        throw error;
      }

      return { success: true, data };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al obtener registro de usuario"),
      };
    }
  },

  async signUp(email: string, password: string, metadata?: SignUpMetadata) {
    try {
      const normalizedEmail = normalizeEmail(email);

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: metadata,
          // Eliminamos emailRedirectTo para que use la config por defecto de Supabase
        },
      });

      console.log("Supabase SignUp Response:", { 
        user: data?.user?.id, 
        session: !!data?.session, 
        error 
      });

      if (error) {
        console.error("Supabase SignUp Error Detail:", error);
        throw error;
      }

      await logAuthEvent(
        auditLogService.events.REGISTER,
        "New user registered",
        "auth.service.signUp",
        { email: normalizedEmail, role: metadata?.role },
      );
      return { success: true, data };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al registrar usuario"),
      };
    }
  },

  async updatePassword(newPassword: string) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      await logAuthEvent(
        auditLogService.events.PASSWORD_RESET,
        "Password updated successfully",
        "auth.service.updatePassword",
      );

      return { success: true, data };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al actualizar contraseña"),
      };
    }
  },

  async signOut() {
    try {
      await AsyncStorage.clear();

      const { error } = await supabase.auth.signOut();

      const isMissingSessionError =
        !!error?.message &&
        /session|logged out|invalid/i.test(error.message.toLowerCase());

      if (error && !isMissingSessionError) {
        throw error;
      }

      await logAuthEvent(
        auditLogService.events.LOGOUT,
        "User logged out",
        "auth.service.signOut",
      );

      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al cerrar sesión"),
      };
    }
  },

  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        return null;
      }

      return user;
    } catch (error: unknown) {
      return null;
    }
  },
  async checkEmailExists(email: string) {
    try {
      const normalizedEmail = normalizeEmail(email);

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("email")
        .eq("email", normalizedEmail)
        .maybeSingle();

      if (userError && userError.code !== "PGRST116") {
        throw userError;
      }

      const exists = !!userData;
      return { success: true, exists };
    } catch (error: unknown) {
      return {
        success: false,
        exists: false,
        error: getErrorMessage(
          error,
          "Error al verificar el correo electrónico",
        ),
      };
    }
  },

  async checkEmailExistsFallback(normalizedEmail: string) {
    try {
      const email = normalizeEmail(normalizedEmail);
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("email")
        .eq("email", email)
        .maybeSingle();

      if (userError && userError.code !== "PGRST116") {
        throw userError;
      }

      const exists = !!userData;
      return { success: true, exists };
    } catch (error: unknown) {
      return {
        success: false,
        exists: false,
        error: getErrorMessage(
          error,
          "Error al verificar el correo electrónico",
        ),
      };
    }
  },
};
