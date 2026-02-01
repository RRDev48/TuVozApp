import { useCallback, useEffect, useState } from "react";
import { authService } from "../../start/Auth/(services)/authService";

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkCurrentUser = useCallback(async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      // Si no hay sesión activa, simplemente no hay usuario logueado
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkCurrentUser();
  }, [checkCurrentUser]);

  return {
    currentUser,
    isLoading,
    refetch: checkCurrentUser,
  };
};
