import { useEffect, useState } from "react";
import { ReminderOption } from "../models/options.types";

const REMINDER_OPTIONS: ReminderOption[] = [
  { label: "10 Minutos Antes", value: "600000" },
  { label: "1 Hora Antes", value: "3600000" },
  { label: "1 Día Antes", value: "86400000" },
];

export const useReminderPicker = (
  initialSelectedOption: string | null | undefined,
  visible: boolean,
) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    initialSelectedOption || null,
  );

  useEffect(() => {
    setSelectedOption(initialSelectedOption || null);
  }, [initialSelectedOption, visible]);

  const getSelectedLabel = (): string => {
    return (
      REMINDER_OPTIONS.find((option) => option.value === selectedOption)
        ?.label || ""
    );
  };

  const getSelectedOffsetMs = (): number | null => {
    if (!selectedOption) return null;
    return parseInt(selectedOption, 10);
  };

  return {
    selectedOption,
    setSelectedOption,
    options: REMINDER_OPTIONS,
    getSelectedLabel,
    getSelectedOffsetMs,
  };
};
