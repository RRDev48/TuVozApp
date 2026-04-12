import type { Profile } from "@/src/app/feature/common/models/database.types";
import { useCallback, useEffect, useState } from "react";
import { authService } from "../services/auth.Service";
import { profileService } from "../services/profile.Service";

type ProfileWithOwner = Profile & { is_owner: boolean };

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}

export const useUserProfiles = () => {
  const [profiles, setProfiles] = useState<ProfileWithOwner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await authService.getCurrentUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    void fetchCurrentUser();
  }, []);

  const resolveCurrentUserId = useCallback(async () => {
    if (currentUserId) {
      return currentUserId;
    }

    const user = await authService.getCurrentUser();

    if (!user?.id) {
      return null;
    }

    setCurrentUserId(user.id);
    return user.id;
  }, [currentUserId]);

  const fetchProfiles = useCallback(async () => {
    const resolvedUserId = await resolveCurrentUserId();

    if (!resolvedUserId) {
      setError("No hay usuario autenticado");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await profileService.getUserProfiles(resolvedUserId);

      if (response.success && response.data) {
        if (response.data.length > 0) {
          setProfiles(response.data);
          return;
        }

        const ensureResult =
          await profileService.ensureSelfProfileForUser(resolvedUserId);

        if (!ensureResult.success) {
          setProfiles(response.data);
          return;
        }

        const refreshed = await profileService.getUserProfiles(resolvedUserId);

        if (refreshed.success && refreshed.data) {
          setProfiles(refreshed.data);
          return;
        }

        setProfiles(response.data);
      } else {
        setError(response.error || "Error al cargar los perfiles");
      }
    } catch (error: unknown) {
      setError(
        getErrorMessage(error, "Error inesperado al cargar los perfiles"),
      );
    } finally {
      setLoading(false);
    }
  }, [resolveCurrentUserId]);

  const createProfile = useCallback(
    async (profileData: {
      display_name: string;
      avatar_url?: string | null;
    }) => {
      const resolvedUserId = await resolveCurrentUserId();

      if (!resolvedUserId) {
        setError("No hay usuario autenticado");
        return { success: false };
      }

      setLoading(true);
      setError(null);

      try {
        const response = await profileService.createProfileForUser(
          resolvedUserId,
          {
            display_name: profileData.display_name,
            avatar_url: profileData.avatar_url || null,
            email: null,
            auth_user_id: null,
            owner_user_id: null,
          },
          true,
        );

        if (response.success) {
          await fetchProfiles();
          return { success: true, data: response.data };
        } else {
          setError(response.error || "Error al crear el perfil");
          return { success: false };
        }
      } catch (error: unknown) {
        setError(getErrorMessage(error, "Error inesperado al crear el perfil"));
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    [resolveCurrentUserId, fetchProfiles],
  );

  const updateProfile = useCallback(
    async (
      profileId: string,
      updates: {
        display_name?: string;
        age?: number | null;
        avatar_url?: string | null;
      },
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await profileService.updateProfile(profileId, updates);

        if (response.success) {
          await fetchProfiles();
          return { success: true, data: response.data };
        } else {
          setError(response.error || "Error al actualizar el perfil");
          return { success: false };
        }
      } catch (error: unknown) {
        setError(
          getErrorMessage(error, "Error inesperado al actualizar el perfil"),
        );
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    [fetchProfiles],
  );

  const deleteProfile = useCallback(
    async (profileId: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await profileService.deleteProfile(profileId);

        if (response.success) {
          await fetchProfiles();
          return { success: true };
        } else {
          setError(response.error || "Error al eliminar el perfil");
          return { success: false };
        }
      } catch (error: unknown) {
        setError(
          getErrorMessage(error, "Error inesperado al eliminar el perfil"),
        );
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    [fetchProfiles],
  );

  const unlinkProfile = useCallback(
    async (profileId: string) => {
      const resolvedUserId = await resolveCurrentUserId();

      if (!resolvedUserId) {
        setError("No hay usuario autenticado");
        return { success: false };
      }

      setLoading(true);
      setError(null);

      try {
        const response = await profileService.unlinkUserFromProfile(
          resolvedUserId,
          profileId,
        );

        if (response.success) {
          await fetchProfiles();
          return { success: true };
        } else {
          setError(response.error || "Error al desvincular el perfil");
          return { success: false };
        }
      } catch (error: unknown) {
        setError(
          getErrorMessage(error, "Error inesperado al desvincular el perfil"),
        );
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    [resolveCurrentUserId, fetchProfiles],
  );

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
