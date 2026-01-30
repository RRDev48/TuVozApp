import { supabase } from "@/src/lib/supabaseClient";

export interface EmergencyProfile {
  id?: string;
  user_id: string;
  full_name: string;
  blood_type: string;
  allergies: string;
  medications: string;
  notes: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  alert_type: "call" | "whatsapp_location";
  created_at?: string;
  updated_at?: string;
}

export const emergencyService = {
  // Obtener perfil de emergencia del usuario
  async getEmergencyProfile(userId: string): Promise<EmergencyProfile | null> {
    const { data, error } = await supabase
      .from("emergency_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No existe perfil
        return null;
      }
      throw error;
    }

    return data;
  },

  // Crear perfil de emergencia
  async createEmergencyProfile(
    profile: Omit<EmergencyProfile, "id" | "created_at" | "updated_at">,
  ): Promise<EmergencyProfile> {
    const { data, error } = await supabase
      .from("emergency_profiles")
      .insert([profile])
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  // Actualizar perfil de emergencia
  async updateEmergencyProfile(
    userId: string,
    updates: Partial<
      Omit<EmergencyProfile, "id" | "user_id" | "created_at" | "updated_at">
    >,
  ): Promise<EmergencyProfile> {
    const { data, error } = await supabase
      .from("emergency_profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  // Obtener nombre completo del usuario desde la tabla users
  async getUserFullName(userId: string): Promise<string> {
    const { data, error } = await supabase
      .from("users")
      .select("full_name")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return data.full_name || "";
  },

  // Limpiar datos del perfil de emergencia
  async clearEmergencyProfile(userId: string): Promise<void> {
    const { error } = await supabase
      .from("emergency_profiles")
      .update({
        blood_type: "",
        allergies: "",
        medications: "",
        notes: "",
        address: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        alert_type: "call",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) throw error;
  },
};
