import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { supportService } from "../(services)/supportService";

export const useSupportForm = (navigation: any) => {
  const [subject, setSubject] = useState("");
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!subject.trim() || !query.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await supportService.createTicket({
        subject: subject.trim(),
        message: query.trim(),
        priority: "normal",
      });

      if (response.success) {
        Alert.alert(
          "Éxito",
          "Tu consulta ha sido enviada. Te contactaremos pronto.",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ],
        );
      } else {
        Alert.alert(
          "Error",
          response.error || "No se pudo enviar tu consulta. Intenta de nuevo.",
        );
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error inesperado. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }, [subject, query, navigation]);

  return {
    subject,
    setSubject,
    query,
    setQuery,
    isSubmitting,
    handleSubmit,
  };
};
