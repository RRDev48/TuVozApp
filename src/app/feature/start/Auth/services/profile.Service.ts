import type {
  Profile,
  ProfileInsert,
  UserProfile,
  UserProfileInsert,
} from "@/src/app/feature/common/models/database.types";
import { supabase } from "@/src/lib/supabaseClient";

export const profileService = {
  async createProfile(profileData: ProfileInsert) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .insert(profileData)
        .select("id, full_name, avatar_url, created_at")
        .single();

      if (error) {
        console.error("Supabase error creating profile:", error);
        throw error;
      }

      return { success: true, data: data as Profile };
    } catch (error: any) {
      console.error("Exception creating profile:", error);
      return {
        success: false,
        error: error.message || error.hint || "Error al crear el perfil",
      };
    }
  },

  async linkUserToProfile(
    userId: string,
    profileId: string,
    isOwner: boolean = false,
  ) {
    try {
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
        console.error("Supabase error linking user to profile:", error);
        throw error;
      }

      return { success: true, data: data as UserProfile };
    } catch (error: any) {
      console.error("Exception linking user to profile:", error);
      return {
        success: false,
        error:
          error.message || error.hint || "Error al vincular usuario con perfil",
      };
    }
  },

  async createProfileForUser(
    userId: string,
    profileData: ProfileInsert,
    isOwner: boolean = true,
  ) {
    try {
      const { data: insertedProfile, error: insertError } = await supabase
        .from("profiles")
        .insert(profileData)
        .select("id")
        .single();

      if (insertError || !insertedProfile) {
        console.error("Error inserting profile:", insertError);
        throw insertError || new Error("No profile data returned");
      }

      const profileId = insertedProfile.id;

      const linkResult = await this.linkUserToProfile(
        userId,
        profileId,
        isOwner,
      );

      if (!linkResult.success) {
        console.error("Error linking user to profile:", linkResult.error);
        throw new Error(linkResult.error);
      }

      const { data: fullProfile, error: selectError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profileId)
        .single();

      if (selectError) {
        console.warn("Could not fetch profile after creation:", selectError);
        return {
          success: true,
          data: {
            id: profileId,
            full_name: profileData.full_name,
            avatar_url: profileData.avatar_url,
            created_at: new Date().toISOString(),
          } as Profile,
        };
      }

      return { success: true, data: fullProfile as Profile };
    } catch (error: any) {
      console.error("Exception in createProfileForUser:", error);
      return {
        success: false,
        error: error.message || "Error al crear perfil para el usuario",
      };
    }
  },

  async getUserProfiles(userId: string) {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select(
          `
          is_owner,
          profile_id,
          profiles (
            id,
            full_name,
            avatar_url,
            created_at
          )
        `,
        )
        .eq("user_id", userId);

      if (error) throw error;

      const profiles = data?.map((item: any) => ({
        ...item.profiles,
        is_owner: item.is_owner,
      }));

      return {
        success: true,
        data: profiles as (Profile & { is_owner: boolean })[],
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al obtener los perfiles del usuario",
      };
    }
  },

  async getProfileById(profileId: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profileId)
        .single();

      if (error) throw error;

      return { success: true, data: data as Profile };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al obtener el perfil",
      };
    }
  },

  async updateProfile(profileId: string, updates: Partial<ProfileInsert>) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", profileId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: data as Profile };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al actualizar el perfil",
      };
    }
  },

  async deleteProfile(profileId: string) {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", profileId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al eliminar el perfil",
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

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al desvincular usuario del perfil",
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

      if (error) throw error;

      const users = data?.map((item: any) => ({
        ...item.users,
        is_owner: item.is_owner,
      }));

      return { success: true, data: users };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al obtener los usuarios del perfil",
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

      if (error) throw error;

      return { success: true, isOwner: data?.is_owner || false };
    } catch (error: any) {
      return {
        success: false,
        isOwner: false,
        error: error.message || "Error al verificar propiedad del perfil",
      };
    }
  },
};
