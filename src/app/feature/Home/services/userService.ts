import { supabase } from "@/src/lib/supabaseClient";

type ServiceResult<T> = {
  data: T | null;
  error: string | null;
};

type CurrentUserResult = {
  user:
    | Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]["user"]
    | null;
  error: string | null;
};

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === "object" && error !== null) {
    const possibleError = error as { message?: string };
    return possibleError.message || fallback;
  }

  return fallback;
}

export const userService = {
  getCurrentUser: async (): Promise<CurrentUserResult> => {
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
    } catch (error: unknown) {
      return {
        user: null,
        error: getErrorMessage(error, "No se pudo obtener el usuario actual"),
      };
    }
  },

  getUserData: async (
    userId: string,
  ): Promise<ServiceResult<Record<string, unknown>>> => {
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
    } catch (error: unknown) {
      return {
        data: null,
        error: getErrorMessage(
          error,
          "No se pudo obtener la informacion del usuario",
        ),
      };
    }
  },

  getUserFullName: async (): Promise<{
    fullName: string | null;
    error: string | null;
  }> => {
    try {
      const { user, error: authError } = await userService.getCurrentUser();

      if (authError) {
        return { fullName: null, error: authError };
      }

      if (!user) {
        return { fullName: null, error: null };
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
    } catch (error: unknown) {
      return {
        fullName: null,
        error: getErrorMessage(
          error,
          "No se pudo obtener el nombre del usuario",
        ),
      };
    }
  },
};
