import { useState } from "react";
import { Alert } from "react-native";

interface TimeState {
  value: string;
  error: boolean;
}

export const useTimePickerValidation = () => {
  const [startTime, setStartTime] = useState<TimeState>({
    value: "",
    error: false,
  });
  const [endTime, setEndTime] = useState<TimeState>({
    value: "",
    error: false,
  });
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);

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

  const validateTime = (time: string): boolean => {
    if (time.length !== 5) return true;

    const [hours, minutes] = time.split(":");
    const hoursNum = parseInt(hours, 10);
    const minutesNum = parseInt(minutes, 10);

    return hoursNum <= 23 && minutesNum <= 59;
  };

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

  const toggleSwitch = () => {
    setIsSwitchEnabled(!isSwitchEnabled);
    if (!isSwitchEnabled) {
      setStartTime({ value: "", error: false });
      setEndTime({ value: "", error: false });
    }
  };

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
