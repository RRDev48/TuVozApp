import { useCallback, useEffect, useState } from "react";
import { emergencyService } from "../../emergencias/services/emergency.Service";
import { useCurrentUser } from "./useCurrentUser";

export const useCurrentUserProfile = () => {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser, isLoading: userLoading } = useCurrentUser();
  const userId = currentUser?.id || null;

  const fetchProfileId = useCallback(async () => {
    if (!userId) {
      setProfileId(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userProfileId =
        await emergencyService.getCurrentUserProfileId(userId);
      setProfileId(userProfileId);
    } catch (error) {
      setProfileId(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userLoading) {
      fetchProfileId();
    }
  }, [userLoading, fetchProfileId]);

  return {
    profileId,
    userId,
    loading: loading || userLoading,
    isAuthenticated: !!userId,
    refetch: fetchProfileId,
  };
};
