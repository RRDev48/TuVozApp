import { useCallback, useState } from "react";
import { useUserProfiles } from "../../start/Auth/hooks/useUserProfiles";
import { profileManagementService } from "../services/profileManagement.Service";

export const useProfileEdit = (profileId: string, initialName: string) => {
  const [fullName, setFullName] = useState(initialName);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { updateProfile } = useUserProfiles();

  const handleSave = useCallback(
    async (onSuccess?: () => void) => {
      if (!fullName.trim()) {
        setErrorMessage("Por favor ingrese un nombre");
        setShowError(true);
        return;
      }

      setIsSaving(true);

      try {
        const newName = fullName.trim();

        const result = await profileManagementService.updateProfileName(
          profileId,
          newName,
        );

        if (!result.success) {
          setErrorMessage(result.error || "Error al actualizar el perfil");
          setShowError(true);
          return;
        }

        await updateProfile(profileId, { full_name: newName });

        setShowSuccess(true);

        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
      } catch (error: any) {
        setErrorMessage("Error al actualizar el perfil");
        setShowError(true);
      } finally {
        setIsSaving(false);
      }
    },
    [fullName, profileId, updateProfile],
  );

  const closeError = useCallback(() => {
    setShowError(false);
  }, []);

  const closeSuccess = useCallback(() => {
    setShowSuccess(false);
  }, []);

  return {
    fullName,
    setFullName,
    showError,
    showSuccess,
    errorMessage,
    isSaving,
    handleSave,
    closeError,
    closeSuccess,
  };
};
