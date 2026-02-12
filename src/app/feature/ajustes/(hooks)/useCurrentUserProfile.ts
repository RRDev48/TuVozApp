import { useCallback, useEffect, useState } from "react";
import { emergencyService } from "../../emergencias/(services)/emergencyService";
import { useCurrentUser } from "./useCurrentUser";

export const useCurrentUserProfile = () => {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser, isLoading: userLoading } = useCurrentUser();
  const userId = currentUser?.id || null;

  console.log(
    "🔍 useCurrentUserProfile - currentUser:",
    currentUser,
    "userId extracted:",
    userId,
  );

  const fetchProfileId = useCallback(async () => {
    console.log("🔍 fetchProfileId - userId:", userId);
    if (!userId) {
      setProfileId(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userProfileId =
        await emergencyService.getCurrentUserProfileId(userId);
      console.log("🎯 ProfileId obtenido:", userProfileId);
      setProfileId(userProfileId);
    } catch (error) {
      console.error("Error obteniendo profile_id:", error);
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
