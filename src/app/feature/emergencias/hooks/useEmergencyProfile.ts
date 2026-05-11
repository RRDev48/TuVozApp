import { supabase } from "@/src/lib/supabaseClient";
import { useEffect, useState } from "react";
import {
  EmergencyProfile,
  emergencyService,
} from "../services/emergency.Service";

export const useEmergencyProfile = () => {
  const [profile, setProfile] = useState<EmergencyProfile | null>(null);
  const [profileFullName, setProfileFullName] = useState<string>("");
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      const userProfileId = await emergencyService.getCurrentUserProfileId(
        user.id,
      );
      if (!userProfileId)
        throw new Error("No se encontró perfil para el usuario");

      setProfileId(userProfileId);

      // Ejecutar estas peticiones en paralelo para ahorrar tiempo
      const [fullName, emergencyProfile] = await Promise.all([
        emergencyService.getProfileFullName(userProfileId),
        emergencyService.getEmergencyProfile(userProfileId),
      ]);

      setProfileFullName(fullName);
      setProfile(emergencyProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    profileFullName,
    profileId,
    loading,
    error,
    refetch: fetchProfile,
  };
};
