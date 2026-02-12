import { useEffect, useRef, useState } from "react";
import { Keyboard, TextInput } from "react-native";
import { UseCodeVerificationProps } from "../(models)/hook.types";

export const useCodeVerification = ({
  codeLength = 6,
  onComplete,
}: UseCodeVerificationProps = {}) => {
  const [code, setCode] = useState<string[]>(Array(codeLength).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleCodeChange = (value: string, index: number) => {
    // Solo permitir números
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-avanzar al siguiente campo
    if (value && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (value && index === codeLength - 1) {
      // Cerrar teclado al completar el último dígito
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Retroceder al campo anterior al presionar backspace
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const resetCode = () => {
    setCode(Array(codeLength).fill(""));
    inputRefs.current[0]?.focus();
  };

  const getFullCode = () => code.join("");

  const isCodeComplete = () => code.every((digit) => digit !== "");

  // Usar useRef para evitar llamadas múltiples
  const hasVerifiedRef = useRef(false);

  // Verificar automáticamente cuando se complete el código
  useEffect(() => {
    const fullCode = getFullCode();
    if (
      fullCode.length === codeLength &&
      !isVerifying &&
      !hasVerifiedRef.current &&
      onComplete
    ) {
      hasVerifiedRef.current = true;
      onComplete(fullCode);
    }
  }, [code, codeLength, isVerifying]);

  // Resetear el flag cuando el código cambia
  useEffect(() => {
    if (code.some((digit) => digit === "")) {
      hasVerifiedRef.current = false;
    }
  }, [code]);

  return {
    code,
    inputRefs,
    isVerifying,
    setIsVerifying,
    handleCodeChange,
    handleKeyPress,
    resetCode,
    getFullCode,
    isCodeComplete,
  };
};
