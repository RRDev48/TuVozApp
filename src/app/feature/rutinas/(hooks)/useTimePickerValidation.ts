// React
import { useState } from "react";
import { Alert } from "react-native";

// Componentes

// Constantes

// Modelos

// Hooks

// Servicios

// Acciones

// Visuales

// Estructura interna para manejar el valor y el estado de error
// de un campo de hora (inicio o fin).
interface TimeState {
  value: string;
  error: boolean;
}

/**
 * Hook que encapsula la lógica de entrada y validación de horas
 * para el selector de tiempo de las tareas.
 *
 * Responsabilidades:
 * - Formatear la entrada del usuario al escribir horas (de "0830" a "08:30").
 * - Validar que las horas estén en el rango 00–23 y los minutos 00–59.
 * - Gestionar si el usuario quiere usar un rango horario específico o "todo el día"
 *   mediante un switch (`isSwitchEnabled`).
 * - Exponer una función `validateBeforeClose` que se usa antes de cerrar el modal
 *   para asegurar que los datos sean coherentes y mostrar alertas si no lo son.
 */
export const useTimePickerValidation = () => {
  // Estado de la hora de inicio.
  const [startTime, setStartTime] = useState<TimeState>({
    value: "",
    error: false,
  });
  // Estado de la hora de fin.
  const [endTime, setEndTime] = useState<TimeState>({
    value: "",
    error: false,
  });
  // Indica si el switch de "usar horario específico" está activo.
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);

  // Normaliza el texto introducido por el usuario para forzar el formato HH:mm.
  // - Elimina caracteres no numéricos.
  // - Limita a 4 dígitos (HHmm).
  // - Inserta los dos puntos cuando hay al menos 2 dígitos.
  const formatTimeInput = (text: string): string => {
    let filteredText = text.replace(/[^0-9]/g, "");

    if (filteredText.length > 4) {
      filteredText = filteredText.substring(0, 4);
    }

    if (filteredText.length >= 2) {
      const hours = filteredText.substring(0, 2);
      const minutes = filteredText.substring(2, 4);
      return `${hours}:${minutes}`;
    }

    return filteredText;
  };

  // Valida que una hora en formato HH:mm esté dentro de rangos válidos.
  // Devuelve true si es válida o si aún no tiene el largo completo (5),
  // para no marcar como error mientras el usuario está escribiendo.
  const validateTime = (time: string): boolean => {
    if (time.length !== 5) return true;

    const [hours, minutes] = time.split(":");
    const hoursNum = parseInt(hours, 10);
    const minutesNum = parseInt(minutes, 10);

    return hoursNum <= 23 && minutesNum <= 59;
  };

  // Maneja el cambio de texto en los campos de inicio/fin, aplicando formato
  // y validación. Si el valor no es válido, limpia el campo y marca error.
  const handleTimeChange = (text: string, type: "start" | "end"): void => {
    const formattedTime = formatTimeInput(text);
    const isValid = validateTime(formattedTime);

    if (type === "start") {
      if (!isValid) {
        setStartTime({ value: "", error: true });
        return;
      }
      setStartTime({ value: formattedTime, error: false });
    } else {
      if (!isValid) {
        setEndTime({ value: "", error: true });
        return;
      }
      setEndTime({ value: formattedTime, error: false });
    }
  };

  // Activa o desactiva el uso de rango horario específico.
  // Al activarlo por primera vez, limpia los campos para que el usuario
  // ingrese los valores desde cero.
  const toggleSwitch = () => {
    setIsSwitchEnabled(!isSwitchEnabled);
    if (!isSwitchEnabled) {
      setStartTime({ value: "", error: false });
      setEndTime({ value: "", error: false });
    }
  };

  // Realiza validaciones finales antes de cerrar el modal de tiempo.
  // - Si el switch está activo y hay errores, muestra una alerta.
  // - Si los campos están vacíos, asigna valores por defecto (00:00 / 23:59).
  // - Verifica el formato HH:mm con una expresión regular.
  const validateBeforeClose = (): boolean => {
    if (isSwitchEnabled && (startTime.error || endTime.error)) {
      Alert.alert(
        "Error",
        "Por favor, corrija los valores de las horas. Las horas deben estar entre 00-23 y los minutos entre 00-59.",
      );
      return false;
    }

    const finalStartTime = startTime.value || "00:00";
    const finalEndTime = endTime.value || "23:59";

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (
      (isSwitchEnabled && !timeRegex.test(finalStartTime)) ||
      (isSwitchEnabled && !timeRegex.test(finalEndTime))
    ) {
      Alert.alert("Error", "Por favor, ingrese las horas en el formato HH:mm.");
      return false;
    }

    return true;
  };

  return {
    startTime,
    endTime,
    isSwitchEnabled,
    handleTimeChange,
    toggleSwitch,
    validateBeforeClose,
  };
};
