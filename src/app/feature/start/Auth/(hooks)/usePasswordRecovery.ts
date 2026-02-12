import { useState } from "react";
import { authService } from "../(services)/authService";

export const usePasswordRecovery = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Verifica el código OTP para recuperación de contraseña
   * @param email - Email del usuario
   * @param code - Código OTP de 6 dígitos
   * @returns Resultado de la verificación
   */
  const verifyRecoveryCode = async (email: string, code: string) => {
    setIsVerifying(true);

    try {
      // Verificar OTP con tipo 'recovery'
      const result = await authService.verifyOTP(email, code, "email");

      if (!result.success) {
        return {
          success: false,
          error: result.error || "Código de verificación incorrecto",
        };
      }

      // Verificar que haya sesión después de la verificación
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
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al verificar código",
      };
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * Actualiza la contraseña del usuario
   * @param newPassword - Nueva contraseña
   * @returns Resultado de la actualización
   */
  const updatePassword = async (newPassword: string) => {
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
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al actualizar contraseña",
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
