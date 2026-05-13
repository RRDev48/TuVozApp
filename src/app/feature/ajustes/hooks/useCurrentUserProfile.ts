import { useActiveProfile } from "@/src/app/contexts/ActiveProfileContext";
import { useCurrentUser } from "./useCurrentUser";

export const useCurrentUserProfile = () => {
  const { id: profileId, loading: activeProfileLoading, refresh } = useActiveProfile();
  const { currentUser, isLoading: userLoading } = useCurrentUser();
  const userId = currentUser?.id || null;

  return {
    profileId,
    userId,
    loading: activeProfileLoading || userLoading,
    isAuthenticated: !!userId,
    refetch: refresh,
  };
};
