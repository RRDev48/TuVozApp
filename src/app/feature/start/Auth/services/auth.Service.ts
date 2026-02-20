import type { UserInsert } from "@/src/app/feature/common/models/database.types";
import { supabase } from "@/src/lib/supabaseClient";

export const authService = {
  /**
   * Envía un email de recuperación de contraseña
   * @param email - Email del usuario
   * @returns Promise con resultado de la operación
   */
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

  /**
   * Inicia sesión con email y contraseña
   * @param email - Email del usuario
   * @param password - Contraseña del usuario
   * @returns Promise con resultado de la operación
   */
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

  /**
   * Envía un código OTP de verificación al email
   * @param email - Email del usuario
   * @param createUser - Si debe crear el usuario o solo enviar OTP
   * @returns Promise con resultado de la operación
   */
  async sendOTP(email: string, createUser: boolean = true) {
    try {
      // Enviar OTP - shouldCreateUser permite registrar nuevos usuarios
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

  /**
   * Verifica el código OTP
   * @param email - Email del usuario
   * @param token - Código OTP de 6 dígitos
   * @param type - Tipo de verificación (email, signup, magiclink)
   * @returns Promise con resultado de la operación
   */
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

  /**
   * Creates a user record and profile in a single atomic operation
   * Uses a database function to bypass RLS issues during registration
   * @param userId - Auth user ID
   * @param userData - User data (full_name, role, email)
   * @returns Promise with result
   */
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

      // Check if the function returned success
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

  /**
   * @deprecated Use createUserWithProfile() instead
   * Creates a user record in the public.users table
   * This should be called after successful authentication
   * @param userId - Auth user ID
   * @param userData - User data (full_name, role, email)
   * @returns Promise with result
   */
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

  /**
   * Gets user record from public.users table
   * @param userId - User ID
   * @returns User record or null
   */
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

  /**
   * Registra un nuevo usuario
   * @param email - Email del usuario
   * @param password - Contraseña del usuario
   * @param metadata - Datos adicionales del usuario (nombre, rol)
   * @returns Promise con resultado de la operación
   */
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

  /**
   * Actualiza la contraseña del usuario autenticado
   * @param newPassword - Nueva contraseña
   * @returns Promise con resultado de la operación
   */
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

  /**
   * Cierra la sesión actual
   * @returns Promise con resultado de la operación
   */
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

  /**
   * Obtiene el usuario actual
   * @returns Usuario actual o null
   */
  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        // Si no hay sesión, retornar null sin lanzar error
        return null;
      }

      return user;
    } catch (error: any) {
      // Si hay cualquier error, simplemente retornar null
      return null;
    }
  },

  /**
   * Verifica si un email ya está registrado en la base de datos
   * Usa una función RPC que consulta auth.users
   * @param email - Email a verificar
   * @returns Promise con resultado indicando si el email existe
   */
  async checkEmailExists(email: string) {
    try {
      const normalizedEmail = email.toLowerCase().trim();

      // Usar la función RPC que verifica en auth.users
      const { data, error } = await supabase.rpc("check_email_exists", {
        p_email: normalizedEmail,
      });
      if (error) {
        // Si la función RPC no existe, intentar fallback a tabla users
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

  /**
   * Método fallback para verificar email cuando la función RPC no existe
   * Solo verifica en public.users (usuarios verificados)
   * @param normalizedEmail - Email normalizado a verificar
   */
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
