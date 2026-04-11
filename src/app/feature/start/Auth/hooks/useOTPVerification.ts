import { useErrorHandling } from "@/src/app/feature/ajustes/hooks/useErrorHandling";
import type { UserRole } from "@/src/app/feature/common/models/database.types";
import { useState } from "react";
import { UseOTPVerificationProps } from "../models/auth.props";
import { authService } from "../services/auth.Service";

const SESSION_SYNC_DELAY_MS = 500;

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}

export const useOTPVerification = ({
  email,
  onSuccess,
  userData,
}: UseOTPVerificationProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const { showErrorModal, errorMessage, logAndShowError, closeErrorModal } =
    useErrorHandling();

  const verifyCode = async (code: string) => {
    if (code.length !== 6) {
      await logAndShowError(
        "Por favor ingresa el código de 6 dígitos completo",
        new Error("Por favor ingresa el código de 6 dígitos completo"),
        {
          context: "otp_validation_failed",
          metadata: { email, code_length: code.length },
        },
      );
      return false;
    }

    setIsVerifying(true);

    try {
      const response = await authService.verifyOTP(email, code, "signup");

      if (response.error || !response.success) {
        await logAndShowError(
          response.error || "Código de verificación incorrecto",
          new Error(response.error || "Código de verificación incorrecto"),
          {
            context: "otp_verification_failed",
            metadata: { email, response_success: response.success },
          },
        );
        return false;
      }

      if (userData && response.data?.user) {
        const userId = response.data.user.id;

        await new Promise((resolve) =>
          setTimeout(resolve, SESSION_SYNC_DELAY_MS),
        );

        const currentUser = await authService.getCurrentUser();

        if (!currentUser) {
          await logAndShowError(
            "Verificación exitosa pero no se pudo autenticar. Por favor inicia sesión.",
            new Error(
              "Verificación exitosa pero no se pudo autenticar. Por favor inicia sesión.",
            ),
            {
              context: "auth_session_failed_after_otp",
              metadata: { email, user_id: userId },
            },
          );
          onSuccess();
          return true;
        }

        const result = await authService.createUserWithProfile(userId, {
          full_name: userData.name,
          role: userData.role as UserRole,
          email: email,
          isOwner: userData.isOwner ?? true,
          ownerUserId: userData.ownerUserId,
        });

        if (!result.success) {
          await logAndShowError(
            `No se pudo completar el registro: ${result.error}`,
            new Error(`No se pudo completar el registro: ${result.error}`),
            {
              context: "user_profile_creation_failed",
              metadata: { email, user_id: userId, role: userData.role },
            },
          );
        }
      }

      onSuccess();
      return true;
    } catch (error: unknown) {
      const message = getErrorMessage(error, "Error en verificación OTP");

      await logAndShowError(
        message,
        error instanceof Error ? error : undefined,
        {
          context: "otp_verification_error",
          metadata: { email },
        },
      );
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    verifyCode,
    isVerifying,
    showErrorModal,
    closeErrorModal,
    errorMessage,
  };
};
