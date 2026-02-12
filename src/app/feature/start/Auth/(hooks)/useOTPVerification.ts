import { useErrorHandling } from "@/src/app/feature/ajustes/(hooks)/useErrorHandling";
import type { UserRole } from "@/src/types/database.types";
import { useState } from "react";
import { UseOTPVerificationProps } from "../(models)/hook.types";
import { authService } from "../(services)/authService";

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
      logAndShowError(
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
        logAndShowError(
          response.error || "Código de verificación incorrecto",
          new Error(response.error || "Código de verificación incorrecto"),
          {
            context: "otp_verification_failed",
            metadata: { email, response_success: response.success },
          },
        );
        return false;
      }

      // After successful verification, create user record and profile if userData is provided
      if (userData && response.data?.user) {
        const userId = response.data.user.id;

        // Small delay to ensure session is fully established
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Verify we have a session (user is authenticated)
        const currentUser = await authService.getCurrentUser();

        if (!currentUser) {
          console.error("No authenticated session after OTP verification");
          logAndShowError(
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

        // Create user record and profile using RPC function (bypasses RLS)
        const result = await authService.createUserWithProfile(userId, {
          full_name: userData.name,
          role: userData.role as UserRole,
          email: email,
          age: parseInt(userData.age),
        });

        if (!result.success) {
          console.error("Error creating user and profile:", result.error);
          logAndShowError(
            `No se pudo completar el registro: ${result.error}`,
            new Error(`No se pudo completar el registro: ${result.error}`),
            {
              context: "user_profile_creation_failed",
              metadata: { email, user_id: userId, role: userData.role },
            },
          );
        } else {
        }
      }

      onSuccess();
      return true;
    } catch (error) {
      logAndShowError(
        (error as Error).message || "Error en verificación OTP",
        error as Error,
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
