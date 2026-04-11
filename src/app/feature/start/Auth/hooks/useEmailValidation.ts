import { useState } from "react";
import { UseEmailValidationProps } from "../models/auth.props";
import { authService } from "../services/auth.Service";

export const useEmailValidation = ({
  onValidationSuccess,
}: UseEmailValidationProps = {}) => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [confirmEmailError, setConfirmEmailError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const normalizeEmail = (value: string) => value.trim().toLowerCase();

  const validateEmailFormat = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
  };

  const clearErrors = () => {
    setEmailError("");
    setConfirmEmailError("");
  };

  const validateEmails = async (): Promise<boolean> => {
    clearErrors();
    setIsChecking(true);
    let hasError = false;

    const normalizedEmail = normalizeEmail(email);
    const normalizedConfirmEmail = normalizeEmail(confirmEmail);

    if (!validateEmailFormat(normalizedEmail)) {
      setEmailError("Formato de correo incorrecto");
      hasError = true;
      setIsChecking(false);
      return false;
    }

    if (normalizedEmail !== normalizedConfirmEmail) {
      setConfirmEmailError("Los correos no coinciden");
      hasError = true;
      setIsChecking(false);
      return false;
    }

    if (!hasError) {
      const result = await authService.checkEmailExists(normalizedEmail);

      if (!result.success) {
        setEmailError("Error al verificar el correo. Intenta nuevamente.");
        setIsChecking(false);
        return false;
      }

      if (result.exists) {
        setEmailError(
          "Este correo ya está registrado. Por favor usa otro correo.",
        );
        setIsChecking(false);
        return false;
      }
    }

    setIsChecking(false);

    if (!hasError && onValidationSuccess) {
      onValidationSuccess(normalizedEmail);
    }

    return !hasError;
  };

  const isFormValid = email.trim().length > 0 && confirmEmail.trim().length > 0;

  const resetForm = () => {
    setEmail("");
    setConfirmEmail("");
    clearErrors();
  };

  return {
    email,
    setEmail,
    confirmEmail,
    setConfirmEmail,
    emailError,
    confirmEmailError,
    isFormValid,
    validateEmails,
    clearErrors,
    resetForm,
    isChecking,
  };
};
