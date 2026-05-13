import { useActiveProfile } from "@/src/app/contexts/ActiveProfileContext";
import { useEffect, useState } from "react";
import {
  EmergencyProfile,
  emergencyService,
} from "../services/emergency.Service";

export const useEmergencyProfile = () => {
  const [profile, setProfile] = useState<EmergencyProfile | null>(null);
  const [profileFullName, setProfileFullName] = useState<string>("");
  const { id: profileId, loading: activeProfileLoading } = useActiveProfile();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!profileId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Ejecutar estas peticiones en paralelo para ahorrar tiempo
      const [fullName, emergencyProfile] = await Promise.all([
        emergencyService.getProfileFullName(profileId),
        emergencyService.getEmergencyProfile(profileId),
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
    if (profileId) {
      fetchProfile();
    } else if (!activeProfileLoading) {
      setLoading(false);
    }
  }, [profileId, activeProfileLoading]);

  return {
    profile,
    profileFullName,
    profileId,
    loading: loading || activeProfileLoading,
    error,
    refetch: fetchProfile,
  };
};
