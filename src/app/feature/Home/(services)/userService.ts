import { supabase } from "@/src/lib/supabaseClient";

export const userService = {
  /**
   * Obtiene el usuario autenticado actual
   */
  getCurrentUser: async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        // No mostrar error si simplemente no hay sesión activa
        if (
          error.message?.includes("session") ||
          error.message?.includes("Session")
        ) {
          return { user: null, error: null };
        }
        throw error;
      }

      return { user, error: null };
    } catch (error) {
      console.error("Error getting current user:", error);
      return { user: null, error };
    }
  },

  /**
   * Obtiene los datos completos del usuario desde la tabla users
   */
  getUserData: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle(); // Usar maybeSingle() para manejar 0 resultados

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error fetching user data:", error);
      return { data: null, error };
    }
  },

  /**
   * Obtiene el nombre completo del usuario autenticado
   */
  getUserFullName: async () => {
    try {
      const { user, error: authError } = await userService.getCurrentUser();

      // Si no hay usuario, retornar null silenciosamente (caso de "Omitir")
      if (!user) {
        return { fullName: null, error: null };
      }

      if (authError) {
        return { fullName: null, error: authError };
      }

      console.log("Fetching user data for ID:", user.id);

      const { data, error } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      console.log("Query result:", { data, error });

      if (error) {
        throw error;
      }

      // Si no hay datos, el usuario no está en la tabla users
      if (!data) {
        console.log("User not found in users table, returning null");
        return { fullName: null, error: null };
      }

      return { fullName: data?.full_name || null, error: null };
    } catch (error) {
      console.error("Error fetching user full name:", error);
      return { fullName: null, error };
    }
  },
};
