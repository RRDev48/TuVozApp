import { supabase } from "@/src/lib/supabaseClient";

export const userService = {
  getCurrentUser: async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
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
      return { user: null, error };
    }
  },

  getUserData: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  getUserFullName: async () => {
    try {
      const { user, error: authError } = await userService.getCurrentUser();

      if (!user) {
        return { fullName: null, error: null };
      }

      if (authError) {
        return { fullName: null, error: authError };
      }

      const { data, error } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        return { fullName: null, error: null };
      }

      return { fullName: data?.full_name || null, error: null };
    } catch (error) {
      return { fullName: null, error };
    }
  },
};
