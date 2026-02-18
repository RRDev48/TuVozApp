import { supabase } from "@/src/lib/supabaseClient";
import type {
    Profile,
    ProfileInsert,
    UserProfile,
    UserProfileInsert,
} from "@/src/types/database.types";

export const profileService = {
  /**
   * Creates a new profile
   * NOTE: Prefer using createProfileForUser instead, which handles linking automatically
   * @param profileData - Profile data to insert
   * @returns The created profile or error
   * @deprecated Use createProfileForUser instead
   */
  async createProfile(profileData: ProfileInsert) {
    try {
      // Don't use .select() because RLS policy requires profile to be linked first
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

  /**
   * Links a user to a profile
   * @param userId - User ID
   * @param profileId - Profile ID
   * @param isOwner - Whether the user is the owner of the profile
   * @returns The created relationship or error
   */
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

  /**
   * Creates a profile and links it to a user
   * This method works around RLS policies by not selecting the profile until after linking
   * @param userId - User ID
   * @param profileData - Profile data to insert
   * @param isOwner - Whether the user is the owner of the profile
   * @returns The created profile or error
   */
  async createProfileForUser(
    userId: string,
    profileData: ProfileInsert,
    isOwner: boolean = true,
  ) {
    try {
      // Insert profile without selecting (to avoid RLS policy issue)
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

      // Link the user to the profile
      const linkResult = await this.linkUserToProfile(
        userId,
        profileId,
        isOwner,
      );

      if (!linkResult.success) {
        console.error("Error linking user to profile:", linkResult.error);
        throw new Error(linkResult.error);
      }

      // Now we can select the full profile data (after linking, RLS allows it)
      const { data: fullProfile, error: selectError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profileId)
        .single();

      if (selectError) {
        console.warn("Could not fetch profile after creation:", selectError);
        // Return partial data with the fields we have
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

  /**
   * Gets all profiles for a user
   * @param userId - User ID
   * @returns List of profiles with ownership information
   */
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

      // Transform the data to a cleaner format
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

  /**
   * Gets a specific profile by ID
   * @param profileId - Profile ID
   * @returns Profile data or error
   */
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

  /**
   * Updates a profile (only if user is owner)
   * @param profileId - Profile ID
   * @param updates - Profile fields to update
   * @returns Updated profile or error
   */
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

  /**
   * Deletes a profile (only if user is owner)
   * @param profileId - Profile ID
   * @returns Success status or error
   */
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

  /**
   * Removes a user's link to a profile
   * @param userId - User ID
   * @param profileId - Profile ID
   * @returns Success status or error
   */
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

  /**
   * Gets all users linked to a profile
   * @param profileId - Profile ID
   * @returns List of users with ownership information
   */
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

      // Transform the data to a cleaner format
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

  /**
   * Checks if a user is the owner of a profile
   * @param userId - User ID
   * @param profileId - Profile ID
   * @returns Boolean indicating ownership status
   */
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
