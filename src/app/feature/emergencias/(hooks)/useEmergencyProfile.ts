import { supabase } from "@/src/lib/supabaseClient";
import { useEffect, useState } from "react";
import {
  EmergencyProfile,
  emergencyService,
} from "../(services)/emergencyService";

export const useEmergencyProfile = () => {
  const [profile, setProfile] = useState<EmergencyProfile | null>(null);
  const [userFullName, setUserFullName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener usuario actual
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      // Obtener nombre completo del usuario
      const fullName = await emergencyService.getUserFullName(user.id);
      setUserFullName(fullName);

      // Obtener perfil de emergencia
      const emergencyProfile = await emergencyService.getEmergencyProfile(
        user.id,
      );
      setProfile(emergencyProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const updateField = async (
    field: keyof Omit<
      EmergencyProfile,
      "id" | "user_id" | "full_name" | "created_at" | "updated_at"
    >,
    value: string,
  ) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      if (!profile) {
        // Crear perfil si no existe
        const newProfile = await emergencyService.createEmergencyProfile({
          user_id: user.id,
          full_name: userFullName,
          blood_type: field === "blood_type" ? value : "",
          allergies: field === "allergies" ? value : "",
          medications: field === "medications" ? value : "",
          notes: field === "notes" ? value : "",
          address: field === "address" ? value : "",
          emergency_contact_name:
            field === "emergency_contact_name" ? value : "",
          emergency_contact_phone:
            field === "emergency_contact_phone" ? value : "",
          alert_type:
            field === "alert_type"
              ? (value as "call" | "whatsapp_location")
              : "call",
        });
        setProfile(newProfile);
      } else {
        // Actualizar perfil existente
        const updatedProfile = await emergencyService.updateEmergencyProfile(
          user.id,
          { [field]: value },
        );
        setProfile(updatedProfile);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar");
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const clearProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      await emergencyService.clearEmergencyProfile(user.id);
      await fetchProfile(); // Refrescar datos
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al limpiar");
      throw err;
    }
  };

  return {
    profile,
    userFullName,
    loading,
    error,
    updateField,
    refetch: fetchProfile,
    clearProfile,
  };
};
