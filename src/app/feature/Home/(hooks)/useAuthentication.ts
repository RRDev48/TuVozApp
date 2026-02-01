import { useEffect, useState } from "react";
import { userService } from "../(services)/userService";

export const useAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { user } = await userService.getCurrentUser();
      setIsAuthenticated(!!user);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  return { isAuthenticated, isLoading };
};
