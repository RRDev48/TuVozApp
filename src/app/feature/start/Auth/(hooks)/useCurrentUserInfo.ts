import type { User } from "@/src/types/database.types";
import { useEffect, useState } from "react";
import { authService } from "../(services)/authService";

/**
 * Hook to get current user information from public.users table
 */
export const useCurrentUserInfo = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get authenticated user
        const authUser = await authService.getCurrentUser();

        if (!authUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Get user record from public.users table
        const response = await authService.getUserRecord(authUser.id);

        if (response.success && response.data) {
          setUser(response.data as User);
        } else if (response.success && !response.data) {
          // User exists in auth but not in public.users table
          setError("Usuario no encontrado en la base de datos");
        } else {
          setError(
            response.error || "Error al obtener información del usuario",
          );
        }
      } catch (err: any) {
        setError(err.message || "Error inesperado");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const refetch = async () => {
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
      }
    } catch (err: any) {
      setError(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    refetch,
  };
};
