import type { UserInsert } from "@/src/app/feature/common/models/database.types";
import { supabase } from "@/src/lib/supabaseClient";

export const authService = {
  async sendPasswordResetEmail(email: string) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al enviar el correo de recuperación",
      };
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al iniciar sesión",
      };
    }
  },

  async sendOTP(email: string, createUser: boolean = true) {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: createUser,
          emailRedirectTo: undefined,
        },
      });

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al enviar el código de verificación",
      };
    }
  },

  async verifyOTP(
    email: string,
    token: string,
    type: "email" | "signup" | "magiclink" = "email",
  ) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type,
      });

      if (error) {
        throw error;
      }

      return { success: true, data, error: null };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.message || "Código de verificación incorrecto",
      };
    }
  },

  async createUserWithProfile(
    userId: string,
    userData: { full_name: string; role: string; email: string },
  ) {
    try {
      const { data, error } = await supabase.rpc("create_user_with_profile", {
        p_user_id: userId,
        p_full_name: userData.full_name,
        p_role: userData.role,
        p_email: userData.email,
      });

      if (error) {
        console.error("Supabase RPC error:", error);
        throw error;
      }

      if (data && typeof data === "object" && "success" in data) {
        if (data.success) {
          return { success: true, data };
        } else {
          throw new Error(data.error || "Error en la función de base de datos");
        }
      }

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || error.hint || "Error al crear usuario y perfil",
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
    } catch (error: any) {
      return {
        success: false,
        error:
          error.message || error.hint || "Error al crear registro de usuario",
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
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al obtener registro de usuario",
      };
    }
  },

  async signUp(
    email: string,
    password: string,
    metadata?: { full_name: string; role: string },
  ) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: undefined,
        },
      });

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al registrar usuario",
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

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al actualizar contraseña",
      };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al cerrar sesión",
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
    } catch (error: any) {
      return null;
    }
  },
  async checkEmailExists(email: string) {
    try {
      const normalizedEmail = email.toLowerCase().trim();

      const { data, error } = await supabase.rpc("check_email_exists", {
        p_email: normalizedEmail,
      });
      if (error) {
        if (
          error.message.includes("function") &&
          error.message.includes("does not exist")
        ) {
          return await this.checkEmailExistsFallback(normalizedEmail);
        }
        throw error;
      }

      const exists = data === true;
      return { success: true, exists };
    } catch (error: any) {
      return {
        success: false,
        exists: false,
        error: error.message || "Error al verificar el correo electrónico",
      };
    }
  },

  async checkEmailExistsFallback(normalizedEmail: string) {
    try {
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
    } catch (error: any) {
      return {
        success: false,
        exists: false,
        error: error.message || "Error al verificar el correo electrónico",
      };
    }
  },
};
