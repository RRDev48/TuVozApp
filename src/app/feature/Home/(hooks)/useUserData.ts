import { useEffect, useState } from "react";
import { userService } from "../(services)/userService";

interface UseUserDataReturn {
  userName: string | null;
  loading: boolean;
  error: any;
  refreshUser: () => Promise<void>;
}

/**
 * Hook personalizado para obtener y gestionar los datos del usuario autenticado
 * @param defaultName - Nombre por defecto si no se puede obtener el nombre del usuario
 */
export const useUserData = (
  defaultName: string | null = null,
): UseUserDataReturn => {
  const [userName, setUserName] = useState<string | null>(defaultName);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { fullName, error } = await userService.getUserFullName();

      if (error) {
        setError(error);
        setUserName(null);
        return;
      }

      if (fullName) {
        setUserName(fullName);
      } else {
        setUserName(null);
      }
    } catch (err) {
      setError(err);
      setUserName(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return {
    userName,
    loading,
    error,
    refreshUser: fetchUserData,
  };
};
