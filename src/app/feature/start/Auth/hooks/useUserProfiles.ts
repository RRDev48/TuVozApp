import type { Profile } from "@/src/app/feature/common/models/database.types";
import { useCallback, useEffect, useState } from "react";
import { authService } from "../services/auth.Service";
import { profileService } from "../services/profile.Service";

/**
 * Hook to manage user profiles
 * Provides functionality to fetch, create, update, and delete profiles
 */
export const useUserProfiles = () => {
  const [profiles, setProfiles] = useState<(Profile & { is_owner: boolean })[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user ID
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await authService.getCurrentUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    fetchCurrentUser();
  }, []);

  /**
   * Fetches all profiles for the current user
   */
  const fetchProfiles = useCallback(async () => {
    if (!currentUserId) {
      setError("No hay usuario autenticado");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await profileService.getUserProfiles(currentUserId);

      if (response.success && response.data) {
        setProfiles(response.data);
      } else {
        setError(response.error || "Error al cargar los perfiles");
      }
    } catch (err: any) {
      setError(err.message || "Error inesperado al cargar los perfiles");
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  /**
   * Creates a new profile for the current user
   * @param profileData - Profile data (full_name, avatar_url)
   */
  const createProfile = useCallback(
    async (profileData: { full_name: string; avatar_url?: string | null }) => {
      if (!currentUserId) {
        setError("No hay usuario autenticado");
        return { success: false };
      }

      setLoading(true);
      setError(null);

      try {
        const response = await profileService.createProfileForUser(
          currentUserId,
          {
            full_name: profileData.full_name,
            avatar_url: profileData.avatar_url || null,
          },
          true, // User is the owner
        );

        if (response.success) {
          // Refresh profiles list
          await fetchProfiles();
          return { success: true, data: response.data };
        } else {
          setError(response.error || "Error al crear el perfil");
          return { success: false };
        }
      } catch (err: any) {
        setError(err.message || "Error inesperado al crear el perfil");
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    [currentUserId, fetchProfiles],
  );

  /**
   * Updates an existing profile
   * @param profileId - Profile ID
   * @param updates - Profile fields to update
   */
  const updateProfile = useCallback(
    async (
      profileId: string,
      updates: {
        full_name?: string;
        age?: number | null;
        avatar_url?: string | null;
      },
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await profileService.updateProfile(profileId, updates);

        if (response.success) {
          // Refresh profiles list
          await fetchProfiles();
          return { success: true, data: response.data };
        } else {
          setError(response.error || "Error al actualizar el perfil");
          return { success: false };
        }
      } catch (err: any) {
        setError(err.message || "Error inesperado al actualizar el perfil");
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    [fetchProfiles],
  );

  /**
   * Deletes a profile (only if user is owner)
   * @param profileId - Profile ID
   */
  const deleteProfile = useCallback(
    async (profileId: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await profileService.deleteProfile(profileId);

        if (response.success) {
          // Refresh profiles list
          await fetchProfiles();
          return { success: true };
        } else {
          setError(response.error || "Error al eliminar el perfil");
          return { success: false };
        }
      } catch (err: any) {
        setError(err.message || "Error inesperado al eliminar el perfil");
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    [fetchProfiles],
  );

  /**
   * Unlinks current user from a profile
   * @param profileId - Profile ID
   */
  const unlinkProfile = useCallback(
    async (profileId: string) => {
      if (!currentUserId) {
        setError("No hay usuario autenticado");
        return { success: false };
      }

      setLoading(true);
      setError(null);

      try {
        const response = await profileService.unlinkUserFromProfile(
          currentUserId,
          profileId,
        );

        if (response.success) {
          // Refresh profiles list
          await fetchProfiles();
          return { success: true };
        } else {
          setError(response.error || "Error al desvincular el perfil");
          return { success: false };
        }
      } catch (err: any) {
        setError(err.message || "Error inesperado al desvincular el perfil");
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    [currentUserId, fetchProfiles],
  );

  // Fetch profiles on mount
  useEffect(() => {
    if (currentUserId) {
      fetchProfiles();
    }
  }, [currentUserId, fetchProfiles]);

  return {
    profiles,
    loading,
    error,
    fetchProfiles,
    createProfile,
    updateProfile,
    deleteProfile,
    unlinkProfile,
  };
};
