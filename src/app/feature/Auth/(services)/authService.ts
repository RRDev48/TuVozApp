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
      console.error("Error sending password reset email:", error);
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
      console.error("Error signing in:", error);
      return {
        success: false,
        error: error.message || "Error al iniciar sesión",
      };
    }
  },

  /**
   * Envía un código OTP de verificación al email
   * @param email - Email del usuario
   * @returns Promise con resultado de la operación
   */
  async sendOTP(email: string) {
    try {
      // Enviar OTP sin crear usuario aún
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // No crear usuario todavía
          emailRedirectTo: undefined,
        },
      });

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error: any) {
      console.error("Error sending OTP:", error);
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
   * @returns Promise con resultado de la operación
   */
  async verifyOTP(email: string, token: string) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });

      if (error) {
        throw error;
      }

      return { success: true, data, error: null };
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      return {
        success: false,
        data: null,
        error: error.message || "Código de verificación incorrecto",
      };
    }
  },

  /**
   * Registra un nuevo usuario
   * @param email - Email del usuario
   * @param password - Contraseña del usuario
   * @param metadata - Datos adicionales del usuario (nombre, edad, rol)
   * @returns Promise con resultado de la operación
   */
  async signUp(
    email: string,
    password: string,
    metadata?: { full_name: string; age: number; role: string },
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
        console.error("Supabase signup error:", error);
        throw error;
      }

      return { success: true, data };
    } catch (error: any) {
      console.error("Error signing up:", error);
      return {
        success: false,
        error: error.message || "Error al registrar usuario",
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
      console.error("Error signing out:", error);
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
        throw error;
      }

      return user;
    } catch (error: any) {
      console.error("Error getting current user:", error);
      return null;
    }
  },
};
