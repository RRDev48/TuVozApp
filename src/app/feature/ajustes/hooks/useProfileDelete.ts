import { useCallback, useState } from "react";
import { profileManagementService } from "../services/profileManagement.Service";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

interface UseProfileDeleteResult {
  showConfirmDelete: boolean;
  showError: boolean;
  errorMessage: string;
  isDeleting: boolean;
  handleDelete: () => void;
  confirmDelete: (
    profileId: string,
    onComplete: (shouldSignOut: boolean) => void,
  ) => Promise<void>;
  cancelDelete: () => void;
  closeError: () => void;
}

export const useProfileDelete = (): UseProfileDeleteResult => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(() => {
    setShowConfirmDelete(true);
  }, []);

  const confirmDelete = useCallback(
    async (profileId: string, onComplete: (shouldSignOut: boolean) => void) => {
      setShowConfirmDelete(false);
      setIsDeleting(true);

      try {
        const deleteInfo =
          await profileManagementService.getProfileDeleteInfo(profileId);

        if (!deleteInfo.success) {
          setErrorMessage(
            deleteInfo.error || "Error al obtener información del perfil",
          );
          setShowError(true);
          setIsDeleting(false);
          return;
        }

        if (deleteInfo.isOwnProfile) {
          const result = await profileManagementService.deleteAllUserData();

          if (!result.success) {
            setErrorMessage(
              result.error || "Error al eliminar todos los datos del usuario",
            );
            setShowError(true);
            setIsDeleting(false);
            return;
          }

          await profileManagementService.signOut();
          onComplete(true);
        } else {
          const result =
            await profileManagementService.deleteSingleProfile(profileId);

          if (!result.success) {
            setErrorMessage(result.error || "Error al eliminar el perfil");
            setShowError(true);
            setIsDeleting(false);
            return;
          }

          onComplete(false);
        }
      } catch (error: unknown) {
        setErrorMessage(getErrorMessage(error, "Error al eliminar el perfil"));
        setShowError(true);
      } finally {
        setIsDeleting(false);
      }
    },
    [],
  );

  const cancelDelete = useCallback(() => {
    setShowConfirmDelete(false);
  }, []);

  const closeError = useCallback(() => {
    setShowError(false);
  }, []);

  return {
    showConfirmDelete,
    showError,
    errorMessage,
    isDeleting,
    handleDelete,
    confirmDelete,
    cancelDelete,
    closeError,
  };
};
