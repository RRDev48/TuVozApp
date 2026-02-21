import { useState } from "react";
import { UsePasswordSetupProps } from "../models/auth.props";

export const usePasswordSetup = ({
  minLength = 8,
  onValidationSuccess,
}: UsePasswordSetupProps = {}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validatePasswordFormat = (password: string): boolean => {
    return password.length >= minLength;
  };

  const clearErrors = () => {
    setPasswordError("");
    setConfirmPasswordError("");
  };

  const validatePasswords = (): boolean => {
    clearErrors();
    let hasError = false;

    if (!validatePasswordFormat(password)) {
      setPasswordError(
        `La contraseña debe tener al menos ${minLength} caracteres`,
      );
      hasError = true;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden");
      hasError = true;
    }

    if (!hasError && onValidationSuccess) {
      onValidationSuccess(password);
    }

    return !hasError;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const isFormValid =
    password.trim().length > 0 && confirmPassword.trim().length > 0;

  const resetForm = () => {
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    clearErrors();
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    showConfirmPassword,
    passwordError,
    confirmPasswordError,
    isFormValid,
    validatePasswords,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    clearErrors,
    resetForm,
  };
};
