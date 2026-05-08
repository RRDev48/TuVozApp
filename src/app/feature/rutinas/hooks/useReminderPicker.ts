import { useEffect, useState } from "react";
import i18n from "@/src/app/i18n";
import { ReminderOption } from "../models/options.types";

const REMINDER_OPTIONS: ReminderOption[] = [
  { label: "10 minutos antes", labelKey: "10MinutesBefore", value: "600000" },
  { label: "1 hora antes", labelKey: "1HourBefore", value: "3600000" },
  { label: "1 día antes", labelKey: "1DayBefore", value: "86400000" },
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
    const option = REMINDER_OPTIONS.find((option) => option.value === selectedOption);
    return option ? (option.labelKey ? i18n.t(option.labelKey) : option.label) : "";
  };

  const getOptions = (): ReminderOption[] => {
    return REMINDER_OPTIONS.map((option) => ({
      ...option,
      label: option.labelKey ? i18n.t(option.labelKey) : option.label,
    }));
  };

  const getSelectedOffsetMs = (): number | null => {
    if (!selectedOption) return null;
    return parseInt(selectedOption, 10);
  };

  return {
    selectedOption,
    setSelectedOption,
    options: getOptions(),
    getSelectedLabel,
    getSelectedOffsetMs,
  };
};
