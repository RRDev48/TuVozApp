import { auditLogService } from "@/src/app/feature/ajustes/services/auditLog.Service";
import type {
  Profile,
  ProfileInsert,
  User,
  UserProfile,
  UserProfileInsert,
} from "@/src/app/feature/common/models/database.types";
import { supabase } from "@/src/lib/supabaseClient";

const profileSelectFields = "id, display_name, avatar_url, created_at";

type ProfileWithOwner = Profile & { is_owner: boolean };
type UserWithOwner = User & { is_owner: boolean };

type LinkedProfileQueryRow = {
  is_owner: boolean;
  profile_id: string;
  profiles: Profile | Profile[] | null;
};

type LinkedUserQueryRow = {
  is_owner: boolean;
  user_id: string;
  users: User | User[] | null;
};

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null) {
    const supabaseError = error as { message?: string; hint?: string };
    return supabaseError.message || supabaseError.hint || fallback;
  }

  return fallback;
}

function normalizeJoinedRow<T>(value: T | T[] | null): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

function buildFallbackProfile(
  profileId: string,
  profileData: ProfileInsert,
): Profile {
  return {
    id: profileId,
    display_name: profileData.display_name,
    avatar_url: profileData.avatar_url,
    created_at: new Date().toISOString(),
    email: profileData.email,
    auth_user_id: profileData.auth_user_id,
    owner_user_id: profileData.owner_user_id,
  };
}

function normalizeProfileRecord(
  profile: Pick<Profile, "id" | "display_name" | "avatar_url" | "created_at">,
): Profile {
  return {
    id: profile.id,
    display_name: profile.display_name,
    avatar_url: profile.avatar_url ?? null,
    created_at: profile.created_at,
    email: null,
    auth_user_id: null,
    owner_user_id: null,
  };
}

async function logProfileEvent(
  eventType: string,
  profileId: string,
  description: string,
  source: string,
  metadata?: Record<string, unknown>,
) {
  await auditLogService.logEventSafe({
    profile_id: profileId,
    event_type: eventType,
    description,
    metadata,
    source,
  });
}

async function insertProfile(profileData: ProfileInsert) {
  const insertPayload = {
    display_name: profileData.display_name,
    avatar_url: profileData.avatar_url ?? null,
  };

  const { data, error } = await supabase
    .from("profiles")
    .insert(insertPayload)
    .select(profileSelectFields)
    .single();

  if (error) {
    throw error;
  }

  return data as Profile;
}

async function fetchProfileById(profileId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select(profileSelectFields)
    .eq("id", profileId)
    .single();

  if (error) {
    throw error;
  }

  return data as Profile;
}

async function linkUserToProfileRecord(
  userId: string,
  profileId: string,
  isOwner: boolean,
) {
  const userProfileData: UserProfileInsert = {
    user_id: userId,
    profile_id: profileId,
    is_owner: isOwner,
  };

  const { data, error } = await supabase
    .from("user_profiles")
    .insert(userProfileData)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as UserProfile;
}

export const profileService = {
  async ensureSelfProfileForUser(userId: string) {
    try {
      const { data: linkedRows, error: linkedError } = await supabase
        .from("user_profiles")
        .select("profile_id")
        .eq("user_id", userId)
        .limit(1);

      if (linkedError) {
        throw linkedError;
      }

      if ((linkedRows || []).length > 0) {
        return { success: true };
      }

      const { data: directProfiles, error: directProfilesError } =
        await supabase
          .from("profiles")
          .select("id")
          .or(`auth_user_id.eq.${userId},owner_user_id.eq.${userId}`)
          .limit(1);

      if (directProfilesError) {
        throw directProfilesError;
      }

      if ((directProfiles || []).length > 0) {
        return { success: true };
      }

      const { data: userRow, error: userError } = await supabase
        .from("users")
        .select("id, email, full_name, role")
        .eq("id", userId)
        .maybeSingle();

      if (userError && userError.code !== "PGRST116") {
        throw userError;
      }

      let ensuredUser = userRow;

      if (!ensuredUser) {
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !authUser?.id) {
          throw (
            authError || new Error("No se pudo obtener usuario autenticado")
          );
        }

        const fallbackEmail = authUser.email?.trim().toLowerCase();
        if (!fallbackEmail) {
          throw new Error("No se encontró email del usuario autenticado");
        }

        const metadataName =
          (authUser.user_metadata?.full_name as string | undefined)?.trim() ||
          (authUser.user_metadata?.name as string | undefined)?.trim() ||
          fallbackEmail.split("@")[0] ||
          "Usuario";

        const { data: upsertedUser, error: upsertUserError } = await supabase
          .from("users")
          .upsert(
            {
              id: authUser.id,
              email: fallbackEmail,
              full_name: metadataName,
              role: "self",
            },
            { onConflict: "id" },
          )
          .select("id, email, full_name, role")
          .single();

        if (upsertUserError || !upsertedUser) {
          throw (
            upsertUserError ||
            new Error("No se pudo crear/actualizar el usuario interno")
          );
        }

        ensuredUser = upsertedUser;
      }

      const { error: rpcError } = await supabase.rpc(
        "create_user_with_profile",
        {
          p_id: ensuredUser.id,
          p_email: ensuredUser.email,
          p_full_name: ensuredUser.full_name,
          p_role: ensuredUser.role,
        },
      );

      if (rpcError) {
        throw rpcError;
      }

      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al asegurar perfil propio"),
      };
    }
  },

  async createProfile(profileData: ProfileInsert) {
    try {
      const data = await insertProfile(profileData);

      await logProfileEvent(
        auditLogService.events.PROFILE_CREATED,
        data.id,
        "Profile created",
        "profile.service.createProfile",
        { profile_id: data.id, display_name: data.display_name },
      );

      return { success: true, data };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al crear el perfil"),
      };
    }
  },

  async linkUserToProfile(
    userId: string,
    profileId: string,
    isOwner: boolean = false,
  ) {
    try {
      const data = await linkUserToProfileRecord(userId, profileId, isOwner);

      await logProfileEvent(
        auditLogService.events.PROFILE_LINKED,
        profileId,
        "User linked to profile",
        "profile.service.linkUserToProfile",
        { user_id: userId, profile_id: profileId, is_owner: isOwner },
      );

      return { success: true, data };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al vincular usuario con perfil"),
      };
    }
  },

  async createProfileForUser(
    userId: string,
    profileData: ProfileInsert,
    isOwner: boolean = true,
  ) {
    try {
      const createdProfile = await insertProfile(profileData);

      await linkUserToProfileRecord(userId, createdProfile.id, isOwner);

      let fullProfile: Profile;

      try {
        fullProfile = await fetchProfileById(createdProfile.id);
      } catch {
        fullProfile = buildFallbackProfile(createdProfile.id, profileData);
      }

      await logProfileEvent(
        auditLogService.events.PROFILE_CREATED,
        createdProfile.id,
        "Profile created for user",
        "profile.service.createProfileForUser",
        {
          user_id: userId,
          profile_id: createdProfile.id,
          is_owner: isOwner,
        },
      );

      return { success: true, data: fullProfile };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al crear perfil para el usuario"),
      };
    }
  },

  async getUserProfiles(userId: string) {
    try {
      const { data: linkedProfiles, error: linkedError } = await supabase
        .from("user_profiles")
        .select(
          `
          is_owner,
          profile_id,
          profiles (
            id,
            display_name,
            avatar_url,
            created_at
          )
        `,
        )
        .eq("user_id", userId);

      if (linkedError) {
        throw linkedError;
      }

      const linkedProfilesData =
        (linkedProfiles as LinkedProfileQueryRow[] | null)
          ?.map((item) => {
            const profile = normalizeJoinedRow(item.profiles);

            if (!profile) {
              return null;
            }

            return {
              ...normalizeProfileRecord(profile),
              is_owner: item.is_owner,
            } satisfies ProfileWithOwner;
          })
          .filter((profile): profile is ProfileWithOwner => profile !== null) ||
        [];

      const allProfilesMap = new Map<string, ProfileWithOwner>();

      linkedProfilesData.forEach((profile) =>
        allProfilesMap.set(profile.id, profile),
      );

      const profiles = Array.from(allProfilesMap.values());

      return {
        success: true,
        data: profiles,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(
          error,
          "Error al obtener los perfiles del usuario",
        ),
      };
    }
  },

  async getProfileById(profileId: string) {
    try {
      const data = await fetchProfileById(profileId);

      return { success: true, data };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al obtener el perfil"),
      };
    }
  },

  async updateProfile(profileId: string, updates: Partial<ProfileInsert>) {
    try {
      const updatePayload: Partial<
        Pick<Profile, "display_name" | "avatar_url">
      > = {};

      if (typeof updates.display_name !== "undefined") {
        updatePayload.display_name = updates.display_name;
      }

      if (typeof updates.avatar_url !== "undefined") {
        updatePayload.avatar_url = updates.avatar_url;
      }

      const { data, error } = await supabase
        .from("profiles")
        .update(updatePayload)
        .eq("id", profileId)
        .select(profileSelectFields)
        .single();

      if (error) {
        throw error;
      }

      await logProfileEvent(
        auditLogService.events.PROFILE_UPDATED,
        profileId,
        "Profile updated",
        "profile.service.updateProfile",
        {
          profile_id: profileId,
          updated_fields: Object.keys(updates),
        },
      );

      return { success: true, data: data as Profile };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al actualizar el perfil"),
      };
    }
  },

  async deleteProfile(profileId: string) {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", profileId);

      if (error) {
        throw error;
      }

      await logProfileEvent(
        auditLogService.events.PROFILE_DELETED,
        profileId,
        "Profile deleted",
        "profile.service.deleteProfile",
        { profile_id: profileId },
      );

      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al eliminar el perfil"),
      };
    }
  },

  async unlinkUserFromProfile(userId: string, profileId: string) {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .delete()
        .eq("user_id", userId)
        .eq("profile_id", profileId);

      if (error) {
        throw error;
      }

      await logProfileEvent(
        auditLogService.events.PROFILE_UNLINKED,
        profileId,
        "User unlinked from profile",
        "profile.service.unlinkUserFromProfile",
        { user_id: userId, profile_id: profileId },
      );

      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(
          error,
          "Error al desvincular usuario del perfil",
        ),
      };
    }
  },

  async getProfileUsers(profileId: string) {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select(
          `
          is_owner,
          user_id,
          users (
            id,
            full_name,
            role,
            email,
            created_at
          )
        `,
        )
        .eq("profile_id", profileId);

      if (error) {
        throw error;
      }

      const users =
        (data as LinkedUserQueryRow[] | null)
          ?.map((item) => {
            const user = normalizeJoinedRow(item.users);

            if (!user) {
              return null;
            }

            return {
              ...user,
              is_owner: item.is_owner,
            } satisfies UserWithOwner;
          })
          .filter((user): user is UserWithOwner => user !== null) || [];

      return { success: true, data: users };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(
          error,
          "Error al obtener los usuarios del perfil",
        ),
      };
    }
  },

  async isProfileOwner(userId: string, profileId: string) {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("is_owner")
        .eq("user_id", userId)
        .eq("profile_id", profileId)
        .single();

      if (error) {
        throw error;
      }

      return { success: true, isOwner: data?.is_owner || false };
    } catch (error: unknown) {
      return {
        success: false,
        isOwner: false,
        error: getErrorMessage(
          error,
          "Error al verificar propiedad del perfil",
        ),
      };
    }
  },
};
