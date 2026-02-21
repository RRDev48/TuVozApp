import { useCallback, useEffect, useState } from "react";
import { authService } from "../../start/Auth/services/auth.Service";

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkCurrentUser = useCallback(async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
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
