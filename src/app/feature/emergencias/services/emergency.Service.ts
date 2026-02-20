import { supabase } from "@/src/lib/supabaseClient";

export interface EmergencyProfile {
  id?: string;
  profile_id: string;
  full_name: string;
  blood_type: string | null;
  allergies: string | null;
  medications: string | null;
  notes: string | null;
  address: string | null;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  alert_type: "call" | "whatsapp_location";
  created_at?: string;
  updated_at?: string;
}

export const emergencyService = {
  /**
   * Get the profile_id for the current authenticated user
   * Returns the profile where the user is the owner
   */
  async getCurrentUserProfileId(userId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("profile_id")
      .eq("user_id", userId)
      .eq("is_owner", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

    return data.profile_id;
  },

  // Obtener perfil de emergencia del usuario
  async getEmergencyProfile(
    profileId: string,
  ): Promise<EmergencyProfile | null> {
    const { data, error } = await supabase
      .from("emergency_profiles")
      .select("*")
      .eq("profile_id", profileId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

    return data;
  },

  // Crear perfil de emergencia usando función RPC para bypass RLS
  async createEmergencyProfile(
    profile: Omit<EmergencyProfile, "id" | "created_at" | "updated_at">,
  ): Promise<EmergencyProfile> {
    const { data, error } = await supabase.rpc("create_emergency_profile", {
      p_profile_id: profile.profile_id,
      p_full_name: profile.full_name,
      p_blood_type: profile.blood_type,
      p_allergies: profile.allergies,
      p_medications: profile.medications,
      p_notes: profile.notes,
      p_address: profile.address,
      p_emergency_contact_name: profile.emergency_contact_name,
      p_emergency_contact_phone: profile.emergency_contact_phone,
      p_alert_type: profile.alert_type,
    });

    if (error) {
      console.error("RPC error creating emergency profile:", error);
      throw error;
    }

    // Check if the function returned success
    if (data && typeof data === "object" && "success" in data) {
      if (data.success) {
        return data.data as EmergencyProfile;
      } else {
        throw new Error(data.error || "Error creating emergency profile");
      }
    }

    throw new Error("Unexpected response from create_emergency_profile");
  },

  // Actualizar perfil de emergencia
  async updateEmergencyProfile(
    profileId: string,
    updates: Partial<
      Omit<EmergencyProfile, "id" | "profile_id" | "created_at" | "updated_at">
    >,
  ): Promise<EmergencyProfile> {
    const { data, error } = await supabase
      .from("emergency_profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("profile_id", profileId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  // Obtener nombre completo del perfil
  async getProfileFullName(profileId: string): Promise<string> {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", profileId)
      .single();

    if (error) throw error;

    return data.full_name || "";
  },

  // Limpiar datos del perfil de emergencia
  async clearEmergencyProfile(profileId: string): Promise<void> {
    const { error } = await supabase
      .from("emergency_profiles")
      .update({
        blood_type: null,
        allergies: null,
        medications: null,
        notes: null,
        address: null,
        emergency_contact_name: "",
        emergency_contact_phone: "",
        alert_type: "call",
        updated_at: new Date().toISOString(),
      })
      .eq("profile_id", profileId);

    if (error) throw error;
  },
};
