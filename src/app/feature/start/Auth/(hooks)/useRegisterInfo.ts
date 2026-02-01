import { useState } from "react";

interface UseRegisterInfoProps {
  onValidationSuccess?: (data: { name: string; age: string }) => void;
}

export const useRegisterInfo = ({
  onValidationSuccess,
}: UseRegisterInfoProps = {}) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [nameError, setNameError] = useState("");
  const [ageError, setAgeError] = useState("");

  const validateName = (name: string): boolean => {
    return name.trim().length > 0;
  };

  const validateAge = (age: string): boolean => {
    const ageNum = parseInt(age);
    return (
      age.trim().length > 0 && !isNaN(ageNum) && ageNum > 0 && ageNum < 150
    );
  };

  const clearErrors = () => {
    setNameError("");
    setAgeError("");
  };

  const validateForm = (): boolean => {
    clearErrors();
    let hasError = false;

    // Validar nombre
    if (!validateName(name)) {
      setNameError("Por favor ingresa un nombre válido");
      hasError = true;
    }

    // Validar edad
    if (!validateAge(age)) {
      setAgeError("Por favor ingresa una edad válida");
      hasError = true;
    }

    if (!hasError && onValidationSuccess) {
      onValidationSuccess({ name: name.trim(), age: age.trim() });
    }

    return !hasError;
  };

  const isFormValid = name.trim().length > 0 && age.trim().length > 0;

  const resetForm = () => {
    setName("");
    setAge("");
    clearErrors();
  };

  return {
    name,
    setName,
    age,
    setAge,
    nameError,
    ageError,
    isFormValid,
    validateForm,
    clearErrors,
    resetForm,
  };
};
