import { useActiveProfile } from "@/src/app/contexts/ActiveProfileContext";
import { UseUserDataReturn } from "../models/userData.types";

export const useUserData = (): UseUserDataReturn => {
  const { displayName, avatarUrl, loading, refresh } = useActiveProfile();

  return {
    userName: displayName,
    avatarUrl,
    loading,
    error: null,
    refreshUser: refresh,
  };
};
