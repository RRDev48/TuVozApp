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
   * @param type - Tipo de verificación (email, signup, magiclink)
   * @returns Promise con resultado de la operación
   */
  async verifyOTP(
    email: string,
    token: string,
    type: "email" | "signup" | "magiclink" = "email",
  ) {
    try {
      console.log("Verifying OTP with:", { email, token, type });
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type,
      });

      if (error) {
        console.error("Supabase verifyOtp error:", error);
        throw error;
      }

      console.log("OTP verified successfully");
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
   * Actualiza los metadatos del usuario después de la verificación OTP
   * @param metadata - Datos adicionales del usuario (nombre, edad, rol, contraseña)
   * @returns Promise con resultado de la operación
   */
  async updateUserMetadata(
    metadata: { full_name: string; age: number; role: string },
    password?: string,
  ) {
    try {
      const updateData: any = {
        data: metadata,
      };

      // Si se proporciona contraseña, actualizarla
      if (password) {
        updateData.password = password;
      }

      const { data, error } = await supabase.auth.updateUser(updateData);

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error: any) {
      console.error("Error updating user metadata:", error);
      return {
        success: false,
        error: error.message || "Error al actualizar información del usuario",
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
      console.log("Signing up user:", email);
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

      console.log("User signed up successfully:", data.user?.id);
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
        // Si no hay sesión, retornar null sin lanzar error
        return null;
      }

      return user;
    } catch (error: any) {
      // Si hay cualquier error, simplemente retornar null
      return null;
    }
  },
};
