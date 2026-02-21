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

  const commonDomains = [
    "gmail.com",
    "outlook.com",
    "hotmail.com",
    "yahoo.com",
    "icloud.com",
    "live.com",
    "msn.com",
    "aol.com",
    "protonmail.com",
    "zoho.com",
    "mail.com",
  ];

  const validateEmailFormat = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return false;
    }

    const domain = email.split("@")[1]?.toLowerCase();
    return commonDomains.includes(domain);
  };

  const clearErrors = () => {
    setEmailError("");
    setConfirmEmailError("");
  };

  const validateEmails = async (): Promise<boolean> => {
    clearErrors();
    setIsChecking(true);
    let hasError = false;

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedConfirmEmail = confirmEmail.trim().toLowerCase();

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
