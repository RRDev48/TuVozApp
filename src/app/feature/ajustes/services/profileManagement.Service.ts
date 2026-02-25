import { supabase } from "@/src/lib/supabaseClient";

export const profileManagementService = {
  async updateProfileName(profileId: string, newName: string) {
    try {
      const { data: rpcResult, error: rpcError } = await supabase.rpc(
        "update_profile_name",
        {
          p_profile_id: profileId,
          p_new_name: newName,
        },
      );

      if (rpcError) {
        throw rpcError;
      }

      if (!rpcResult?.success) {
        throw new Error(rpcResult?.error || "Error al actualizar el perfil");
      }

      return { success: true, data: rpcResult };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al actualizar el perfil",
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

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("auth_user_id")
        .eq("id", profileId)
        .single();

      if (profileError) {
        throw new Error("Error al obtener información del perfil");
      }

      const profileAuthUserId = profileData.auth_user_id;

      return {
        success: true,
        isOwnProfile: profileAuthUserId === currentUserId,
        currentUserId,
        profileAuthUserId,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al obtener información del perfil",
      };
    }
  },

  async deleteAllUserData() {
    try {
      const { data: rpcResult, error: rpcError } = await supabase.rpc(
        "delete_all_user_data",
      );

      if (rpcError) {
        throw rpcError;
      }

      return { success: true, data: rpcResult };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al eliminar todos los datos del usuario",
      };
    }
  },

  async deleteSingleProfile(profileId: string) {
    try {
      const { data: rpcResult, error: rpcError } = await supabase.rpc(
        "delete_single_profile",
        { p_profile_id: profileId },
      );

      if (rpcError) {
        throw rpcError;
      }

      return {
        success: true,
        data: rpcResult,
        deletedUser: rpcResult?.deleted_user || false,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al eliminar el perfil",
      };
    }
  },

  async signOut() {
    try {
      await supabase.auth.signOut();
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al cerrar sesión",
      };
    }
  },
};
