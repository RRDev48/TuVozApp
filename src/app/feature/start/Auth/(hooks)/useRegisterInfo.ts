import { useState } from "react";
import { UseRegisterInfoProps } from "../(models)/hook.types";

export const useRegisterInfo = ({
  onValidationSuccess,
}: UseRegisterInfoProps = {}) => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const validateName = (name: string): boolean => {
    return name.trim().length > 0;
  };

  const clearErrors = () => {
    setNameError("");
  };

  const validateForm = (): boolean => {
    clearErrors();
    let hasError = false;

    // Validar nombre
    if (!validateName(name)) {
      setNameError("Por favor ingresa un nombre válido");
      hasError = true;
    }

    if (!hasError && onValidationSuccess) {
      onValidationSuccess({ name: name.trim() });
    }

    return !hasError;
  };

  const isFormValid = name.trim().length > 0;

  const resetForm = () => {
    setName("");
    clearErrors();
  };

  return {
    name,
    setName,
    nameError,
    isFormValid,
    validateForm,
    clearErrors,
    resetForm,
  };
};
