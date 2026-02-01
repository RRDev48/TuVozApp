import { useState } from "react";
import { Alert } from "react-native";
import { authService } from "../(services)/authService";

interface UseOTPVerificationProps {
  email: string;
  onSuccess: () => void;
}

export const useOTPVerification = ({
  email,
  onSuccess,
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
    isVerifying,
    setIsVerifying,
    verifyCode,
  };
};
