import { useActiveProfile } from "@/src/app/contexts/ActiveProfileContext";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { useUserProfiles } from "../../start/Auth/hooks/useUserProfiles";
import { profileManagementService } from "../services/profileManagement.Service";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export const useProfileEdit = (
  profileId: string,
  initialName: string,
  initialAvatarUrl: string | null,
) => {
  const [fullName, setFullName] = useState(initialName);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPickingImage, setIsPickingImage] = useState(false);
  const { updateProfile } = useUserProfiles();
  const { id: activeProfileId, update: updateActiveProfile } = useActiveProfile();

  const handlePickAvatar = useCallback(async () => {
    try {
      setIsPickingImage(true);
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        setErrorMessage("Necesitamos permiso para acceder a tus imágenes");
        setShowError(true);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]?.uri) {
        return;
      }

      setAvatarUrl(result.assets[0].uri);
    } catch {
      setErrorMessage("No se pudo seleccionar la imagen");
      setShowError(true);
    } finally {
      setIsPickingImage(false);
    }
  }, []);

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
        const hasNameChanged = newName !== initialName;
        const hasAvatarChanged = avatarUrl !== initialAvatarUrl;

        if (!hasNameChanged && !hasAvatarChanged) {
          if (onSuccess) {
            onSuccess();
          }
          return;
        }

        if (hasNameChanged) {
          const nameResult = await profileManagementService.updateProfileName(
            profileId,
            newName,
          );

          if (!nameResult.success) {
            setErrorMessage(
              nameResult.error || "Error al actualizar el perfil",
            );
            setShowError(true);
            return;
          }
        }

        if (hasAvatarChanged && avatarUrl) {
          const uploadResult = await profileManagementService.uploadAvatar(
            profileId,
            avatarUrl,
          );

          if (!uploadResult.success) {
            setErrorMessage(uploadResult.error || "Error al subir el avatar");
            setShowError(true);
            return;
          }

          const publicUrl = uploadResult.url;

          const avatarResult =
            await profileManagementService.updateProfileAvatar(
              profileId,
              publicUrl,
            );

          if (!avatarResult.success) {
            setErrorMessage(
              avatarResult.error || "Error al actualizar el avatar",
            );
            setShowError(true);
            return;
          }

          setAvatarUrl(publicUrl);
        }

        await updateProfile(profileId, {
          display_name: newName,
          avatar_url: avatarUrl,
        });

        if (activeProfileId === profileId) {
          await updateActiveProfile({
            displayName: hasNameChanged ? newName : undefined,
            avatarUrl: hasAvatarChanged ? avatarUrl : undefined,
          });
        }

        setShowSuccess(true);

        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
      } catch (error: unknown) {
        setErrorMessage(
          getErrorMessage(error, "Error al actualizar el perfil"),
        );
        setShowError(true);
      } finally {
        setIsSaving(false);
      }
    },
    [
      avatarUrl,
      fullName,
      initialAvatarUrl,
      initialName,
      profileId,
      updateProfile,
      activeProfileId,
      updateActiveProfile,
    ],
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
    avatarUrl,
    isPickingImage,
    handlePickAvatar,
    showError,
    showSuccess,
    errorMessage,
    isSaving,
    handleSave,
    closeError,
    closeSuccess,
  };
};
