import type { User } from "@/src/app/feature/common/models/database.types";
import { useCallback, useEffect, useState } from "react";
import { authService } from "../services/auth.Service";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}

export const useCurrentUserInfo = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const authUser = await authService.getCurrentUser();

      if (!authUser) {
        setUser(null);
        return;
      }

      const response = await authService.getUserRecord(authUser.id);

      if (response.success && response.data) {
        setUser(response.data as User);
        return;
      }

      if (response.success && !response.data) {
        setError("Usuario no encontrado en la base de datos");
        return;
      }

      setError(response.error || "Error al obtener información del usuario");
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Error inesperado"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return {
    user,
    loading,
    error,
    refetch,
  };
};
