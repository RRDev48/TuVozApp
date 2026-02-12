import { useState } from "react";
import { UseEmailValidationProps } from "../(models)/hook.types";

export const useEmailValidation = ({
  onValidationSuccess,
}: UseEmailValidationProps = {}) => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [confirmEmailError, setConfirmEmailError] = useState("");

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
    // Validar formato básico: debe tener al menos un carácter antes del @
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return false;
    }

    // Validar dominios comunes
    const domain = email.split("@")[1]?.toLowerCase();
    return commonDomains.includes(domain);
  };

  const clearErrors = () => {
    setEmailError("");
    setConfirmEmailError("");
  };

  const validateEmails = (): boolean => {
    clearErrors();
    let hasError = false;

    // Validar email
    if (!validateEmailFormat(email)) {
      setEmailError("Formato de correo incorrecto");
      hasError = true;
    }

    // Validar que los emails coincidan
    if (email !== confirmEmail) {
      setConfirmEmailError("Los correos no coinciden");
      hasError = true;
    }

    if (!hasError && onValidationSuccess) {
      onValidationSuccess(email);
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
  };
};
