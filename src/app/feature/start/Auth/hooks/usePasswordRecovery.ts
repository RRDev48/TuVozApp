import { useState } from "react";
import { authService } from "../services/auth.Service";

type PasswordRecoveryResult =
  | { success: true; session?: unknown }
  | { success: false; error: string };

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}

export const usePasswordRecovery = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const verifyRecoveryCode = async (
    email: string,
    code: string,
  ): Promise<PasswordRecoveryResult> => {
    setIsVerifying(true);

    try {
      const result = await authService.verifyOTP(email, code, "email");

      if (!result.success) {
        return {
          success: false,
          error: result.error || "Código de verificación incorrecto",
        };
      }

      const session = result.data?.session;
      if (!session) {
        return {
          success: false,
          error: "No se pudo establecer la sesión de recuperación",
        };
      }

      return {
        success: true,
        session,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al verificar código"),
      };
    } finally {
      setIsVerifying(false);
    }
  };

  const updatePassword = async (
    newPassword: string,
  ): Promise<PasswordRecoveryResult> => {
    setIsUpdating(true);

    try {
      const result = await authService.updatePassword(newPassword);

      if (!result.success) {
        return {
          success: false,
          error: result.error || "Error al actualizar contraseña",
        };
      }

      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al actualizar contraseña"),
      };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    verifyRecoveryCode,
    updatePassword,
    isVerifying,
    isUpdating,
  };
};
