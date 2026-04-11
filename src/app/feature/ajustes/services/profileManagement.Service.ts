import { supabase } from "@/src/lib/supabaseClient";
import { auditLogService } from "./auditLog.Service";

type ProfileSummary = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
};

type ServiceSuccess<T = undefined> = T extends undefined
  ? { success: true }
  : { success: true; data: T };

type ServiceFailure = { success: false; error: string };
type ServiceResult<T = undefined> = ServiceSuccess<T> | ServiceFailure;

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

async function deleteRowsByProfileId(table: string, profileId: string) {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq("profile_id", profileId);

  if (error) {
    throw error;
  }
}

async function deleteRoutineTasks(routineIds: string[]) {
  if (routineIds.length === 0) {
    return;
  }

  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("id")
    .in("routine_id", routineIds);

  if (tasksError) {
    throw tasksError;
  }

  const taskIds = (tasks || []).map((task) => task.id);

  if (taskIds.length > 0) {
    const { error: taskStepsError } = await supabase
      .from("task_steps")
      .delete()
      .in("task_id", taskIds);

    if (taskStepsError) {
      throw taskStepsError;
    }
  }

  const { error: tasksDeleteError } = await supabase
    .from("tasks")
    .delete()
    .in("routine_id", routineIds);

  if (tasksDeleteError) {
    throw tasksDeleteError;
  }
}

async function deleteProfileAndData(profileId: string): Promise<ServiceResult> {
  await deleteRowsByProfileId("audit_logs", profileId);
  await deleteRowsByProfileId("emergency_profiles", profileId);
  await deleteRowsByProfileId("favorite_pictograms", profileId);
  await deleteRowsByProfileId("profile_settings", profileId);

  const { data: routines, error: routinesError } = await supabase
    .from("routines")
    .select("id")
    .eq("profile_id", profileId);

  if (routinesError) {
    throw routinesError;
  }

  await deleteRoutineTasks((routines || []).map((routine) => routine.id));

  const { error: routinesDeleteError } = await supabase
    .from("routines")
    .delete()
    .eq("profile_id", profileId);

  if (routinesDeleteError) {
    throw routinesDeleteError;
  }

  const { error: userProfilesError } = await supabase
    .from("user_profiles")
    .delete()
    .eq("profile_id", profileId);

  if (userProfilesError) {
    throw userProfilesError;
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", profileId);

  if (profileError) {
    throw profileError;
  }

  await auditLogService.logEventSafe({
    event_type: auditLogService.events.PROFILE_DELETED,
    description: "Profile and related data deleted",
    metadata: { deleted_profile_id: profileId },
    source: "profileManagement.service.deleteProfileAndData",
  });

  return { success: true };
}

export const profileManagementService = {
  async getProfile(profileId: string) {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, created_at")
        .eq("id", profileId)
        .single();

      if (error) {
        throw new Error("Error al obtener el perfil");
      }

      return { success: true, data: profile as ProfileSummary };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al obtener el perfil"),
      };
    }
  },

  async updateProfileName(profileId: string, newName: string) {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .update({ full_name: newName })
        .eq("id", profileId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      await auditLogService.logEventSafe({
        profile_id: profileId,
        event_type: auditLogService.events.PROFILE_UPDATED,
        description: "Profile name updated",
        metadata: { profile_id: profileId, updated_fields: ["full_name"] },
        source: "profileManagement.service.updateProfileName",
      });

      return { success: true, data: profile };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al actualizar el perfil"),
      };
    }
  },

  async updateProfileAvatar(profileId: string, avatarUrl: string) {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", profileId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      await auditLogService.logEventSafe({
        profile_id: profileId,
        event_type: auditLogService.events.PROFILE_AVATAR_UPDATED,
        description: "Profile avatar updated",
        metadata: { profile_id: profileId },
        source: "profileManagement.service.updateProfileAvatar",
      });

      return { success: true, data: profile };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al actualizar el avatar"),
      };
    }
  },

  async getProfileDeleteInfo(profileId: string) {
    try {
      const {
        data: { user: currentAuthUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !currentAuthUser) {
        throw new Error("Error al obtener usuario actual");
      }

      const currentUserId = currentAuthUser.id;

      const { data: userProfile, error: userProfileError } = await supabase
        .from("user_profiles")
        .select("is_owner")
        .eq("user_id", currentUserId)
        .eq("profile_id", profileId)
        .single();

      if (userProfileError) {
        throw new Error("Error al obtener información del perfil");
      }

      return {
        success: true,
        isOwnProfile: userProfile?.is_owner || false,
        currentUserId,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(
          error,
          "Error al obtener información del perfil",
        ),
      };
    }
  },

  async deleteAllUserData() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      // Get all profiles owned by this user
      const { data: userProfiles, error: profilesError } = await supabase
        .from("user_profiles")
        .select("profile_id")
        .eq("user_id", user.id)
        .eq("is_owner", true);

      if (profilesError) {
        throw profilesError;
      }

      // Delete all data for these profiles
      for (const userProfile of userProfiles || []) {
        const deleteResult = await deleteProfileAndData(userProfile.profile_id);

        if (!deleteResult.success) {
          return deleteResult;
        }
      }

      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(
          error,
          "Error al eliminar todos los datos del usuario",
        ),
      };
    }
  },

  async deleteSingleProfile(profileId: string) {
    try {
      return await deleteProfileAndData(profileId);
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al eliminar el perfil"),
      };
    }
  },

  async deleteProfileAndData(profileId: string) {
    try {
      return await deleteProfileAndData(profileId);
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al eliminar el perfil"),
      };
    }
  },

  async signOut() {
    try {
      await supabase.auth.signOut();

      await auditLogService.logEventSafe({
        event_type: auditLogService.events.LOGOUT,
        description: "User logged out",
        source: "profileManagement.service.signOut",
      });

      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al cerrar sesión"),
      };
    }
  },
};
