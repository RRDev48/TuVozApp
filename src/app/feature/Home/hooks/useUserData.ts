import { useEffect, useState } from "react";
import { UseUserDataReturn } from "../models/userData.types";
import { userService } from "../services/userService";

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
