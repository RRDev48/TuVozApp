import { useEffect, useState } from "react";
import i18n from "@/src/app/i18n";
import { ReminderOption } from "../models/options.types";

const REMINDER_OPTIONS: ReminderOption[] = [
  { labelKey: "10MinutesBefore", value: "600000" },
  { labelKey: "1HourBefore", value: "3600000" },
  { labelKey: "1DayBefore", value: "86400000" },
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
    return option ? i18n.t(option.labelKey) : "";
  };

  const getOptions = (): ReminderOption[] => {
    return REMINDER_OPTIONS.map((option) => ({
      ...option,
      label: i18n.t(option.labelKey),
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
