import { useEffect, useState } from "react";
import { userService } from "../services/userService";

export const useAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const { user } = await userService.getCurrentUser();

      if (!isMounted) {
        return;
      }

      setIsAuthenticated(!!user);
      setIsLoading(false);
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return { isAuthenticated, isLoading };
};
