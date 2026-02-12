import type { UserRole } from "@/src/types/database.types";
import { useState } from "react";
import { Alert } from "react-native";
import { authService } from "../(services)/authService";

interface UseOTPVerificationProps {
  email: string;
  onSuccess: () => void;
  userData?: {
    name: string;
    age: string;
    role: string;
  };
}

export const useOTPVerification = ({
  email,
  onSuccess,
  userData,
}: UseOTPVerificationProps) => {
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyCode = async (code: string) => {
    if (code.length !== 6) {
      Alert.alert("Error", "Por favor ingresa el código de 6 dígitos completo");
      return false;
    }

    setIsVerifying(true);

    try {
      const response = await authService.verifyOTP(email, code, "signup");

      if (response.error || !response.success) {
        Alert.alert(
          "Error",
          response.error || "Código de verificación incorrecto",
        );
        return false;
      }

      // After successful verification, create user record and profile if userData is provided
      if (userData && response.data?.user) {
        const userId = response.data.user.id;

        console.log("Starting user record and profile creation for:", userId);
        console.log("Session data:", response.data.session);

        // Small delay to ensure session is fully established
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Verify we have a session (user is authenticated)
        const currentUser = await authService.getCurrentUser();
        console.log("Current user after verification:", currentUser);

        if (!currentUser) {
          console.error("No authenticated session after OTP verification");
          Alert.alert(
            "Advertencia",
            "Verificación exitosa pero no se pudo autenticar. Por favor inicia sesión.",
          );
          onSuccess();
          return true;
        }

        console.log("User authenticated, creating records...");

        // Create user record and profile using RPC function (bypasses RLS)
        const result = await authService.createUserWithProfile(userId, {
          full_name: userData.name,
          role: userData.role as UserRole,
          email: email,
          age: parseInt(userData.age),
        });

        if (!result.success) {
          console.error("Error creating user and profile:", result.error);
          Alert.alert(
            "Advertencia",
            `No se pudo completar el registro: ${result.error}`,
          );
        } else {
          console.log("User and profile created successfully");
        }
      }

      onSuccess();
      return true;
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al verificar el código");
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    verifyCode,
  };
};
