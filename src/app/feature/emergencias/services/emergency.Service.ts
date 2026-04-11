import { auditLogService } from "@/src/app/feature/ajustes/services/auditLog.Service";
import { supabase } from "@/src/lib/supabaseClient";
import type { EmergencyAlertType } from "../models/emergency.types";

type EmergencyProfileError = {
  message?: string;
  code?: string;
};

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
  alert_type: EmergencyAlertType;
  created_at?: string;
  updated_at?: string;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === "object" && error !== null) {
    const possibleError = error as EmergencyProfileError;
    return possibleError.message || fallback;
  }

  return fallback;
}

function mapEmergencyProfileError(error: unknown): Error {
  const possibleError =
    typeof error === "object" && error !== null
      ? (error as EmergencyProfileError)
      : null;
  const message = getErrorMessage(error, "Error saving emergency profile");

  if (
    possibleError?.code === "42501" ||
    message.toLowerCase().includes("row-level security policy")
  ) {
    return new Error(
      "No tienes permisos para guardar este perfil de emergencia. Revisa la policy INSERT/UPDATE de emergency_profiles para el profile_id actual.",
    );
  }

  return new Error(message);
}

export const emergencyService = {
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

  async createEmergencyProfile(
    profile: Omit<EmergencyProfile, "id" | "created_at" | "updated_at">,
  ): Promise<EmergencyProfile> {
    try {
      const { data, error } = await supabase
        .from("emergency_profiles")
        .insert({
          profile_id: profile.profile_id,
          full_name: profile.full_name,
          blood_type: profile.blood_type,
          allergies: profile.allergies,
          medications: profile.medications,
          notes: profile.notes,
          address: profile.address,
          emergency_contact_name: profile.emergency_contact_name,
          emergency_contact_phone: profile.emergency_contact_phone,
          alert_type: profile.alert_type,
        })
        .select()
        .single();

      if (error) {
        throw mapEmergencyProfileError(error);
      }

      await auditLogService.logEventSafe({
        profile_id: profile.profile_id,
        event_type: auditLogService.events.EMERGENCY_PROFILE_CREATED,
        severity: "warning",
        description: "Emergency profile created",
        metadata: {
          profile_id: profile.profile_id,
          alert_type: profile.alert_type,
        },
        source: "emergency.service.createEmergencyProfile",
      });

      return data;
    } catch (error: unknown) {
      throw mapEmergencyProfileError(error);
    }
  },

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

    if (error) throw mapEmergencyProfileError(error);

    await auditLogService.logEventSafe({
      profile_id: profileId,
      event_type: auditLogService.events.EMERGENCY_PROFILE_UPDATED,
      severity: "warning",
      description: "Emergency profile updated",
      metadata: { profile_id: profileId, updated_fields: Object.keys(updates) },
      source: "emergency.service.updateEmergencyProfile",
    });

    return data;
  },

  async getProfileFullName(profileId: string): Promise<string> {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", profileId)
      .single();

    if (error) throw error;

    return data.full_name || "";
  },

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

    if (error) throw mapEmergencyProfileError(error);

    await auditLogService.logEventSafe({
      profile_id: profileId,
      event_type: auditLogService.events.EMERGENCY_PROFILE_CLEARED,
      severity: "warning",
      description: "Emergency profile cleared",
      metadata: { profile_id: profileId },
      source: "emergency.service.clearEmergencyProfile",
    });
  },
};
